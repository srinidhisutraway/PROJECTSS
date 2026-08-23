import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';
import Article from '../models/Article.js';
import { Quiz } from '../models/Quiz.js';

const run = async () => {
  await connectDB();

  // --- Admin user ---
  const adminEmail = 'admin@medisense.app';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'MediSense Admin',
      email: adminEmail,
      password: 'Admin@12345',
      role: 'admin',
      authProvider: 'local',
      isEmailVerified: true,
      hasCompletedOnboarding: true,
    });
    console.log(`✔ Admin user created: ${adminEmail} / Admin@12345 (please change this password)`);
  } else {
    console.log('• Admin user already exists, skipping.');
  }

  // --- Articles (idempotent: adds any missing ones, skips existing by slug) ---
  const articles = [
    {
      title: 'The Science Behind Daily Sunscreen Use',
      slug: 'science-behind-daily-sunscreen-use',
      summary: 'Why dermatologists consider SPF the single most effective anti-aging and cancer-prevention habit.',
      content:
        '## Why Sunscreen Matters\n\nUV radiation is the leading external cause of premature skin aging and a major risk factor for skin cancer. Daily broad-spectrum SPF 30+ significantly reduces both risks over time...\n\n## How to Choose\n\nLook for "broad-spectrum" on the label, which protects against both UVA and UVB rays...',
      category: 'skincare',
      tags: ['sunscreen', 'prevention', 'spf'],
      readTimeMinutes: 5,
      isTrending: true,
    },
    {
      title: 'Understanding Your Skin Type: A Practical Guide',
      slug: 'understanding-your-skin-type',
      summary: 'Dry, oily, combination, or sensitive — learn how to identify your skin type and build a routine around it.',
      content:
        '## The Four Main Skin Types\n\nMost people fall into one of four broad categories: dry, oily, combination, or sensitive...\n\n## Simple At-Home Test\n\nWash your face, wait an hour without applying anything, then observe...',
      category: 'skincare',
      tags: ['skin-type', 'routine', 'basics'],
      readTimeMinutes: 4,
    },
    {
      title: 'New Research on Gut Health and Skin Inflammation',
      slug: 'gut-health-and-skin-inflammation-research',
      summary: 'Recent studies suggest a stronger gut-skin connection than previously understood.',
      content:
        '## The Gut-Skin Axis\n\nEmerging research points to a bidirectional relationship between gut microbiome diversity and inflammatory skin conditions...',
      category: 'research',
      tags: ['research', 'nutrition', 'inflammation'],
      readTimeMinutes: 6,
      isTrending: true,
    },
    {
      title: 'Building a Minimalist Skincare Routine',
      slug: 'building-a-minimalist-skincare-routine',
      summary: "You don't need twelve products — here's a dermatologist-informed minimalist approach.",
      content: '## Less Can Be More\n\nA cleanser, a moisturizer, and sunscreen cover the fundamentals for most people...',
      category: 'lifestyle',
      tags: ['minimalism', 'routine'],
      readTimeMinutes: 3,
    },
    {
      title: 'Rosacea vs. Acne: How to Tell Them Apart',
      slug: 'rosacea-vs-acne-how-to-tell-them-apart',
      summary: 'Both cause facial redness and bumps, but they need very different care. Here are the key differences.',
      content:
        '## Key Differences\n\nRosacea tends to bring persistent facial redness, visible blood vessels, and flushing, while acne is more about clogged pores, blackheads, and whiteheads...\n\n## Why It Matters\n\nStandard acne treatments like benzoyl peroxide can actually irritate rosacea-prone skin further...',
      category: 'skincare',
      tags: ['rosacea', 'acne', 'diagnosis'],
      readTimeMinutes: 5,
    },
    {
      title: 'Ringworm Isn\u2019t Caused by a Worm: Understanding Fungal Skin Infections',
      slug: 'ringworm-fungal-skin-infections-explained',
      summary: 'Despite the name, ringworm is a fungal infection — here\u2019s how it spreads and how to manage it.',
      content:
        '## What Causes Ringworm\n\nDermatophyte fungi thrive in warm, moist environments and can spread through direct contact, shared items, or damp communal spaces like locker rooms...\n\n## Prevention Tips\n\nKeeping skin dry, avoiding shared towels, and treating pets with symptoms can all help prevent spread...',
      category: 'awareness',
      tags: ['fungal', 'ringworm', 'prevention'],
      readTimeMinutes: 4,
    },
    {
      title: 'Living with Vitiligo: What the Research Says',
      slug: 'living-with-vitiligo-what-research-says',
      summary: 'An overview of what causes vitiligo, current treatment options, and skin protection tips.',
      content:
        '## What Is Vitiligo\n\nVitiligo occurs when immune cells attack melanin-producing cells, causing patches of skin to lose pigment...\n\n## Sun Protection Is Essential\n\nDepigmented patches lack natural UV protection and burn more easily, making daily sunscreen especially important...',
      category: 'awareness',
      tags: ['vitiligo', 'pigmentation', 'awareness'],
      readTimeMinutes: 5,
    },
    {
      title: 'Contact Dermatitis: Common Triggers Hiding in Your Routine',
      slug: 'contact-dermatitis-common-triggers',
      summary: 'From fragrance to nickel jewelry, everyday products can trigger reactions. Here\u2019s how to identify culprits.',
      content:
        '## Common Irritants and Allergens\n\nFragranced lotions, certain preservatives, nickel in jewelry, and even some plants can trigger contact dermatitis...\n\n## Patch Testing New Products\n\nApplying a small amount to your inner arm for 48 hours before full use can help catch reactions early...',
      category: 'skincare',
      tags: ['contact-dermatitis', 'allergies', 'ingredients'],
      readTimeMinutes: 4,
    },
    {
      title: 'Hives (Urticaria): When to Worry and When to Wait',
      slug: 'hives-urticaria-when-to-worry',
      summary: 'Most hives are harmless and short-lived, but some warning signs mean you should seek care immediately.',
      content:
        '## Most Hives Resolve on Their Own\n\nUrticaria often clears within hours to days and can be triggered by allergies, stress, or infections...\n\n## Red Flags\n\nSwelling of the lips, tongue, or throat, or any difficulty breathing alongside hives, is a medical emergency and needs immediate attention...',
      category: 'awareness',
      tags: ['hives', 'urticaria', 'allergy'],
      readTimeMinutes: 3,
      isTrending: true,
    },
    {
      title: 'Managing Dandruff and Seborrheic Dermatitis',
      slug: 'managing-dandruff-seborrheic-dermatitis',
      summary: 'Flaky scalp got you frustrated? Here\u2019s what actually helps, and why consistency matters more than intensity.',
      content:
        '## It\u2019s About Maintenance, Not a One-Time Fix\n\nSeborrheic dermatitis and dandruff tend to be chronic, recurring conditions best managed with regular gentle care rather than aggressive treatment...\n\n## When to See a Dermatologist\n\nIf over-the-counter shampoos aren\u2019t helping after several weeks, a dermatologist can prescribe more targeted treatment...',
      category: 'skincare',
      tags: ['scalp', 'dandruff', 'seborrheic-dermatitis'],
      readTimeMinutes: 4,
    },
    {
      title: 'Hydration from the Inside Out: Does Water Intake Really Help Skin?',
      slug: 'hydration-water-intake-skin-benefits',
      summary: 'The relationship between drinking water and skin hydration is more nuanced than \u201cdrink 8 glasses a day.\u201d',
      content:
        '## What the Evidence Shows\n\nSevere dehydration does affect skin, but for already well-hydrated people, drinking extra water shows limited additional benefit to skin appearance...\n\n## What Actually Helps Skin Barrier Function\n\nTopical moisturizers with humectants and occlusives tend to have a more direct, measurable effect...',
      category: 'nutrition',
      tags: ['hydration', 'water', 'research'],
      readTimeMinutes: 4,
    },
    {
      title: 'Trending: The Rise of "Skin Cycling" Routines',
      slug: 'trending-skin-cycling-routines',
      summary: 'A viral routine concept promising fewer breakouts and less irritation — how it works and who it\u2019s for.',
      content:
        '## What Is Skin Cycling\n\nSkin cycling alternates active-ingredient nights (exfoliant, retinoid) with recovery nights (moisturizer only) on a repeating schedule...\n\n## Is It Right for You\n\nIt can help reduce over-exfoliation and irritation, especially for sensitive or reactive skin types...',
      category: 'news',
      tags: ['trending', 'routine', 'social-media'],
      readTimeMinutes: 3,
      isTrending: true,
    },
  ];

  let addedArticles = 0;
  for (const articleData of articles) {
    const exists = await Article.findOne({ slug: articleData.slug });
    if (!exists) {
      await Article.create({ ...articleData, createdBy: admin._id });
      addedArticles += 1;
    }
  }
  console.log(
    addedArticles > 0
      ? `✔ Added ${addedArticles} new article(s) (${articles.length - addedArticles} already existed).`
      : '• All articles already exist, skipping.'
  );

  // --- Quizzes (idempotent: adds any missing ones, skips existing by title) ---
  const quizzes = [
    {
      title: 'Skin Health Basics',
      description: 'Test your knowledge of foundational skincare facts.',
      category: 'skin-basics',
      difficulty: 'beginner',
      badgeAwarded: 'Skin Sage',
      questions: [
        {
          question: 'What is the primary purpose of sunscreen?',
          options: ['Moisturizing skin', 'Blocking/absorbing UV radiation', 'Removing oil', 'Exfoliating dead skin'],
          correctOptionIndex: 1,
          explanation: 'Sunscreen works by absorbing or reflecting UV radiation to protect skin from damage.',
          points: 10,
        },
        {
          question: 'Which skin type typically produces the most sebum (oil)?',
          options: ['Dry', 'Oily', 'Normal', 'None of the above'],
          correctOptionIndex: 1,
          explanation: 'Oily skin types have overactive sebaceous glands producing more oil.',
          points: 10,
        },
        {
          question: 'True or False: Acne is contagious.',
          options: ['True', 'False'],
          correctOptionIndex: 1,
          explanation: 'Acne results from internal factors like hormones and clogged pores — it cannot spread through contact.',
          points: 10,
        },
        {
          question: 'What does the "E" in the ABCDE mole-checking rule stand for?',
          options: ['Elevation', 'Evolving', 'Edge', 'Excess'],
          correctOptionIndex: 1,
          explanation: '"Evolving" refers to a mole changing in size, shape, or color over time — a key warning sign.',
          points: 10,
        },
      ],
    },
    {
      title: 'Sun Protection Smarts',
      description: 'How well do you actually understand SPF, UVA/UVB, and sun safety?',
      category: 'sun-protection',
      difficulty: 'beginner',
      badgeAwarded: 'Sun Guardian',
      questions: [
        {
          question: 'What does "SPF" stand for?',
          options: ['Skin Protection Formula', 'Sun Protection Factor', 'Sunlight Prevention Filter', 'Skin Pigment Factor'],
          correctOptionIndex: 1,
          explanation: 'SPF measures how well a sunscreen protects against UVB rays specifically.',
          points: 10,
        },
        {
          question: 'Which type of UV ray is most associated with premature skin aging?',
          options: ['UVA', 'UVB', 'UVC', 'Infrared'],
          correctOptionIndex: 0,
          explanation: 'UVA rays penetrate deeper and are strongly linked to photoaging, while UVB causes sunburn.',
          points: 10,
        },
        {
          question: 'How often should sunscreen typically be reapplied during sun exposure?',
          options: ['Once in the morning only', 'Every 2 hours', 'Every 6 hours', 'Only if you feel a sunburn'],
          correctOptionIndex: 1,
          explanation: 'Sunscreen effectiveness degrades with time and sweat/water exposure, so reapplication roughly every 2 hours is recommended.',
          points: 10,
        },
        {
          question: 'True or False: You don\u2019t need sunscreen on a cloudy day.',
          options: ['True', 'False'],
          correctOptionIndex: 1,
          explanation: 'Up to 80% of UV rays can pass through clouds, so daily sunscreen is still recommended.',
          points: 10,
        },
        {
          question: 'Which term describes sunscreen that protects against both UVA and UVB?',
          options: ['Water-resistant', 'Broad-spectrum', 'Mineral-based', 'Non-comedogenic'],
          correctOptionIndex: 1,
          explanation: '"Broad-spectrum" specifically indicates protection against both UVA and UVB radiation.',
          points: 10,
        },
      ],
    },
    {
      title: 'Nutrition and Your Skin',
      description: 'Explore the (real and mythical) connections between diet and skin health.',
      category: 'nutrition',
      difficulty: 'intermediate',
      badgeAwarded: 'Nutrition Nerd',
      questions: [
        {
          question: 'Which nutrient is commonly linked to supporting skin barrier and collagen health?',
          options: ['Vitamin C', 'Vitamin B12', 'Sodium', 'Caffeine'],
          correctOptionIndex: 0,
          explanation: 'Vitamin C plays a role in collagen synthesis and has antioxidant properties.',
          points: 10,
        },
        {
          question: 'True or False: Eating chocolate directly causes acne in everyone.',
          options: ['True', 'False'],
          correctOptionIndex: 1,
          explanation: 'The link between chocolate and acne is not conclusively proven for everyone — high-glycemic diets have a stronger evidence base for some individuals.',
          points: 10,
        },
        {
          question: 'Which of these is generally considered supportive of skin health as part of a balanced diet?',
          options: ['Omega-3 fatty acids', 'Trans fats', 'Excess refined sugar', 'Artificial sweeteners in excess'],
          correctOptionIndex: 0,
          explanation: 'Omega-3 fatty acids (found in fish, walnuts, flaxseed) are associated with reduced inflammation.',
          points: 10,
        },
        {
          question: 'Can severe dehydration affect skin appearance?',
          options: ['Yes', 'No', 'Only in children', 'Only in elderly people'],
          correctOptionIndex: 0,
          explanation: 'Severe dehydration can reduce skin elasticity and appearance, though mild extra water intake for already-hydrated people shows limited additional benefit.',
          points: 10,
        },
      ],
    },
    {
      title: 'Acne Myths vs. Facts',
      description: 'Separate common acne myths from what the evidence actually supports.',
      category: 'myths-vs-facts',
      difficulty: 'intermediate',
      badgeAwarded: 'Myth Buster',
      questions: [
        {
          question: 'Myth or Fact: Popping pimples helps them heal faster.',
          options: ['Myth', 'Fact'],
          correctOptionIndex: 0,
          explanation: 'Popping pimples can push bacteria deeper, increase inflammation, and raise the risk of scarring.',
          points: 10,
        },
        {
          question: 'Myth or Fact: Only teenagers get acne.',
          options: ['Myth', 'Fact'],
          correctOptionIndex: 0,
          explanation: 'Adult acne is common, especially in women, often linked to hormonal fluctuations, stress, or certain products.',
          points: 10,
        },
        {
          question: 'Myth or Fact: Oily skin means you should skip moisturizer entirely.',
          options: ['Myth', 'Fact'],
          correctOptionIndex: 0,
          explanation: 'Skipping moisturizer can actually trigger the skin to produce more oil to compensate — a lightweight, oil-free moisturizer is usually still recommended.',
          points: 10,
        },
        {
          question: 'Myth or Fact: Sun exposure can permanently cure acne.',
          options: ['Myth', 'Fact'],
          correctOptionIndex: 0,
          explanation: 'Sun exposure may temporarily mask redness but can worsen acne long-term and increases skin cancer/aging risk.',
          points: 10,
        },
        {
          question: 'Myth or Fact: Washing your face more often always helps acne.',
          options: ['Myth', 'Fact'],
          correctOptionIndex: 0,
          explanation: 'Over-washing can strip natural oils and irritate skin, sometimes making acne worse. Twice daily with a gentle cleanser is typically enough.',
          points: 10,
        },
      ],
    },
    {
      title: 'Recognizing Skin Conditions',
      description: 'Can you match key symptoms to the right condition category?',
      category: 'general',
      difficulty: 'advanced',
      badgeAwarded: 'Condition Detective',
      questions: [
        {
          question: 'Persistent facial redness with visible small blood vessels is most associated with which condition?',
          options: ['Rosacea', 'Vitiligo', 'Warts', 'Urticaria'],
          correctOptionIndex: 0,
          explanation: 'Rosacea commonly presents with persistent redness and visible blood vessels, especially on the face.',
          points: 10,
        },
        {
          question: 'A ring-shaped, scaly patch with a clearer center is a classic sign of what?',
          options: ['Ringworm (fungal infection)', 'Vitiligo', 'Melanocytic nevus', 'Seborrheic dermatitis'],
          correctOptionIndex: 0,
          explanation: 'Ringworm (tinea) often presents as a ring-shaped patch, despite the name having nothing to do with actual worms.',
          points: 10,
        },
        {
          question: 'Smooth, well-defined white patches of skin with no other symptoms most likely indicate?',
          options: ['Vitiligo', 'Eczema', 'Acne', 'Fungal infection'],
          correctOptionIndex: 0,
          explanation: 'Vitiligo causes depigmented patches due to loss of melanin-producing cells.',
          points: 10,
        },
        {
          question: 'Raised, itchy welts that appear suddenly and change shape/location over hours are typical of?',
          options: ['Urticaria (hives)', 'Psoriasis', 'Wart', 'Melanocytic nevus'],
          correctOptionIndex: 0,
          explanation: 'Urticaria (hives) is known for raised, migratory, itchy welts, often resolving within hours to days.',
          points: 10,
        },
        {
          question: 'Which sign should prompt an urgent dermatologist visit for a mole?',
          options: ['It has stayed the exact same for years', 'It recently started changing shape or color', 'It is small and symmetric', 'It matches other moles nearby'],
          correctOptionIndex: 1,
          explanation: 'A changing mole (asymmetry, border irregularity, color variation, diameter growth, or evolving appearance) warrants prompt evaluation.',
          points: 10,
        },
      ],
    },
  ];

  let addedQuizzes = 0;
  for (const quizData of quizzes) {
    const exists = await Quiz.findOne({ title: quizData.title });
    if (!exists) {
      await Quiz.create({ ...quizData, createdBy: admin._id });
      addedQuizzes += 1;
    }
  }
  console.log(
    addedQuizzes > 0
      ? `✔ Added ${addedQuizzes} new quiz(zes) (${quizzes.length - addedQuizzes} already existed).`
      : '• All quizzes already exist, skipping.'
  );

  console.log('\nSeeding complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
