const cloudinary = require("../config/cloudinary.js")

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return null;
 
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("deleteFromCloudinary error:", error.message);
    throw error;
  }
};
 
module.exports = deleteFromCloudinary;