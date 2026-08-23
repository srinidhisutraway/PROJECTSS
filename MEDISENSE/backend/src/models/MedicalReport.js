import mongoose from 'mongoose';

const medicalReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    title: { type: String, required: true, trim: true, maxlength: 120 },
    type: {
      type: String,
      enum: ['prescription', 'lab-report', 'dermatologist-note', 'other'],
      default: 'other',
    },
    file: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      format: { type: String }, // pdf, jpg, png...
      resourceType: { type: String, default: 'auto' },
    },
    relatedAnalysis: { type: mongoose.Schema.Types.ObjectId, ref: 'SkinAnalysis' },
    notes: { type: String, maxlength: 1000 },
    reportDate: { type: Date }, // date on the physical report, user-provided
  },
  { timestamps: true }
);

medicalReportSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('MedicalReport', medicalReportSchema);
