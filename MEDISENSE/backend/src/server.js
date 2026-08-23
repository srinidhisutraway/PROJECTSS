import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n🚀 MediSense API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('[UNHANDLED REJECTION]', err);
    if (process.env.NODE_ENV === 'production') {
      server.close(() => process.exit(1));
    }
    // In development, log and keep serving — one failed request (e.g. a
    // misconfigured Cloudinary key) shouldn't take down the whole dev server.
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => process.exit(0));
  });
};

start();
