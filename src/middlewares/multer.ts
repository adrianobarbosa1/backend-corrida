import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

//UPLOAD DE IMAGEM
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpg', 'image/gif', 'image/pjpeg', 'image/png', 'image/jpeg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Arquivo com formato inválido'));
    }

    // Se o arquivo não bateu com nenhum aceito, executamos o callback com o segundo valor false (validação falhouo)
    return cb(null, false);
  },
});

export const upload = multer({ storage });
