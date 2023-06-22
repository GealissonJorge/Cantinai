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
require('../models/Administrador')
const Administrador = mongoose.model('Administradores')
require('../models/Produto')
const Produto = mongoose.model('Produtos')
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
        Produto.find({}).lean().then((produtos)=>{
            res.render('funcionario/venda',{taxas: taxas, produtos: produtos})
        })
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
    if(req.body.produto==0){
        req.body.produto=null
    }
    if(erros.length > 0){
        Taxa.findOne({}).then((taxas) => {
            res.render('funcionario/venda',{erros: erros, taxas: taxas})
        })
    }else{

        Produto.findOne({_id: req.body.produto}).lean().then((produto)=>{
            var auxValor = (req.body.bebida*req.body.bebidaValor)+(req.body.suco*req.body.sucoValor)+(req.body.refrigerante*req.body.refriValor)+(req.body.agua*req.body.aguaValor)
            if(!produto){
                auxValor=auxValor+0
            }else{
                
                auxValor+=produto.preco
            }
            const novaVenda= new Venda({
            
                valor: (req.body.prato*req.body.taxa)+auxValor,
                bebida: req.body.bebida,
                suco: req.body.suco,
                refrigerante: req.body.refrigerante,
                agua: req.body.agua,
                funcionario: req.user._id,
                horario: Date.now()
            })
            novaVenda.save().then(() => {
                req.flash('success_msg', 'Venda realizada com sucesso')
                //res.redirect('/funcionario/venda')
                Funcionario.findOne({_id: req.user._id}).lean().then((funcionario)=>{
                    if(!funcionario){
                        Administrador.findOne({_id: req.user._id}).lean().then((admin)=>{
                            res.render('./qrcode/qrcode', {novaVenda: novaVenda, funcionario: admin})    
                        })
    
                    }else{
                        res.render('./qrcode/qrcode', {novaVenda: novaVenda, funcionario: funcionario})
                    }
                    
                })
               
            }).catch((err) => {
                console.log(err)
                req.flash('error_msg', 'Erro ao realizar venda')
                res.redirect('/funcionario/venda')
            })

        })
        
    }  
})
router.get('/historico', (req, res) => {
    Venda.find({funcionario: req.user._id}).populate('cliente').sort({historico: 'desc'}).then((vendas)=>{
        res.render('funcionario/historico', {vendas: vendas})
    })
})
router.post('/historico', (req, res) => {
    if(req.body.filtro=='data'){
        Venda.find({funcionario: req.user._id}).populate('cliente').sort({horario: 'desc'}).then((vendas)=>{
            res.render('admin/historico', {vendas: vendas})    
            
        })
    }
    if(req.body.filtro=='nome'){
        Venda.find({funcionario: req.user._id}).populate('cliente').sort({nome: 'desc'}).then((vendas)=>{
            res.render('admin/historico', {vendas: vendas})    
            
        })
    }
    if(req.body.filtro=='valor'){
        Venda.find({funcionario: req.user._id}).populate('cliente').sort({valor: 'desc'}).then((vendas)=>{
            res.render('admin/historico', {vendas: vendas})    
            
        })
    }
})
module.exports = router