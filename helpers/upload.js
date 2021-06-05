const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

require("dotenv").config();

const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR); // в яку папку кладемо
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`); // як назвиваємо
  },
});

// Функция создания файлов
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2Mb
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes("image")) {
      cb(null, false);
      return;
    }
    cb(null, true);
  },
});

module.exports = upload;
