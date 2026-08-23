import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true }, // e.g. "USER_DEACTIVATED", "ARTICLE_CREATED"
    targetType: { type: String }, // "User" | "Article" | "Quiz" | ...
    targetId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: mongoose.Schema.Types.Mixed },
    ip: { type: String },
  },
  { timestamps: true }
);

systemLogSchema.index({ createdAt: -1 });

export default mongoose.model('SystemLog', systemLogSchema);
