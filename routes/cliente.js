const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Cliente')
const Cliente = mongoose.model('Clientes')
require('../models/Carteira')
const Carteira = mongoose.model('Carteiras')
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
        var idcarteira = new mongoose.Types.ObjectId()
        new Carteira().save().then((carteira) => {
            idcarteira = carteira._id
            req.flash('success_msg', 'Carteira cadastrada com sucesso ')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao cadastrar')
            console.log('Erro ao cadastrar: ' + err)

        })
        const novoCliente = {
            nome: req.body.nome,
            cpf: req.body.cpf,
            email: req.body.email,
            telefone: req.body.telefone,
            senha: req.body.senha,
            carteira: idcarteira
        }
        new Cliente(novoCliente).save().then(() => {
            req.flash('success_msg', 'Cliente cadastrado com sucesso')
            res.redirect('/cliente')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao cadastrar')
            console.log('Erro ao cadastrar: ' + err)
            res.redirect('/cliente/cadastro')
        })
    }
})
module.exports = router