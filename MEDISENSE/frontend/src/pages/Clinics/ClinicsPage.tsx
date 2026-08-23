import React, { useState } from 'react';
import { MapPin, Navigation, Clock, LocateFixed, AlertCircle, Phone, Globe, Award, Stethoscope } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LeafletMapView from '../../components/clinics/LeafletMapView';
import { useNearbyClinics } from '../../hooks/useClinics';

const ClinicsPage: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const { data, isLoading, isError, error: clinicsError } = useNearbyClinics(coords?.lat, coords?.lng);

  const requestLocation = () => {
    setLocating(true);
    setError('');
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError('Location permission denied. Enable it to find nearby clinics.');
        setLocating(false);
      }
    );
  };

  return (
    <DashboardLayout title="Nearby Clinics">
      {!coords && (
        <div className="glass-card flex flex-col items-center gap-4 p-12 text-center">
          <MapPin size={40} className="text-teal-600" />
          <div>
            <h3 className="font-display text-lg font-semibold text-ink dark:text-canvas">Find dermatologists near you</h3>
            <p className="mt-1 max-w-sm text-sm text-ink/60 dark:text-canvas/60">
              We need your location to find nearby clinics and hospitals. Powered by OpenStreetMap — completely free, no account or billing required.
            </p>
          </div>
          <button onClick={requestLocation} disabled={locating} className="btn-primary">
            <LocateFixed size={16} /> {locating ? 'Locating\u2026' : 'Share my location'}
          </button>
          {error && <p className="text-xs text-clay-600">{error}</p>}
        </div>
      )}

      {coords && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-ink/60 dark:text-canvas/60">
              Showing dermatologists, clinics, and hospitals near you (OpenStreetMap data).
            </p>
            <button onClick={requestLocation} className="text-sm font-medium text-teal-600 dark:text-teal-300">
              Refresh location
            </button>
          </div>

          {isLoading && (
            <div className="space-y-3">
              <div className="skeleton h-[420px] w-full" />
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 w-full" />)}
            </div>
          )}

          {isError && (
            <div className="glass-card p-8 text-center">
              <AlertCircle size={32} className="mx-auto text-clay-500" />
              <p className="mt-3 text-sm text-ink/60 dark:text-canvas/60">
                {(clinicsError as any)?.response?.data?.message || 'Could not load nearby clinics. Please try again in a moment.'}
              </p>
            </div>
          )}

          {!isLoading && !isError && data?.results.length === 0 && (
            <div className="glass-card p-10 text-center text-sm text-ink/60 dark:text-canvas/60">
              No clinics found nearby in OpenStreetMap's data for this area. Try refreshing, or check back later as map data grows.
            </div>
          )}

          {!isLoading && !isError && data && data.results.length > 0 && (
            <>
              <div className="glass-card mb-6 overflow-hidden p-2">
                <LeafletMapView center={coords} clinics={data.results} />
              </div>

              {data.topPicks?.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink dark:text-canvas">
                    <Award size={18} className="text-amber-500" /> Closest / most relevant picks
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {data.topPicks.map((clinic, i) => (
                      <div key={clinic.placeId} className="glass-card p-5">
                        <div className="flex items-center justify-between">
                          <span className="badge bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">#{i + 1}</span>
                          {clinic.isDermatologyFocused && (
                            <span className="flex items-center gap-1 text-xs font-medium text-teal-600 dark:text-teal-300">
                              <Stethoscope size={13} /> Dermatology
                            </span>
                          )}
                        </div>
                        <p className="mt-2 font-medium text-ink dark:text-canvas">{clinic.name}</p>
                        <p className="text-xs text-ink/50 dark:text-canvas/50">{clinic.address || 'Address not available'}</p>

                        <div className="mt-3 space-y-1.5 text-xs text-ink/70 dark:text-canvas/70">
                          {clinic.distanceKm !== undefined && (
                            <p className="flex items-center gap-1.5"><MapPin size={12} /> {clinic.distanceKm} km away</p>
                          )}
                          {clinic.phone && (
                            <a href={`tel:${clinic.phone}`} className="flex items-center gap-1.5 hover:text-teal-600">
                              <Phone size={12} /> {clinic.phone}
                            </a>
                          )}
                          {clinic.website && (
                            <a href={clinic.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-teal-600">
                              <Globe size={12} /> Visit website
                            </a>
                          )}
                          {!clinic.phone && !clinic.website && (
                            <p className="flex items-center gap-1.5 text-ink/40"><Clock size={12} /> Contact details not available in map data</p>
                          )}
                        </div>

                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.location?.lat},${clinic.location?.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-teal mt-4 w-full !py-2 text-xs"
                        >
                          <Navigation size={13} /> Get directions
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="mb-3 font-display text-lg font-semibold text-ink dark:text-canvas">All nearby results</h3>
              <div className="space-y-3">
                {data.results.map((clinic) => (
                  <div key={clinic.placeId} className="glass-card flex items-center justify-between gap-4 p-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-ink dark:text-canvas">{clinic.name}</p>
                        {clinic.isDermatologyFocused && (
                          <span className="badge bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300 !py-0.5 !px-2 text-[10px]">Dermatology</span>
                        )}
                      </div>
                      <p className="text-sm text-ink/50 dark:text-canvas/50">{clinic.address || 'Address not available'}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink/60 dark:text-canvas/60">
                        {clinic.distanceKm !== undefined && <span>{clinic.distanceKm} km away</span>}
                        <span className="capitalize">{clinic.category}</span>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.location?.lat},${clinic.location?.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-teal shrink-0 !px-4 !py-2 text-xs"
                    >
                      <Navigation size={14} /> Directions
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default ClinicsPage;
