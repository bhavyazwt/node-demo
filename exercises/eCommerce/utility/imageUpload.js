require("dotenv").config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpeg", "jpg", "png", "gif"],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return file?.fieldname + "-" + uniqueSuffix;
    },
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes?.test(file?.mimetype);
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error("Only Images are allowed (jpeg, jpg, png, gif)"));
    }
  },
}).single("image");

function fileUpload(req, res, next) {
  upload(req, res, (err) => {
    if (err) {
      if (err?.code === "LIMIT_FILE_SIZE") {
        return res.status(403).json({
          error: "File Size is too large. Please upload less than 2MB.",
        });
      } else {
        return res.status(403).json({ error: err.message });
      }
    }
    // console.log(req.file.path);
    req.body.imageUrl = req?.file?.path;
    next();
  });
}

module.exports = { fileUpload };
