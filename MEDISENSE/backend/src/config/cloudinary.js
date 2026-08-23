import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for skin analysis images
export const skinImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'medisense/skin-analysis',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1024, height: 1024, crop: 'limit', quality: 'auto:good' }],
  },
});

// Storage for medical reports (PDF/images)
export const reportStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'medisense/reports',
    resource_type: 'auto', // supports PDFs and images
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
});

// Storage for profile avatars
export const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'medisense/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  },
});

export default cloudinary;
