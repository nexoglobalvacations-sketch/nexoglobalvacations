const { cloudinary, isCloudinaryReady } = require('../config/cloudinary');

/**
 * Uploads a file buffer to Cloudinary
 * Falls back to Base64 Data URI representation if Cloudinary is not configured
 * 
 * @param {Buffer} fileBuffer - The file buffer from Multer
 * @param {string} folder - Target folder in Cloudinary
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
const uploadToCloudinary = (fileBuffer, folder = 'tt_company') => {
  return new Promise((resolve, reject) => {
    if (isCloudinaryReady) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload stream error:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );
      uploadStream.end(fileBuffer);
    } else {
      // Graceful local simulation fallback: Convert image buffer to Base64 Data URI
      try {
        console.log('Using simulated Base64 data URI fallback for uploaded image...');
        // Let's deduce mime type roughly or default to png
        const base64Image = fileBuffer.toString('base64');
        const dataUri = `data:image/png;base64,${base64Image}`;
        resolve(dataUri);
      } catch (err) {
        console.error('Error generating fallback image URI:', err);
        reject(err);
      }
    }
  });
};

module.exports = { uploadToCloudinary };
