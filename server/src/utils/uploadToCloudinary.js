const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, folder = "driver-licenses") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder, // Cloudinary me is naam ke folder me store hoga
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;