// middleware/upload.js
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "flags", // Nama folder di Cloudinary
        format: async (req, file) => "png", // Tentukan format file
    },
});

const upload = multer({ storage: storage });

module.exports = upload;
