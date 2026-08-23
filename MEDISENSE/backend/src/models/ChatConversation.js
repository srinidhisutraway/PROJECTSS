import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    relatedAnalysis: { type: mongoose.Schema.Types.ObjectId, ref: 'SkinAnalysis' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatConversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'New conversation' },
    messages: [chatMessageSchema],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

chatConversationSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model('ChatConversation', chatConversationSchema);
