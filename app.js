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
const qrmanagement = require('./routes/qrcode')
const passport = require('passport')
require("./config/auth")(passport)

//config
//sessao
app.use(session({
    secret: 'secret',
    resave: true,
    cookie: { maxAge: 60000 },
    saveUninitialized: true
}))
//passport
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
//middlewares padrao de msg de feedback
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})
//bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//handlebars
app.engine("handlebars", handlebars.engine({ defaultLayout: "main", runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true, //resolve problema de acessar o banco no handlebars, tava sendo negado
}, }))
app.set("view engine", "handlebars")
//mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://mongo:b1yru3MaG6wujUwwzee5@containers-us-west-186.railway.app:6604'||'mongodb://0.0.0.0:27017/cantinai', 
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
app.use('/qrcode', qrmanagement)
app.get('/', (req, res) => {
    res.render('login')
})
app.get('/index', (req, res) => {
    res.render('index')
})
app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',
    passport.authenticate('local',{
        failureRedirect: "/login",
        failureFlash: true
    }),(req,res,next)=>{
        if(req.user.eAdmin == 1){
            res.redirect('/admin')
        }else if(req.user.eFuncionario == 1){
            res.redirect('/funcionario')
            
        }else{
            res.redirect('/cliente')
        }
    })

app.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        req.flash("success_msg","deslogado")
        res.redirect("/")
    })
})

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
    console.log('listening on port 3000')
})