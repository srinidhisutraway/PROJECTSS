import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    summary: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true }, // markdown or HTML
    coverImage: { type: String },
    category: {
      type: String,
      enum: ['skincare', 'research', 'awareness', 'lifestyle', 'news', 'nutrition'],
      required: true,
      index: true,
    },
    tags: [{ type: String, index: true }],
    author: { type: String, default: 'MediSense Editorial' },
    readTimeMinutes: { type: Number, default: 4 },
    isPublished: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    viewCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin author
  },
  { timestamps: true }
);

articleSchema.index({ title: 'text', summary: 'text', tags: 'text' });
articleSchema.index({ publishedAt: -1 });

export default mongoose.model('Article', articleSchema);
