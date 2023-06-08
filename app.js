const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const admin = require('./routes/admin')
const funcionario= require('./routes/funcionario')
const cliente = require('./routes/cliente')
//config
//bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//handlebars
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
//mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://0.0.0.0:27017/cantinai', 
{useNewUrlParser: true, useUnifiedTopology: true}).then(()=> {
    console.log('MongoDB conectado')
}).catch((err)=> {
    console.log('Erro ao se conectar: ' + err)
})
//public
app.use(express.static(path.join(__dirname, 'public')))
//rotas
app.use('/admin', admin)
app.use('/funcionario', funcionario)
app.use('/cliente', cliente)
app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})