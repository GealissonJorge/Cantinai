const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Cliente')
const Cliente = mongoose.model('Clientes')
require('../models/Carteira')
const Carteira = mongoose.model('Carteiras')
const bcrypt = require("bcryptjs")
require('../models/Venda')
const Venda = mongoose.model('Vendas')
const {eCliente} = require('../helpers/eCliente')

router.get('/', eCliente ,(req, res) => {
    if(!req.user){
        req.flash('error_msg', 'É necessario estar logado para acessar esta página')
        res.redirect('/')
    }else{
        Cliente.findOne({_id: req.user._id}).populate('carteira').lean().then((cliente)=>{
            res.render('cliente/cliente', {cliente: cliente})
        }).catch((err) => {
            req.flash('error_msg', 'É necessario estar logado para acessar esta página')
            res.redirect('/')
        })
    }
    
    
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
        Cliente.findOne({email: req.body.email, cpf: req.body.cpf}).lean().then((cliente)=>{
            if(cliente){
                req.flash("error_msg","email ou cpf ja cadatrado no sistema")
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
                                res.redirect("/login")

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
router.get('/comprar/:id', (req, res) => {
    Venda.findOne({_id: req.params.id}).populate('funcionario').lean().then((venda)=>{
        res.render('cliente/comprar', {venda: venda})
    })
})
router.post('/comprar/:id', (req, res) => {
    Venda.findOne({_id: req.params.id}).then((venda)=>{
        venda.cliente= req.user._id
        Cliente.findOne({_id: req.user._id}).then((cliente)=>{
            Carteira.findOne({_id: cliente.carteira}).then((carteira)=>{
                carteira.saldo = carteira.saldo - venda.valor
                venda.save().then(()=>{
                    
                    carteira.save().then(()=>{
                        req.flash("success_msg","compra realizada")
                        res.redirect("/cliente")
                    })
                }).catch((err)=>{
                    req.flash("error_msg","houve um erro")
                    res.redirect("/cliente")
                })
            })
        }).catch((err)=>{
            console.log(err)
        })
    }).catch((err)=>{
        console.log(err)
    })
})
router.get('/historico', eCliente ,(req, res) => {
    Venda.find({cliente: req.user._id}).populate('funcionario').then((vendas)=>{
        res.render('cliente/historico', {vendas: vendas})
    })
})


module.exports = router