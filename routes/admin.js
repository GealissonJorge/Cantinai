const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Produto')
const Produto = mongoose.model('Produtos')
require('../models/Funcionario')
const Funcionario = mongoose.model('Funcionarios')
require('../models/Administrador')
const Administrador = mongoose.model('Administradores')
router.get('/', (req, res) => {
    res.render('admin/administrador')
})
router.get('/venda', (req, res) => {
    res.send('realizando venda')
})
router.get('/atualizar', (req, res) => {
    res.send('atualiza taxa')
})
//Gerenciamneto de Produto
router.get('/produto', (req, res) => {
    res.render('admin/produto')
})
router.get('/produto/add', (req, res) => {
    res.render('admin/addproduto')
})
router.post('/produto/nova', (req, res) => {
    const novaCatergoria = {
        descricao: req.body.descricao,
        quantidade: req.body.qtd,
        preco: req.body.valor
    }
    new Produto(novaCatergoria).save().then(() => {
        console.log('Cadastrado com sucesso')
    }).catch((err) => {
        console.log('Erro ao cadastrar: ' + err)
    })
})

//Gerenciamento de Usuário
router.get('/usuarios', (req, res) => {
    res.render('admin/usuarios')
})
router.get('/usuarios/addfuncionario', (req, res) => {
    res.render('admin/addfuncionario')
})
router.post('/funcionario/novo', (req, res) => {
    const novoFuncionario = {
        nome: req.body.nome,
        cpf: req.body.cpf,
        email: req.body.email,
        telefone: req.body.telefone,
        senha: req.body.senha,
        Endereço: req.body.endereco
    }
    new Funcionario(novoFuncionario).save().then(() => {
        console.log('Cadastrado com sucesso')
    }).catch((err) => {
        console.log('Erro ao cadastrar: ' + err)
    })
})

router.get('/usuarios/addadministrador', (req, res) => {
    res.render('admin/addadministrador')
})
router.post('/administrador/novo', (req, res) => {
    const novoAdministrador = {
        nome: req.body.nome,
        cpf: req.body.cpf,
        email: req.body.email,
        telefone: req.body.telefone,
        senha: req.body.senha,
        Endereço: req.body.endereco
    }
    new Administrador(novoAdministrador).save().then(() => {
        console.log('Cadastrado com sucesso')
    }).catch((err) => {
        console.log('Erro ao cadastrar: ' + err)
    })
})
//gerenciar taxa
router.get('/taxa', (req, res) => {
    res.render('admin/taxa')
})



//adicionar rota para editar um usuario

module.exports = router