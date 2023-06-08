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
    Produto.find().then((produtos) => {
        res.render('admin/produto', {produtos: produtos})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar produtos')
        res.redirect('/admin/produto')
    })
})
router.get('/produto/add', (req, res) => {
    res.render('admin/addproduto')
})
router.post('/produto/nova', (req, res) => {
    var erros= []
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: 'Descrição obrigatória'})
    }
    if(!req.body.qtd || typeof req.body.qtd == undefined || req.body.qtd == null){
        erros.push({texto: 'Quantidade obrigatória'})
    }
    if(!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null){
        erros.push({texto: 'Valor obrigatório'})
    }
    if(erros.length > 0){
        res.render('admin/addproduto', {erros: erros})
    }else{
        const novoProduto = {
            descricao: req.body.descricao,
            quantidade: req.body.qtd,
            preco: req.body.valor
        }
        new Produto(novoProduto).save().then(() => {
            req.flash('success_msg', 'Produto cadastrado com sucesso')
            res.redirect('/admin/produto')
        }).catch((err) => {

            req.flash('error_msg', 'Erro ao cadastrar')
            console.log('Erro ao cadastrar: ' + err)
            res.redirect('/admin/produto')
        })
}
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