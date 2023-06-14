const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {eFuncionario} = require('../helpers/eFuncionario')
require('../models/Taxa')
const Taxa = mongoose.model('Taxas')
require('../models/Venda')
const Venda = mongoose.model('Vendas')
require('../models/Cliente')
const Cliente = mongoose.model('Clientes')
require('../models/Carteira')
const Carteira = mongoose.model('Carteiras')
require('../models/Funcionario')
const Funcionario = mongoose.model('Funcionarios')
router.get('/', eFuncionario ,(req, res) => {
    res.render('funcionario/funcionario')
})
router.get('/recarga', eFuncionario ,(req, res) => {
    res.render('funcionario/recarga')
})
router.post('/recarga', eFuncionario ,(req, res) => {
    Cliente.findOne({cpf: req.body.cpf}).lean().then((cliente)=>{
        var erros= []
        if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
            erros.push({texto: 'CPF obrigatório'})
        }

        if(!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null){
            erros.push({texto: 'Valor obrigatório'})
        }
        if(!cliente){
            erros.push({texto: 'Cliente não encontrado'})
        }
        if(erros.length > 0){
            res.render('funcionario/recarga', {erros: erros})
        }else{
            Carteira.findOne({_id: cliente.carteira}).then((carteira)=>{
                carteira.saldo = (req.body.valor)*1+carteira.saldo
                carteira.save().then(()=>{
                    req.flash("success_msg","Recarga realizada com sucesso")
                    res.redirect("/funcionario/recarga")
                }).catch(err=>{
                    req.flash("error_msg","erro ao realizar recarga")
                    res.redirect("/funcionario/recarga")
                })
            })
        }
    }).catch(err=>{
        req.flash("error_msg","erro ao realizar recarga")
        res.redirect("/funcionario/recarga")
    })
})

router.get('/venda', eFuncionario, (req, res) => {
    Taxa.findOne({}).then((taxas) => {
        res.render('funcionario/venda',{taxas: taxas})
    })
    
})
router.post('/venda/nova', eFuncionario ,(req, res) => {
    var erros= []
    if(req.body.bebida=="on"){
        req.body.bebida=1
    }else{
        req.body.bebida=0
    }
    if(req.body.suco=="on"){
        req.body.suco=1
    }else{
        req.body.suco=0
    }
    if(req.body.refrigerante=="on"){
        req.body.refrigerante=1
    }else{
        req.body.refrigerante=0
    }
    if(req.body.agua=="on"){
        req.body.agua=1
    }else{
        req.body.agua=0
    }
    if(!req.body.prato || typeof req.body.prato == undefined || req.body.prato == null){
        erros.push({texto: 'Prato obrigatório'})
    }
    if(erros.length > 0){
        res.render('funcionario/venda', {erros: erros})
    }else{
        const novaVenda= new Venda({
            valor: req.body.prato*req.body.taxa,
            bebida: req.body.bebida,
            suco: req.body.suco,
            refrigerante: req.body.refrigerante,
            agua: req.body.agua,
            funcionario: req.user._id

        })
        novaVenda.save().then(() => {
            req.flash('success_msg', 'Venda realizada com sucesso')
            //res.redirect('/funcionario/venda')
            Funcionario.findOne({_id: req.user._id}).lean().then((funcionario)=>{
                res.render('./qrcode/qrcode', {novaVenda: novaVenda, funcionario: funcionario})
            })
           
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Erro ao realizar venda')
            res.redirect('/funcionario/venda')
        })
    }  
})
module.exports = router