import mongoose from 'mongoose';

const articleBookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
  },
  { timestamps: true }
);

articleBookmarkSchema.index({ user: 1, article: 1 }, { unique: true });

export default mongoose.model('ArticleBookmark', articleBookmarkSchema);
