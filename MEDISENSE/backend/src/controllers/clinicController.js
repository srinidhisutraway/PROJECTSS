import axios from 'axios';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// Free, public, no API key required — OpenStreetMap's query engine.
// Multiple public mirrors are tried in sequence since the main instance
// can get temporarily overloaded; no billing or Google Cloud project
// needed for any of these.
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

const buildOverpassQuery = (lat, lng, radiusMeters) => `
[out:json][timeout:25];
(
  node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
  way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
  node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
  way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
  node["amenity"="doctors"](around:${radiusMeters},${lat},${lng});
  way["amenity"="doctors"](around:${radiusMeters},${lat},${lng});
  node["healthcare"](around:${radiusMeters},${lat},${lng});
  way["healthcare"](around:${radiusMeters},${lat},${lng});
);
out center tags;
`;

const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const isDermRelated = (tags = {}) => {
  const haystack = [tags.name, tags.healthcare, tags['healthcare:speciality'], tags.speciality]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes('derma') || haystack.includes('skin');
};

// @desc    Find nearby dermatologists/hospitals/clinics via OpenStreetMap
//          (free — no API key, no billing)
// @route   GET /api/clinics/nearby?lat=&lng=&radius=
export const getNearbyClinics = catchAsync(async (req, res, next) => {
  const { lat, lng, radius = 15000 } = req.query;
  if (!lat || !lng) return next(new AppError('Latitude and longitude are required.', 400));

  let data;
  let lastError;
  for (const mirrorUrl of OVERPASS_MIRRORS) {
    try {
      const response = await axios.post(mirrorUrl, buildOverpassQuery(lat, lng, radius), {
        headers: {
          'Content-Type': 'text/plain',
          // OpenStreetMap's usage policy requires a descriptive User-Agent
          // identifying the application — generic/script-like requests
          // (axios's default UA) get rejected (406) or rate-limited (429)
          // by these public servers as an anti-abuse measure.
          'User-Agent': 'MediSense-FinalYearProject/1.0 (educational skin-health app; nearby-clinics feature)',
          Accept: 'application/json',
        },
        timeout: 20000,
      });
      data = response.data;
      break; // success — stop trying further mirrors
    } catch (err) {
      lastError = err;
      const detail = err.response?.data
        ? (typeof err.response.data === 'string' ? err.response.data.slice(0, 500) : JSON.stringify(err.response.data).slice(0, 500))
        : err.message;
      console.error(`[Clinics] Overpass mirror failed (${mirrorUrl}) [status ${err.response?.status || 'n/a'}]:`, detail);
    }
  }

  if (!data) {
    console.error('[Clinics] All Overpass mirrors failed. Last error:', lastError?.message);
    return next(
      new AppError(
        'Could not reach the nearby-clinics service (OpenStreetMap) right now. Please try again in a moment.',
        503
      )
    );
  }

  const elements = data.elements || [];

  const results = elements
    .map((el) => {
      const tags = el.tags || {};
      const location = el.type === 'node' ? { lat: el.lat, lng: el.lon } : { lat: el.center?.lat, lng: el.center?.lon };
      if (!location.lat || !location.lng) return null;

      const addressParts = [tags['addr:housenumber'], tags['addr:street'], tags['addr:suburb'], tags['addr:city']].filter(Boolean);

      return {
        placeId: `osm-${el.type}-${el.id}`,
        name: tags.name || 'Unnamed clinic/hospital',
        address: addressParts.length > 0 ? addressParts.join(', ') : tags['addr:full'] || null,
        location,
        phone: tags.phone || tags['contact:phone'] || null,
        website: tags.website || tags['contact:website'] || null,
        category: tags.amenity || tags.healthcare || 'healthcare',
        isDermatologyFocused: isDermRelated(tags),
        distanceKm: Math.round(haversineKm(Number(lat), Number(lng), location.lat, location.lng) * 10) / 10,
      };
    })
    .filter(Boolean)
    .filter((r) => r.name !== 'Unnamed clinic/hospital' || r.phone || r.website) // drop low-quality unnamed/no-contact entries
    .sort((a, b) => {
      // Dermatology-focused first, then nearest
      if (a.isDermatologyFocused !== b.isDermatologyFocused) return a.isDermatologyFocused ? -1 : 1;
      return a.distanceKm - b.distanceKm;
    });

  const topPicks = results.slice(0, 3);

  res.status(200).json({ success: true, results, topPicks });
});
