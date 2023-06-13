const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {eFuncionario} = require('../helpers/eFuncionario')
require('../models/Taxa')
const Taxa = mongoose.model('Taxas')
require('../models/Venda')
const Venda = mongoose.model('Vendas')
router.get('/', eFuncionario ,(req, res) => {
    res.render('funcionario/funcionario')
})
router.get('/recarga', eFuncionario ,(req, res) => {
    res.render('funcionario/recarga')
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
            res.render('./qrcode/qrcode', {novaVenda: novaVenda})
        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Erro ao realizar venda')
            res.redirect('/funcionario/venda')
        })
    }  
})
module.exports = router