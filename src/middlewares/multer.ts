import multer from 'multer';
import path from 'path';
import fs from 'fs'
import { athleteService } from '../services';

//UPLOAD DE IMAGEM
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { cpf } = await athleteService.getAthleteByIdUser(req.user.id)
    let cpfFormated = cpf;
    cpfFormated = cpfFormated.replace(".", "");
    cpfFormated = cpfFormated.replace(".", "");
    cpfFormated = cpfFormated.replace("-", "");

    const isvalidate = () => {
      const dir = path.resolve(__dirname, '..', '..', 'tmp', 'uploads', cpfFormated)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return dir;
      } else {
        return dir;
      }
    };

    cb(null, isvalidate());
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace('.', '')}.jpeg`);
  },
  limits: {
    fileSize: 2 * 1024 * 1024
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

export const upload = multer({ storage });
