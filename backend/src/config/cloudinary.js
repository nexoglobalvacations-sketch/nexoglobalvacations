const cloudinary = require('cloudinary').v2;

const isConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary successfully configured.');
} else {
  console.warn(
    'WARNING: Cloudinary credentials are missing in the .env file. Uploads will fall back to local/mock simulation mode.'
  );
}

module.exports = {
  cloudinary,
  isCloudinaryReady: !!isConfigured
};
