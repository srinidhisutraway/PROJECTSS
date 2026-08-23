import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const onboardingSchema = new mongoose.Schema(
  {
    completed: { type: Boolean, default: false },
    ageGroup: {
      type: String,
      enum: ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
    },
    skinType: {
      type: String,
      enum: ['dry', 'oily', 'combination', 'normal', 'sensitive'],
    },
    mainConcerns: [
      {
        type: String,
        enum: [
          'acne', 'pigmentation', 'wrinkles', 'dryness', 'oiliness',
          'redness', 'dark-circles', 'scarring', 'sensitivity', 'dullness', 'other',
        ],
      },
    ],
    acneHistory: { type: String, enum: ['never', 'occasional', 'chronic', 'past-only'] },
    allergies: [{ type: String }],
    currentRoutine: {
      type: String,
      enum: ['none', 'basic', 'moderate', 'extensive'],
    },
    productsUsed: [{ type: String }],
    sunscreenUsage: {
      type: String,
      enum: ['never', 'sometimes', 'daily', 'multiple-times-daily'],
    },
    waterIntakeLiters: { type: Number, min: 0, max: 10 },
    sleepHours: { type: Number, min: 0, max: 14 },
    dietHabits: {
      type: String,
      enum: ['balanced', 'high-sugar', 'high-fat', 'vegetarian', 'vegan', 'irregular'],
    },
    smokingAlcohol: {
      type: String,
      enum: ['none', 'occasional', 'regular', 'prefer-not-to-say'],
    },
    dermatologistVisits: {
      type: String,
      enum: ['never', 'rarely', 'occasionally', 'regularly'],
    },
    medications: [{ type: String }],
    familyHistory: [{ type: String }],
    occupation: { type: String },
    dailySunExposureHours: { type: Number, min: 0, max: 24 },
    cosmeticTreatments: [{ type: String }],
    existingConditions: [{ type: String }],
    wantsReminders: { type: Boolean, default: true },
    completedAt: { type: Date },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      index: true,
    },
    password: {
      type: String,
      minlength: 8,
      select: false, // never returned by default
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: { type: String, index: true, sparse: true },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    hasCompletedOnboarding: { type: Boolean, default: false },
    onboarding: { type: onboardingSchema, default: () => ({}) },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: compare password
userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

// Instance method: generate email verification token
userSchema.methods.generateEmailVerificationToken = function generateEmailVerificationToken() {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return token;
};

// Instance method: generate password reset token
userSchema.methods.generatePasswordResetToken = function generatePasswordResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1h
  return token;
};

// Never leak sensitive fields in JSON responses
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.emailVerificationToken;
    delete ret.passwordResetToken;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
