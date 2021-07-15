module.exports = {
    secret: "WREFFEFD8FEWF231FEW64654FEWf354doihfeonkf564F",
    api: process.env.NODE_ENV === 'production' ? "http://api.anapolis.go.gov.br/apiCorrida" : 'http://localhost:3006',
   // loja: process.env.NODE_ENV === 'production' ? "firebase" : 'http://localhost:8000',
}