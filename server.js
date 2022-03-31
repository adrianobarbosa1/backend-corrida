const compression = require("compression");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require('path');

//AMBIENTE
const isProduction = process.env.NODE_ENV === 'production'
const PORT = 3006

//ARQUIVOS ESTATICOS
app.use('/public', express.static(__dirname + "/public"))
app.use('/public/img', express.static(__dirname + '/public/img'))

//SETUP MOONGODB
const dbs = require('./config/database.json')
const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

//EJS ENGINE
app.set('view engine', 'ejs')

//CONFIG
if (!isProduction) app.use(morgan('dev'))
app.use(cors())
app.disable('x-powered-by')
app.use(compression())

// SETUP BODY PARSER
app.use(express.urlencoded({ extended: true, limit: 1.5 * 1024 * 1024 }));
app.use(express.json({ limit: 1.5 * 1024 * 1024 }));

// MODELS
require("./models")

//ROUTES
app.use('/', require('./routes'))

//ROTA 404
app.use((req, res, next) => {
    const err = new Error('Rota não encontrada!')
    err.status = 404
    next(err)
})

//ROTA 422, 500, 401
app.use((req, res, next) => {
    res.status(err.status || 500)
    if (err.status !== 404) console.warn('Error: ', err.message, new Date())
    res.json({ errors: { message: err.message, status: err.status } })
})

//listen
app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Servidor rodando na //localhost:${PORT}`)
})
