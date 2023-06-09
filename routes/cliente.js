const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Cliente')
const Cliente = mongoose.model('Clientes')
router.get('/', (req, res) => {
    res.render('cliente/cliente')
})
router.get('/cadastro', (req, res) => {
    res.render('cliente/cadastro')
})

router.post('/cadastro/novo', (req, res) => {
    var erro=[]
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erro.push({texto: 'Nome obrigatório'})
    }
    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erro.push({texto: 'CPF obrigatório'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erro.push({texto: 'Email obrigatório'})
    }
    if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
        erro.push({texto: 'Telefone obrigatório'})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erro.push({texto: 'Senha obrigatório'})
    }
    if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null){
        erro.push({texto: 'Endereço obrigatório'})
    }
    if(erro.length > 0){
        res.render('cliente/cadastro', {erros: erro})
    }else{
        const novoCliente = {
            nome: req.body.nome,
            cpf: req.body.cpf,
            email: req.body.email,
            telefone: req.body.telefone,
            senha: req.body.senha,
            Endereço: req.body.endereco
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