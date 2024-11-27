// middleware/uploadActor.js
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "actors", // Nama folder di Cloudinary
        format: async (req, file) => ["jpg", "png"].includes(file.mimetype.split("/")[1]) ? file.mimetype.split("/")[1] : "jpg",
        public_id: (req, file) => `actor_${Date.now()}`, // Nama file unik
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpg|jpeg|png/;
        const mimetype = fileTypes.test(file.mimetype.split("/")[1]);
        if (mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Only .jpg and .png files are allowed!"));
        }
    },
});

module.exports = upload;
