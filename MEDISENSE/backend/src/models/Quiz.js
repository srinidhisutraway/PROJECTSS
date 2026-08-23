import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true },
    explanation: { type: String },
    points: { type: Number, default: 10 },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    category: {
      type: String,
      enum: ['skin-basics', 'acne', 'sun-protection', 'nutrition', 'myths-vs-facts', 'general'],
      default: 'general',
    },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    questions: [quizQuestionSchema],
    badgeAwarded: { type: String }, // e.g. "Skin Sage"
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [{ questionId: mongoose.Schema.Types.ObjectId, selectedOptionIndex: Number, _id: false }],
    score: { type: Number, required: true },
    totalPossibleScore: { type: Number, required: true },
    correctCount: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    badgeEarned: { type: String },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ user: 1, quiz: 1 });

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
