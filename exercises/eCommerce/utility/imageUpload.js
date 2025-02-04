const multer = require("multer");
const path = require("path");
const fs = require("fs");
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Only Images are allowed (jpeg, jpg, png, gif)");
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../tmp/uploads/img"));
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = file.fieldname + "-" + uniqueSuffix + "." + extension;
    req.body.fileName = fileName;
    req.body.extension = extension;
    req.body.mimeType = file.mimetype;

    cb(null, fileName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("productImage");

function fileUpload(req, res, next) {
  if (!fs.existsSync(path.join(__dirname, "../tmp/uploads/img"))) {
    fs.mkdirSync(path.join(__dirname, "../tmp/uploads/img"), {
      recursive: true,
    });
  }
  upload(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE")
        return res.status(403).json({
          error: "File Size is too large. Please Upload Less Than 2MB of File.",
        });
      else if (err.code === "LIMIT_UNEXPECTED_FILE")
        return res.status(403).json({
          error: "Only Single File is allowed. Upload only one file.",
        });
      else {
        return res.status(403).json({ error: err });
      }
    }

    next();
  });
}

module.exports = { fileUpload };
