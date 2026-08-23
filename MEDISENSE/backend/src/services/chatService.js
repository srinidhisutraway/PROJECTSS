import axios from 'axios';

/**
 * Educational skincare assistant. Two modes:
 *  1. If CHAT_LLM_API_KEY is set, forwards to an LLM with a strict system
 *     prompt that keeps it educational and non-diagnostic.
 *  2. Otherwise, falls back to a rule-based responder using keyword
 *     matching against a curated knowledge base — fully functional out of
 *     the box with zero external API keys, which matters a lot for a
 *     college project that needs to demo reliably.
 *
 * In both modes, responses never claim to diagnose and always encourage
 * professional consultation for anything beyond general education.
 */

const SYSTEM_PROMPT = `You are the MediSense Skincare Assistant, an educational AI helper embedded in a
skin-health app. You explain skincare, general symptoms, routines, and preventive care in clear,
friendly language. You NEVER provide a definitive diagnosis, NEVER tell someone what disease they
have, and NEVER recommend prescription-strength treatment. For anything that sounds urgent, severe,
or persistent, you clearly recommend seeing a licensed dermatologist. Keep responses concise (under
150 words) and warm.`;

const KEYWORD_RESPONSES = [
  {
    keywords: ['acne', 'pimple', 'breakout', 'zit'],
    response:
      "Acne is usually caused by clogged pores, excess oil, and bacteria. A gentle routine — a mild cleanser, a salicylic acid or benzoyl peroxide treatment, and a non-comedogenic moisturizer with daily sunscreen — is a solid starting point. Avoid picking at breakouts, since that raises scarring risk. If it's painful, cystic, or not improving after 6-8 weeks of consistent care, a dermatologist can offer stronger options.",
  },
  {
    keywords: ['dry', 'dryness', 'flaky', 'flaking'],
    response:
      "Dry skin often improves with a fragrance-free, ceramide-rich moisturizer applied right after washing while skin is still damp, shorter/cooler showers, and a humidifier if your air is dry. If the dryness comes with intense itching, cracking, or spreading patches, it's worth having a dermatologist take a look — that can point to eczema or another condition needing specific care.",
  },
  {
    keywords: ['oily', 'oiliness', 'shine', 'shiny'],
    response:
      "Oily skin usually does best with a gentle foaming or gel cleanser, an oil-free/lightweight moisturizer (skipping moisturizer can actually trigger more oil production), and non-comedogenic sunscreen. Ingredients like niacinamide can help balance oil over time. If it comes with frequent breakouts, that's a good combo to mention to a dermatologist.",
  },
  {
    keywords: ['sunscreen', 'spf', 'sun protection'],
    response:
      "Daily broad-spectrum SPF 30+ is one of the highest-impact things you can do for skin health — it helps prevent premature aging, pigmentation, and skin cancer risk. Reapply roughly every 2 hours with sun exposure, and don't skip it on cloudy days or indoors near windows.",
  },
  {
    keywords: ['mole', 'melanoma', 'spot', 'growth', 'freckle'],
    response:
      "Most moles are harmless, but it's worth watching for the ABCDE signs: Asymmetry, irregular Borders, multiple Colors, a Diameter over 6mm, or anything Evolving/changing. If a spot matches any of those, or is itching, bleeding, or new and growing, please get it checked by a dermatologist soon rather than waiting — this is one area where prompt professional evaluation really matters.",
  },
  {
    keywords: ['redness', 'red', 'irritated', 'irritation', 'rash'],
    response:
      "Redness and irritation can come from many causes — a new product, sun exposure, allergies, or an underlying condition like eczema or rosacea. Try simplifying your routine for a few days (gentle cleanser + fragrance-free moisturizer only) to see if it settles. If the redness spreads, blisters, or doesn't improve, a dermatologist can help pinpoint the cause.",
  },
  {
    keywords: ['routine', 'steps', 'order'],
    response:
      "A solid basic routine: cleanse, treat (any active ingredients like retinoids or acids), moisturize, and sunscreen in the morning. At night you can skip sunscreen. Introduce new active ingredients one at a time, a couple of weeks apart, so you can tell what's working — or not.",
  },
  {
    keywords: ['diet', 'food', 'sugar', 'nutrition'],
    response:
      "Diet's effect on skin varies by person, but a generally balanced diet with less refined sugar and dairy has been linked to fewer breakouts for some people. Staying hydrated and getting enough sleep also support skin repair. It's rarely the sole fix for a skin concern, but it's a helpful supporting habit.",
  },
];

const FALLBACK_RESPONSE =
  "That's a great question! I can help with general skincare guidance — routines, ingredients, sun protection, hydration, and preventive care. For specific symptoms or anything that feels concerning, it's always best to check with a licensed dermatologist who can examine your skin directly. Could you tell me a bit more about what you're noticing?";

const generateRuleBasedReply = (userMessage) => {
  const lower = userMessage.toLowerCase();
  const match = KEYWORD_RESPONSES.find((entry) => entry.keywords.some((kw) => lower.includes(kw)));
  return match ? match.response : FALLBACK_RESPONSE;
};

export const generateAssistantReply = async (messages) => {
  const apiKey = process.env.CHAT_LLM_API_KEY;
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';

  if (!apiKey) {
    return generateRuleBasedReply(lastUserMessage);
  }

  try {
    const { data } = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 20000,
      }
    );
    const text = data.content?.find((block) => block.type === 'text')?.text;
    return text || generateRuleBasedReply(lastUserMessage);
  } catch (err) {
    console.error('[Chat] LLM call failed, falling back to rule-based reply:', err.message);
    return generateRuleBasedReply(lastUserMessage);
  }
};
