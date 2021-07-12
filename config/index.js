export default {
    secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : "WREFFEFD8FEWF231FEW64654FEWf354doihfeonkf564F",
    api: process.env.NODE_ENV === 'production' ? "http://api.anapolis.go.gov.br" : 'http://localhost:3000',
   // loja: process.env.NODE_ENV === 'production' ? "firebase" : 'http://localhost:8000',
}