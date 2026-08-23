import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    condition: { type: String, required: true },
    confidence: { type: Number, required: true, min: 0, max: 1 },
  },
  { _id: false }
);

const hydrationAnalysisSchema = new mongoose.Schema(
  {
    hydrationLevel: { type: Number, min: 0, max: 100 }, // %
    oiliness: { type: Number, min: 0, max: 100 },
    textureScore: { type: Number, min: 0, max: 100 },
    rednessScore: { type: Number, min: 0, max: 100 },
    drynessScore: { type: Number, min: 0, max: 100 },
    recommendation: { type: String },
  },
  { _id: false }
);

const skinAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    // Top prediction + full ranked list from the ML service
    predictions: [predictionSchema],
    topCondition: { type: String, required: true },
    topConfidence: { type: Number, required: true, min: 0, max: 1 },

    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'unknown'],
      default: 'unknown',
    },
    affectedRegion: { type: String }, // e.g. "cheek", "forehead" — if detectable

    // Enriched, human-readable guidance assembled from the knowledge base
    explanation: { type: String },
    possibleCauses: [{ type: String }],
    symptoms: [{ type: String }],
    precautions: [{ type: String }],
    recommendedRoutine: [{ type: String }],
    dos: [{ type: String }],
    donts: [{ type: String }],
    consultationUrgency: {
      type: String,
      enum: ['routine', 'soon', 'urgent'],
      default: 'routine',
    },
    faqs: [
      {
        question: String,
        answer: String,
        _id: false,
      },
    ],

    // Explainability: stored as base64 data URIs (demo-scale; for a
    // production deployment these would be uploaded to Cloudinary like
    // the original image instead of stored inline).
    grayscaleImage: { type: String },
    highlightedImage: { type: String },
    keyIndicators: [{ type: String }],

    hydrationAnalysis: hydrationAnalysisSchema,

    modelVersion: { type: String, default: 'v1' },
    inferenceTimeMs: { type: Number },

    notes: { type: String }, // user's own notes on this analysis
  },
  { timestamps: true }
);

skinAnalysisSchema.index({ user: 1, createdAt: -1 });
skinAnalysisSchema.index({ topCondition: 1 });

export default mongoose.model('SkinAnalysis', skinAnalysisSchema);
