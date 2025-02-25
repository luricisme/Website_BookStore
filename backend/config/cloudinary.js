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
  params: {
    folder: 'Website_BookStore',  // 🔥 Đặt tên thư mục lưu ảnh tại đây
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'], // Định dạng được phép
    transformation: [
      {
        quality: 'auto', // Tự động tối ưu chất lượng
        fetch_format: 'auto' // Tự động chuyển định dạng phù hợp
      }
    ],
    public_id: (req, file) => file.originalname // Giữ nguyên tên file gốc
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
