const multer = require("multer");
const path = require("path");

function checkFileType(file, cb) {
  const filetypes = /pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Only PDF's are allowed");
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../tmp/uploads/pdf"));
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    const uniqueSuffix = Date.now();
    const fileName = file.fieldname + "-" + uniqueSuffix + "." + extension;
    req.body.fileName = fileName;
    req.body.extension = extension;
    cb(null, fileName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("pdf");

function pdfUpload(req, res, next) {
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

module.exports = pdfUpload;
