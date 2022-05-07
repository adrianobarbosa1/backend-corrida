import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outPath = path.resolve(__dirname, '..', '..', 'tmp', 'uploads')

export const compressImage = async (file) => {
  try {
    await sharp(file.path)
      // .resize(1000)
      .toFormat('webp')
      .webp({ quality: 50 })
      .toBuffer()
  } catch (err) {
    console.log(err)
  }
  //     .then((data) => {
  //       // Deletando o arquivo antigo
  //       // O fs.acess serve para testar se o arquivo realmente existe, evitando bugs
  //       fs.access(file.path, (err) => {
  //         // Um erro significa que a o arquivo não existe, então não tentamos apagar
  //         if (!err) {
  //           //Se não houve erros, tentamos apagar
  //           fs.unlink(file.path, (err) => {
  //             // Não quero que erros aqui parem todo o sistema, então só vou imprimir o erro, sem throw.
  //             if (err) console.log(err);
  //           });
  //         }
  //       })

  //       fs.writeFile(outPath, data, (err) => {
  //         if (err) {
  //           // Já aqui um erro significa que o upload falhou, então é importante que o usuário saiba.
  //           throw err;
  //         }
  //       });

  //       // Se o código chegou até aqui, deu tudo certo, então vamos retornar o novo caminho
  //       return file.path;
  //     });

  // .then((data) => {
  //   // Deletando o arquivo antigo
  //   // O fs.acess serve para testar se o arquivo realmente existe, evitando bugs
  //   fs.access(file.path, (err) => {
  //     // Um erro significa que a o arquivo não existe, então não tentamos apagar
  //     if (!err) {
  //       //Se não houve erros, tentamos apagar
  //       fs.unlink(file.path, (err) => {
  //         // Não quero que erros aqui parem todo o sistema, então só vou imprimir o erro, sem throw.
  //         if (err) console.log(err);
  //       });
  //     }
  //   });

  //   //Agora vamos armazenar esse buffer no novo caminho
  //   fs.writeFile(file.path, data, (err) => {
  //     if (err) {
  //       // Já aqui um erro significa que o upload falhou, então é importante que o usuário saiba.
  //       throw err;
  //     }
  //   });

  //   // Se o código chegou até aqui, deu tudo certo, então vamos retornar o novo caminho
  //   return file.path;
  // });
};
