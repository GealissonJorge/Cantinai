const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Cliente')
const Cliente = mongoose.model('Clientes')
require('../models/Carteira')
const Carteira = mongoose.model('Carteiras')
const bcrypt = require("bcryptjs")

router.get('/', (req, res) => {
    res.render('cliente/cliente')
})
router.get('/cadastro', (req, res) => {
    res.render('cliente/cadastro')
})
router.post('/cadastro/novo', (req, res) => {
    var erros=[]
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome obrigatório'})
    }
    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erros.push({texto: 'CPF obrigatório'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: 'Email obrigatório'})
    }
    if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
        erros.push({texto: 'Telefone obrigatório'})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: 'Senha obrigatório'})
    }
    if(erros.length > 0){
        res.render('cliente/cadastro', {erros: erros})
    }else{
        Cliente.findOne({email: req.body.email}).lean().then((cliente)=>{
            if(cliente){
                req.flash("error_msg","email ja cadatrado no sistema")
                res.redirect("/cliente/cadastro")
            }else{
                var idcarteira = new mongoose.Types.ObjectId();

                new Carteira().save().then((carteira) => {
                    idcarteira = carteira._id
                    const novoCliente = new Cliente({
                        nome: req.body.nome,
                        cpf: req.body.cpf,
                        email: req.body.email,
                        telefone: req.body.telefone,
                        senha: req.body.senha,
                        carteira: idcarteira
                    })
                    
                    bcrypt.genSalt(10,(erro,salt)=>{
                        bcrypt.hash(novoCliente.senha,salt,(erro,hash)=>{
                            if(erro){
                                req.flash("error_msg","erro ao criptografar")
                                res.redirect("/")
                            }
                            novoCliente.senha=hash
                            novoCliente.save().then(()=>{
                                req.flash("success_msg","usuario cadastrado")
                                res.redirect("/cliente")
                            }).catch((err)=>{
                                req.flash("error_msg","erro ao cadastrar")
                                res.redirect("/cliente/cadastro")
                            })
                        })
                    })
                    }).catch((err)=>{
                        req.flash("error_msg","houve um erro")
                        res.redirect("/")
                    })
            }
            }).catch((err)=>{
                req.flash("error_msg","houve um erro")
                res.redirect("/")
            })
    }
})

module.exports = router