"""
Knowledge base mapping each model class label to structured, patient-facing
guidance. This is intentionally decoupled from the model itself: adding a
new disease later only requires (1) retraining/fine-tuning with the new
class and (2) adding an entry here — no other code changes.

IMPORTANT: All content here is general educational information, not a
diagnosis. It is deliberately conservative and always nudges the user
toward professional care for anything beyond mild/cosmetic concerns.
"""

CONDITIONS = {
    "acne": {
        "label": "Acne",
        "explanation": (
            "Acne occurs when hair follicles become clogged with oil and dead skin cells, "
            "often leading to whiteheads, blackheads, or inflamed pimples. It's commonly "
            "linked to hormonal changes, excess sebum production, and bacteria."
        ),
        "symptoms": ["Whiteheads or blackheads", "Red, inflamed bumps", "Occasional pus-filled lesions", "Oily skin"],
        "possible_causes": ["Hormonal fluctuations", "Excess oil production", "Clogged pores", "Diet and stress", "Certain cosmetics"],
        "precautions": ["Avoid picking or popping lesions", "Use non-comedogenic products", "Wash face twice daily with a gentle cleanser"],
        "recommended_routine": ["Gentle salicylic acid or benzoyl peroxide cleanser", "Oil-free moisturizer", "Broad-spectrum SPF 30+ sunscreen daily"],
        "dos": ["Change pillowcases regularly", "Keep hands off your face", "Introduce new actives one at a time"],
        "donts": ["Don't over-exfoliate", "Don't use heavy comedogenic oils", "Don't skip sunscreen while on acne treatments"],
        "faqs": [
            {"question": "Is acne contagious?", "answer": "No, acne is not contagious. It results from internal factors like hormones and clogged pores."},
            {"question": "Will diet clear my acne?", "answer": "Diet can be a contributing factor for some people, but it's rarely the sole cause. A balanced, low-sugar diet may help overall skin health."},
        ],
        "severity_notes": {
            "mild": "A few scattered comedones or small pimples — usually manageable with OTC care.",
            "moderate": "Widespread inflamed pimples — consider an evidence-based OTC routine and monitor for 6-8 weeks.",
            "severe": "Numerous painful or cystic lesions — a dermatologist consult is strongly recommended to prevent scarring.",
        },
    },
    "eczema": {
        "label": "Eczema (Atopic Dermatitis)",
        "explanation": (
            "Eczema is a chronic inflammatory skin condition causing dry, itchy, and "
            "inflamed patches. It's often related to a compromised skin barrier and immune "
            "response, and can be triggered by allergens or irritants."
        ),
        "symptoms": ["Dry, scaly patches", "Intense itching", "Redness and inflammation", "Cracked or thickened skin"],
        "possible_causes": ["Genetic predisposition", "Environmental allergens", "Irritants or harsh soaps", "Stress", "Weather changes"],
        "precautions": ["Avoid known triggers", "Keep skin well moisturized", "Use fragrance-free products"],
        "recommended_routine": ["Gentle, soap-free cleanser", "Thick emollient moisturizer applied while skin is damp", "Avoid hot showers"],
        "dos": ["Moisturize within 3 minutes of bathing", "Wear breathable fabrics like cotton", "Identify and avoid personal triggers"],
        "donts": ["Don't scratch affected areas", "Don't use scented lotions or soaps", "Don't take very hot showers"],
        "faqs": [
            {"question": "Can eczema be cured?", "answer": "There's no permanent cure, but it can be well managed with consistent skincare and, if needed, prescribed treatment."},
        ],
        "severity_notes": {
            "mild": "Occasional dry patches with mild itching.",
            "moderate": "Persistent inflamed patches affecting daily comfort.",
            "severe": "Widespread, cracked, or infected-looking skin — seek dermatologist care.",
        },
    },
    "psoriasis": {
        "label": "Psoriasis",
        "explanation": (
            "Psoriasis is a chronic autoimmune condition that speeds up skin cell turnover, "
            "resulting in thick, scaly, silvery-white patches, often on elbows, knees, and scalp."
        ),
        "symptoms": ["Raised red patches with silvery scales", "Dry, cracked skin that may bleed", "Itching or burning", "Thickened nails (in some cases)"],
        "possible_causes": ["Autoimmune dysfunction", "Genetics", "Stress", "Infections", "Certain medications"],
        "precautions": ["Keep skin moisturized", "Manage stress", "Avoid skin injury (Koebner phenomenon)"],
        "recommended_routine": ["Fragrance-free thick moisturizer", "Gentle cleansing", "Sun exposure in moderation (consult a doctor first)"],
        "dos": ["Stay consistent with any prescribed treatment", "Moisturize daily", "Track flare triggers"],
        "donts": ["Don't scratch or pick scales", "Don't use harsh exfoliants", "Don't ignore joint pain (may indicate psoriatic arthritis)"],
        "faqs": [
            {"question": "Is psoriasis contagious?", "answer": "No. Psoriasis is an autoimmune condition and cannot be spread through contact."},
        ],
        "severity_notes": {
            "mild": "Small, localized patches covering a small body area.",
            "moderate": "Multiple patches causing noticeable discomfort.",
            "severe": "Widespread patches or joint symptoms — a dermatologist/rheumatologist consult is important.",
        },
    },
    "melanocytic_nevus": {
        "label": "Melanocytic Nevus (Common Mole)",
        "explanation": (
            "A melanocytic nevus is a common, usually benign growth of pigment-producing "
            "cells. Most moles are harmless, but changes in size, shape, or color should "
            "always be evaluated by a professional."
        ),
        "symptoms": ["Well-defined, symmetric, evenly colored spot", "Generally stable in size over time"],
        "possible_causes": ["Genetics", "Sun exposure", "Natural skin pigmentation processes"],
        "precautions": ["Monitor using the ABCDE rule (Asymmetry, Border, Color, Diameter, Evolving)", "Use sunscreen to reduce UV-related changes"],
        "recommended_routine": ["Daily broad-spectrum sunscreen", "Monthly self skin-checks", "Annual dermatologist skin exam if you have many moles"],
        "dos": ["Track moles with photos over time", "See a dermatologist for annual skin checks if high-risk"],
        "donts": ["Don't ignore a mole that's changing", "Don't attempt to remove a mole yourself"],
        "faqs": [
            {"question": "Should I be worried about a mole?", "answer": "Most moles are benign, but any new, changing, itching, or bleeding mole should be checked by a dermatologist promptly."},
        ],
        "severity_notes": {
            "mild": "Stable, symmetric, evenly colored — routine monitoring is enough.",
            "moderate": "Some irregularity noted — professional evaluation recommended.",
            "severe": "Marked asymmetry, irregular border, or color variation — see a dermatologist promptly for evaluation.",
        },
    },
    "rosacea": {
        "label": "Rosacea",
        "explanation": (
            "Rosacea is a chronic inflammatory condition mainly affecting the face, causing "
            "persistent redness, visible blood vessels, and sometimes acne-like bumps. It "
            "tends to flare with certain triggers and worsen gradually if untreated."
        ),
        "symptoms": ["Persistent facial redness", "Visible small blood vessels", "Bumps that resemble acne", "Eye irritation in some cases", "Flushing/burning sensation"],
        "possible_causes": ["Genetics", "Abnormal blood vessel reactivity", "Triggers like heat, spicy food, alcohol, sun", "Demodex mites (in some research)"],
        "precautions": ["Identify and avoid personal flare triggers", "Use gentle, fragrance-free products", "Wear daily sunscreen"],
        "recommended_routine": ["Mild non-foaming cleanser", "Barrier-repair moisturizer", "Mineral (zinc oxide/titanium dioxide) sunscreen, which tends to be better tolerated"],
        "dos": ["Keep a flare-trigger diary", "Use lukewarm (not hot) water", "Introduce new products very gradually"],
        "donts": ["Don't use physical scrubs or harsh exfoliants", "Don't use alcohol-based toners", "Don't skip sunscreen — sun is a common trigger"],
        "faqs": [
            {"question": "Is rosacea the same as acne?", "answer": "No, though they can look similar. Rosacea is a distinct vascular/inflammatory condition and typically doesn't respond to standard acne treatments."},
        ],
        "severity_notes": {
            "mild": "Occasional mild flushing or redness.",
            "moderate": "Persistent redness with visible vessels or bumps.",
            "severe": "Thickened skin, significant bumps, or eye involvement — dermatologist care is recommended.",
        },
    },
    "fungal_infection": {
        "label": "Fungal Infection (e.g. Ringworm/Tinea)",
        "explanation": (
            "Fungal skin infections like ringworm (tinea) are caused by dermatophyte fungi "
            "thriving in warm, moist areas of skin, producing a characteristic ring-shaped, "
            "scaly, itchy patch."
        ),
        "symptoms": ["Ring-shaped red or scaly patch with a clearer center", "Itching", "Slightly raised, defined border", "Sometimes cracked or peeling skin"],
        "possible_causes": ["Direct contact with an infected person, animal, or surface", "Warm, humid environments", "Sharing towels/clothing", "Excess sweating"],
        "precautions": ["Keep skin clean and dry", "Avoid sharing towels, clothing, or footwear", "Wash bedding and clothes in hot water during an active infection"],
        "recommended_routine": ["Keep the area clean and fully dry", "Use breathable, loose-fitting clothing", "Antifungal creams are typically used under guidance"],
        "dos": ["Dry skin thoroughly after washing, especially skin folds", "Wash affected clothing separately", "See a pharmacist/doctor for confirmed antifungal treatment"],
        "donts": ["Don't share personal items during an active infection", "Don't cover with occlusive bandages that trap moisture", "Don't stop treatment early even if it looks improved"],
        "faqs": [
            {"question": "Is ringworm caused by a worm?", "answer": "No — despite the name, it's caused by fungi, not worms. The name comes from the characteristic ring shape of the rash."},
        ],
        "severity_notes": {
            "mild": "Small, localized patch.",
            "moderate": "Larger or multiple patches, persistent itching.",
            "severe": "Widespread infection, or on the scalp/nails — dermatologist evaluation recommended for appropriate antifungal treatment.",
        },
    },
    "contact_dermatitis": {
        "label": "Contact Dermatitis",
        "explanation": (
            "Contact dermatitis is skin inflammation triggered by direct contact with an "
            "irritant or allergen — ranging from soaps and metals to plants and cosmetics — "
            "causing redness, itching, and sometimes blistering at the contact site."
        ),
        "symptoms": ["Redness at the site of contact", "Itching or burning", "Possible blisters or swelling", "Dry, cracked skin over time"],
        "possible_causes": ["Irritant chemicals (soaps, detergents)", "Allergens (nickel, fragrance, latex)", "Plants like poison ivy", "Prolonged friction or moisture exposure"],
        "precautions": ["Identify and remove the triggering substance", "Wash the area promptly after exposure", "Patch-test new products before full use"],
        "recommended_routine": ["Gentle fragrance-free cleanser", "Barrier-repair moisturizer", "Cool compresses for acute irritation"],
        "dos": ["Rinse the area with lukewarm water after exposure", "Switch to fragrance-free, hypoallergenic products", "Note what you touched before the reaction appeared"],
        "donts": ["Don't scratch blistered areas", "Don't reuse the suspected trigger product", "Don't apply new active ingredients until it's resolved"],
        "faqs": [
            {"question": "How is this different from eczema?", "answer": "Contact dermatitis is triggered by a specific external substance, while eczema (atopic dermatitis) is a chronic condition tied to genetics and immune function — though they can look similar and even overlap."},
        ],
        "severity_notes": {
            "mild": "Small area of mild redness or itching.",
            "moderate": "Larger area with noticeable discomfort or mild swelling.",
            "severe": "Significant blistering, swelling, or spreading — seek medical care, especially if it affects the face or airway.",
        },
    },
    "urticaria": {
        "label": "Urticaria (Hives)",
        "explanation": (
            "Urticaria, commonly known as hives, presents as raised, itchy welts that can "
            "appear suddenly, often triggered by an allergic reaction, infection, stress, or "
            "unknown causes, and typically resolve within hours to days."
        ),
        "symptoms": ["Raised, red or skin-colored welts", "Intense itching", "Welts that change shape or location", "Swelling in some cases"],
        "possible_causes": ["Allergic reactions (food, medication, insect stings)", "Infections", "Stress", "Physical triggers (cold, pressure, heat)", "Sometimes no identifiable cause"],
        "precautions": ["Identify and avoid suspected triggers", "Avoid scratching to reduce irritation", "Seek urgent care if swelling affects the face, lips, or breathing"],
        "recommended_routine": ["Cool compresses for symptomatic relief", "Loose, breathable clothing", "Antihistamines are commonly used under medical guidance"],
        "dos": ["Track potential triggers (foods, medications, exposures)", "Seek emergency care for any breathing difficulty", "Keep skin cool"],
        "donts": ["Don't ignore hives accompanied by swelling of the face/throat or difficulty breathing — this needs immediate medical attention", "Don't take new medications without checking with a professional"],
        "faqs": [
            {"question": "Are hives dangerous?", "answer": "Most hives are harmless and resolve on their own, but hives with facial swelling, throat tightness, or breathing difficulty can signal a severe allergic reaction (anaphylaxis) and need emergency care immediately."},
        ],
        "severity_notes": {
            "mild": "A few small, localized welts.",
            "moderate": "Widespread welts causing significant discomfort.",
            "severe": "Welts with swelling of the face/lips/throat or breathing difficulty — this is a medical emergency, seek immediate care.",
        },
    },
    "vitiligo": {
        "label": "Vitiligo",
        "explanation": (
            "Vitiligo is a condition where patches of skin lose their pigment due to the "
            "destruction of melanin-producing cells, resulting in smooth, well-defined white "
            "patches. It's an autoimmune-related condition, not an infection."
        ),
        "symptoms": ["Smooth, well-defined white/depigmented patches", "Patches may grow slowly over time", "Premature whitening of hair in affected areas (sometimes)"],
        "possible_causes": ["Autoimmune destruction of pigment cells", "Genetics", "Sometimes triggered after skin trauma or stress"],
        "precautions": ["Protect depigmented areas with sunscreen (they burn more easily)", "Monitor for changes in patch size", "Consider psychological support resources, as vitiligo can affect self-esteem"],
        "recommended_routine": ["Daily broad-spectrum sunscreen on affected areas", "Gentle skincare", "Camouflage makeup is a personal option, not a medical necessity"],
        "dos": ["Protect patches from sunburn", "Discuss treatment options (topical, light therapy) with a dermatologist if desired", "Connect with support communities if helpful"],
        "donts": ["Don't assume it's contagious — it isn't", "Don't expose depigmented skin to strong sun without protection"],
        "faqs": [
            {"question": "Is vitiligo contagious or dangerous?", "answer": "No, vitiligo is not contagious and is not medically dangerous, though affected skin is more vulnerable to sunburn and benefits from extra sun protection."},
        ],
        "severity_notes": {
            "mild": "Small, stable patch(es).",
            "moderate": "Larger or multiple patches.",
            "severe": "Rapidly spreading patches — a dermatologist can discuss treatment options to help manage progression.",
        },
    },
    "seborrheic_dermatitis": {
        "label": "Seborrheic Dermatitis",
        "explanation": (
            "Seborrheic dermatitis is a common inflammatory condition causing flaky, greasy, "
            "red patches, often on the scalp, face (especially around the nose/eyebrows), and "
            "chest — related to yeast overgrowth and oil gland activity."
        ),
        "symptoms": ["Greasy, yellowish scales or flakes", "Redness in oily areas of the face/scalp", "Mild itching", "Dandruff (scalp form)"],
        "possible_causes": ["Malassezia yeast overgrowth", "Excess oil production", "Stress", "Cold, dry weather", "Certain neurological conditions increase risk"],
        "precautions": ["Use gentle, medicated cleansers as needed", "Avoid harsh scrubbing", "Manage stress, which can trigger flares"],
        "recommended_routine": ["Anti-dandruff or gentle cleanser for affected areas", "Lightweight, non-comedogenic moisturizer", "Consistent, gentle routine rather than aggressive treatment"],
        "dos": ["Cleanse affected areas regularly but gently", "Be patient — it often needs ongoing maintenance rather than a one-time fix", "Note seasonal patterns (often worse in winter)"],
        "donts": ["Don't scrub flakes aggressively", "Don't use very hot water on affected areas", "Don't stop maintenance care once it clears — it often recurs"],
        "faqs": [
            {"question": "Is this the same as regular dandruff?", "answer": "Dandruff is generally considered a milder form of seborrheic dermatitis limited to the scalp; the condition can also affect the face and chest."},
        ],
        "severity_notes": {
            "mild": "Light flaking, minimal redness.",
            "moderate": "Noticeable greasy scales and redness.",
            "severe": "Widespread, thick scaling or significant discomfort — a dermatologist can offer more targeted treatment.",
        },
    },
    "wart": {
        "label": "Wart (Verruca)",
        "explanation": (
            "Warts are small, rough skin growths caused by human papillomavirus (HPV) "
            "infecting the outer skin layer. They're generally harmless but can spread to "
            "other skin areas or, less commonly, to other people."
        ),
        "symptoms": ["Small, rough, raised bump", "Sometimes tiny black dots (clotted blood vessels)", "Can be skin-colored, white, pink, or tan", "May be tender if on a pressure point"],
        "possible_causes": ["HPV infection through skin breaks", "Direct contact with warts (self or others)", "Weakened skin barrier", "Shared surfaces (pools, locker rooms) for plantar warts"],
        "precautions": ["Avoid picking or biting warts to prevent spreading", "Keep the area covered in shared spaces (e.g. pools)", "Avoid sharing towels/razors with an active wart"],
        "recommended_routine": ["Keep area clean and dry", "OTC salicylic acid treatments are common for common warts (check suitability first)", "Avoid unnecessary irritation of the area"],
        "dos": ["Cover plantar warts at swimming pools/gyms", "Be patient — many warts resolve on their own over months", "See a doctor for warts on the face, genitals, or that are painful/multiplying"],
        "donts": ["Don't pick, scratch, or bite warts", "Don't share personal grooming items", "Don't attempt aggressive at-home removal without guidance"],
        "faqs": [
            {"question": "Will a wart go away on its own?", "answer": "Many common warts eventually resolve without treatment, sometimes taking months to years, though treatment can speed this up and reduce spreading."},
        ],
        "severity_notes": {
            "mild": "Single small wart, not bothersome.",
            "moderate": "Multiple warts or one that's spreading.",
            "severe": "Rapidly multiplying, painful, or in sensitive areas (face/genitals) — see a doctor for proper treatment.",
        },
    },
    "healthy": {
        "label": "No Significant Concern Detected",
        "explanation": (
            "The image doesn't show strong visual indicators of the conditions this model "
            "screens for. This is not a guarantee of healthy skin — it only reflects what "
            "was detectable in this specific photo."
        ),
        "symptoms": [],
        "possible_causes": [],
        "precautions": ["Continue a consistent skincare routine", "Use sunscreen daily", "Monitor for any new changes"],
        "recommended_routine": ["Gentle cleanser", "Moisturizer suited to your skin type", "Daily SPF 30+ sunscreen"],
        "dos": ["Keep up preventive skincare", "Stay hydrated", "Get annual skin checks if you have risk factors"],
        "donts": ["Don't skip sun protection", "Don't ignore new symptoms that appear later"],
        "faqs": [
            {"question": "Does this mean my skin is completely healthy?", "answer": "It means no strong signals of the screened conditions were detected in this photo — it isn't a full medical clearance."},
        ],
        "severity_notes": {"mild": "No notable concern.", "moderate": "No notable concern.", "severe": "No notable concern."},
    },
}

# Ordered label list used by the model — index position = model output index.
# This file is the single source of truth; scripts/train.py writes a
# matching labels.json from this same order after training.
CLASS_NAMES = list(CONDITIONS.keys())
