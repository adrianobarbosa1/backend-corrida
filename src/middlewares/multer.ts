import multer from 'multer';
import path from 'path';


//UPLOAD DE IMAGEM
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpg', 'image/gif', 'image/pjpeg', 'image/png', 'image/jpeg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Arquivo com formato inválido'));
    }

    return cb(null, false);
  },
});

export const multerConfig = multer({ storage });
