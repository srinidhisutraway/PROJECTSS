/**
 * Reference knowledge base of skin conditions, used to power the
 * searchable "Skin Conditions Encyclopedia" and the topbar search. This
 * mirrors the content in ml-service/app/core/knowledge_base.py (kept as
 * plain text here so the Node backend can serve/search it without calling
 * the Python service) — if you add a new disease class to the ML model,
 * add a matching entry here too so search/encyclopedia stays in sync.
 */

const CONDITIONS = [
  {
    slug: 'acne',
    label: 'Acne',
    category: 'inflammatory',
    explanation:
      "Acne occurs when hair follicles become clogged with oil and dead skin cells, often leading to whiteheads, blackheads, or inflamed pimples. It's commonly linked to hormonal changes, excess sebum production, and bacteria.",
    symptoms: ['Whiteheads or blackheads', 'Red, inflamed bumps', 'Occasional pus-filled lesions', 'Oily skin'],
    possibleCauses: ['Hormonal fluctuations', 'Excess oil production', 'Clogged pores', 'Diet and stress', 'Certain cosmetics'],
    dos: ['Change pillowcases regularly', 'Keep hands off your face', 'Introduce new actives one at a time'],
    donts: ["Don't over-exfoliate", "Don't use heavy comedogenic oils", "Don't skip sunscreen while on acne treatments"],
    keywords: ['acne', 'pimple', 'pimples', 'breakout', 'zit', 'blackhead', 'whitehead'],
  },
  {
    slug: 'eczema',
    label: 'Eczema (Atopic Dermatitis)',
    category: 'inflammatory',
    explanation:
      "Eczema is a chronic inflammatory skin condition causing dry, itchy, and inflamed patches. It's often related to a compromised skin barrier and immune response, and can be triggered by allergens or irritants.",
    symptoms: ['Dry, scaly patches', 'Intense itching', 'Redness and inflammation', 'Cracked or thickened skin'],
    possibleCauses: ['Genetic predisposition', 'Environmental allergens', 'Irritants or harsh soaps', 'Stress', 'Weather changes'],
    dos: ['Moisturize within 3 minutes of bathing', 'Wear breathable fabrics like cotton', 'Identify and avoid personal triggers'],
    donts: ["Don't scratch affected areas", "Don't use scented lotions or soaps", "Don't take very hot showers"],
    keywords: ['eczema', 'atopic dermatitis', 'dry itchy skin', 'itchy patch'],
  },
  {
    slug: 'psoriasis',
    label: 'Psoriasis',
    category: 'autoimmune',
    explanation:
      'Psoriasis is a chronic autoimmune condition that speeds up skin cell turnover, resulting in thick, scaly, silvery-white patches, often on elbows, knees, and scalp.',
    symptoms: ['Raised red patches with silvery scales', 'Dry, cracked skin that may bleed', 'Itching or burning', 'Thickened nails (in some cases)'],
    possibleCauses: ['Autoimmune dysfunction', 'Genetics', 'Stress', 'Infections', 'Certain medications'],
    dos: ['Stay consistent with any prescribed treatment', 'Moisturize daily', 'Track flare triggers'],
    donts: ["Don't scratch or pick scales", "Don't use harsh exfoliants", "Don't ignore joint pain"],
    keywords: ['psoriasis', 'scaly patch', 'silvery scales', 'plaque'],
  },
  {
    slug: 'melanocytic_nevus',
    label: 'Melanocytic Nevus (Common Mole)',
    category: 'pigmentary',
    explanation:
      'A melanocytic nevus is a common, usually benign growth of pigment-producing cells. Most moles are harmless, but changes in size, shape, or color should always be evaluated by a professional.',
    symptoms: ['Well-defined, symmetric, evenly colored spot', 'Generally stable in size over time'],
    possibleCauses: ['Genetics', 'Sun exposure', 'Natural skin pigmentation processes'],
    dos: ['Track moles with photos over time', 'See a dermatologist for annual skin checks if high-risk'],
    donts: ["Don't ignore a mole that's changing", "Don't attempt to remove a mole yourself"],
    keywords: ['mole', 'nevus', 'birthmark', 'dark spot', 'skin growth'],
  },
  {
    slug: 'rosacea',
    label: 'Rosacea',
    category: 'inflammatory',
    explanation:
      'Rosacea is a chronic inflammatory condition mainly affecting the face, causing persistent redness, visible blood vessels, and sometimes acne-like bumps.',
    symptoms: ['Persistent facial redness', 'Visible small blood vessels', 'Bumps that resemble acne', 'Eye irritation in some cases', 'Flushing/burning sensation'],
    possibleCauses: ['Genetics', 'Abnormal blood vessel reactivity', 'Triggers like heat, spicy food, alcohol, sun'],
    dos: ['Keep a flare-trigger diary', 'Use lukewarm (not hot) water', 'Introduce new products very gradually'],
    donts: ["Don't use physical scrubs or harsh exfoliants", "Don't use alcohol-based toners"],
    keywords: ['rosacea', 'facial redness', 'flushing', 'visible veins face'],
  },
  {
    slug: 'fungal_infection',
    label: 'Fungal Infection (e.g. Ringworm/Tinea)',
    category: 'infectious',
    explanation:
      'Fungal skin infections like ringworm (tinea) are caused by dermatophyte fungi thriving in warm, moist areas of skin, producing a characteristic ring-shaped, scaly, itchy patch.',
    symptoms: ['Ring-shaped red or scaly patch with a clearer center', 'Itching', 'Slightly raised, defined border'],
    possibleCauses: ['Direct contact with infected person/animal/surface', 'Warm humid environments', 'Sharing towels/clothing'],
    dos: ['Dry skin thoroughly after washing, especially skin folds', 'Wash affected clothing separately'],
    donts: ["Don't share personal items during an active infection", "Don't stop treatment early"],
    keywords: ['ringworm', 'fungal infection', 'tinea', 'ring shaped rash'],
  },
  {
    slug: 'contact_dermatitis',
    label: 'Contact Dermatitis',
    category: 'inflammatory',
    explanation:
      'Contact dermatitis is skin inflammation triggered by direct contact with an irritant or allergen, causing redness, itching, and sometimes blistering at the contact site.',
    symptoms: ['Redness at the site of contact', 'Itching or burning', 'Possible blisters or swelling'],
    possibleCauses: ['Irritant chemicals (soaps, detergents)', 'Allergens (nickel, fragrance, latex)', 'Plants like poison ivy'],
    dos: ['Rinse the area with lukewarm water after exposure', 'Switch to fragrance-free, hypoallergenic products'],
    donts: ["Don't scratch blistered areas", "Don't reuse the suspected trigger product"],
    keywords: ['contact dermatitis', 'allergic reaction skin', 'irritant rash'],
  },
  {
    slug: 'urticaria',
    label: 'Urticaria (Hives)',
    category: 'allergic',
    explanation:
      'Urticaria, commonly known as hives, presents as raised, itchy welts that can appear suddenly, often triggered by an allergic reaction, infection, stress, or unknown causes.',
    symptoms: ['Raised, red or skin-colored welts', 'Intense itching', 'Welts that change shape or location', 'Swelling in some cases'],
    possibleCauses: ['Allergic reactions (food, medication, insect stings)', 'Infections', 'Stress', 'Physical triggers (cold, pressure, heat)'],
    dos: ['Track potential triggers', 'Seek emergency care for any breathing difficulty'],
    donts: ['Never ignore hives with facial swelling or breathing trouble — seek immediate care'],
    keywords: ['hives', 'urticaria', 'welts', 'allergic swelling'],
  },
  {
    slug: 'vitiligo',
    label: 'Vitiligo',
    category: 'pigmentary',
    explanation:
      "Vitiligo is a condition where patches of skin lose their pigment due to destruction of melanin-producing cells, resulting in smooth, well-defined white patches.",
    symptoms: ['Smooth, well-defined white/depigmented patches', 'Patches may grow slowly over time'],
    possibleCauses: ['Autoimmune destruction of pigment cells', 'Genetics', 'Sometimes triggered after skin trauma or stress'],
    dos: ['Protect patches from sunburn', 'Discuss treatment options with a dermatologist if desired'],
    donts: ["Don't assume it's contagious — it isn't"],
    keywords: ['vitiligo', 'white patches skin', 'depigmentation', 'loss of skin color'],
  },
  {
    slug: 'seborrheic_dermatitis',
    label: 'Seborrheic Dermatitis',
    category: 'inflammatory',
    explanation:
      'Seborrheic dermatitis is a common inflammatory condition causing flaky, greasy, red patches, often on the scalp, face, and chest — related to yeast overgrowth and oil gland activity.',
    symptoms: ['Greasy, yellowish scales or flakes', 'Redness in oily areas of the face/scalp', 'Mild itching', 'Dandruff'],
    possibleCauses: ['Malassezia yeast overgrowth', 'Excess oil production', 'Stress', 'Cold, dry weather'],
    dos: ['Cleanse affected areas regularly but gently', 'Be patient — needs ongoing maintenance'],
    donts: ["Don't scrub flakes aggressively", "Don't use very hot water on affected areas"],
    keywords: ['seborrheic dermatitis', 'dandruff', 'greasy flakes', 'scalp flaking'],
  },
  {
    slug: 'wart',
    label: 'Wart (Verruca)',
    category: 'infectious',
    explanation:
      "Warts are small, rough skin growths caused by human papillomavirus (HPV) infecting the outer skin layer. They're generally harmless but can spread.",
    symptoms: ['Small, rough, raised bump', 'Sometimes tiny black dots (clotted blood vessels)', 'Can be tender if on a pressure point'],
    possibleCauses: ['HPV infection through skin breaks', 'Direct contact with warts', 'Shared surfaces (pools, locker rooms)'],
    dos: ['Cover plantar warts at swimming pools/gyms', 'Be patient — many warts resolve on their own over months'],
    donts: ["Don't pick, scratch, or bite warts", "Don't share personal grooming items"],
    keywords: ['wart', 'verruca', 'plantar wart', 'HPV skin growth'],
  },
];

export default CONDITIONS;
