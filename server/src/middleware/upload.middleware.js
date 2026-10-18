const multer = require("multer");

const storage = multer.memoryStorage();

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "application/octet-stream", // temporary fallback — kuch clients (Postman/OneDrive) sahi mimetype nahi bhejte
];

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {

    const extension = file.originalname.split(".").pop().toLowerCase();
    const validExtensions = ["jpeg", "jpg", "png", "webp"];

    // Agar mimetype allowed list me hai, seedha allow karo
    if (allowedTypes.includes(file.mimetype)) {

      if (file.mimetype === "application/octet-stream" && !validExtensions.includes(extension)) {
        return cb(new Error("Only image files are allowed (invalid extension)"));
      }
      return cb(null, true);
    }

    return cb(new Error(`Only image files are allowed. Received mimetype: ${file.mimetype}`));
  },
});

module.exports = upload;