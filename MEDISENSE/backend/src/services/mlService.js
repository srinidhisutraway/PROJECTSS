import axios from 'axios';
import FormData from 'form-data';
import AppError from '../utils/AppError.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Sends an image (as a URL already stored on Cloudinary) to the ML
 * service for prediction. We fetch the bytes server-side rather than
 * asking the ML service to fetch the URL itself, keeping the ML service
 * agnostic of Cloudinary and easy to swap later.
 */
export const getSkinPrediction = async (imageUrl) => {
  try {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 15000 });

    const form = new FormData();
    form.append('file', Buffer.from(imageResponse.data), {
      filename: 'upload.jpg',
      contentType: imageResponse.headers['content-type'] || 'image/jpeg',
    });

    const { data } = await axios.post(`${ML_SERVICE_URL}/api/predict`, form, {
      headers: form.getHeaders(),
      timeout: 30000,
    });

    return data;
  } catch (error) {
    if (error.response) {
      throw new AppError(
        error.response.data?.detail || 'The AI analysis service could not process this image.',
        422
      );
    }
    throw new AppError(
      'The AI analysis service is currently unavailable. Please make sure the ML service is running and try again.',
      503
    );
  }
};
