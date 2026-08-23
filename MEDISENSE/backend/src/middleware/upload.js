import multer from 'multer';
import { skinImageStorage, reportStorage, avatarStorage } from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) return cb(null, true);
  cb(new AppError('Only image files are allowed.', 400));
};

const reportFileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new AppError('Only JPG, PNG, WEBP, or PDF files are allowed.', 400));
};

export const uploadSkinImage = multer({
  storage: skinImageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const uploadReport = multer({
  storage: reportStorage,
  fileFilter: reportFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
