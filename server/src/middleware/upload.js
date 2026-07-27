import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target Directories: public/images/products AND uploads/products
const publicDir = path.join(__dirname, '../../../public/images/products');
const uploadDir = path.join(__dirname, '../../uploads/products');

// Ensure directories exist
[publicDir, uploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to public/images/products
    cb(null, publicDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `product-${uniqueSuffix}${ext}`;

    // Duplicate/copy to server/uploads/products as well
    setTimeout(() => {
      try {
        const src = path.join(publicDir, filename);
        const dest = path.join(uploadDir, filename);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      } catch (err) {
        console.warn('Backup copy to uploads failed:', err);
      }
    }, 100);

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (JPG, PNG, WebP) yang diizinkan'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
