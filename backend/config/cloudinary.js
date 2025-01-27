const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'], // Thêm nhiều định dạng ảnh
  transformation: [
    { 
      quality: 'auto',   // Tự động nén ảnh với chất lượng tối ưu
      fetch_format: 'auto', // Chuyển đổi định dạng sang 'webp' hoặc 'auto' cho hiệu suất tối ưu
    }
  ],
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
