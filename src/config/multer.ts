const multer = require('multer');
const fs = require('fs')


//UPLOAD DE IMAGEM
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let { cpf } = req.query;
    cpf2 = cpf
    cpf2 = cpf2.replace(".", "");
    cpf2 = cpf2.replace(".", "");
    cpf2 = cpf2.replace("-", "");
    var isvalidate = function (data) {

      var dir = "/var/www/html/pma-api/eleicao-educacao/tmp/doc__eleicao/candidatos" + "/" + cpf2
      //var dir = "./tmp/doc__eleicao/candidatos" + "/" + cpf2
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return dir;
      } else {
        return dir;
      }
    };

    callback(null, isvalidate())

  },
  filename: (req, file, callback) => callback(null, file.fieldname + '-' + Date.now() + '.jpg'),
  fileFilter: (req, file, cb) => {

    // Procurando o formato do arquivo em um array com formatos aceitos
    // A função vai testar se algum dos formatos aceitos do ARRAY é igual ao formato do arquivo.
    const isAccepted = ['image/jpg', 'image/jpg', 'image/jpeg'].find(formatoAceito => formatoAceito == file.mimetype);

    // O formato do arquivo bateu com algum aceito?
    if (isAccepted) {
      // Executamos o callback com o segundo argumento true (validação aceita)
      return cb(null, true);
    }

    // Se o arquivo não bateu com nenhum aceito, executamos o callback com o segundo valor false (validação falhouo)
    return cb(null, false);
  }
});

const upload = multer({ storage })

//UPLOAD DE DOCUMENTOS

const storageInscricao = multer.diskStorage({

  destination: (req, file, callback) => {
    const { cpf } = req.query;

    let cpf2 = cpf;
    cpf2 = cpf2.replace(".", "");
    cpf2 = cpf2.replace(".", "");
    cpf2 = cpf2.replace("-", "");

    var isvalidate = function (data) {
      var dir = "/var/www/html/pma-api/eleicao-educacao/tmp/doc__eleicao/candidatos" + "/" + cpf2
      //var dir = "./tmp/doc__eleicao/candidatos" + "/" + cpf2
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return dir;
      } else {
        return dir;
      }
    };

    callback(null, isvalidate())

  },
  filename: (req, file, callback) => callback(null, file.fieldname + '-' + Date.now() + file.originalname.substring(file.originalname.indexOf("."))),

});

const uploadCandidato = multer({
  fileFilter: function (req, file, callback) {
    // if (file.mimetype !== 'application/pdf') {
    //   return callback(new Error('Extensão de arquivo não suportada'));
    // }
    callback(null, true)
  },
  storage: storageInscricao,
  limits: { fileSize: 5 * 1024 * 1024 }
})

module.exports = {
  upload,
  uploadCandidato,
}
