const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Cliente')
const Cliente = mongoose.model('Clientes')
require('../models/Carteira')
const Carteira = mongoose.model('Carteiras')
router.get('/', (req, res) => {
    res.render('funcionario/funcionario')
})

router.get('/recarga', (req, res) => {
    res.render('funcionario/recarga')
})
router.post('/recarga', (req, res) => {
    var erros= []
            if(!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null){
                erros.push({texto: 'Valor obrigatório'})
            }
            if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
                erros.push({texto: 'CPF obrigatório'})
            }
            if(erros.length > 0){
                res.render('funcionario/recarga', {erros: erros})
            }else{

                Cliente.findOne({cpf: req.body.cpf}).populate('carteira').sort({date: 'desc'}).then((cliente) => {
                    if(!cliente){
                        req.flash('error_msg', 'Cliente inexistente')
                        res.redirect('/funcionario/recarga')
                    }else{

                        Carteira.findOne({_id: cliente.carteira}).then((carteira) => {                        
                            carteira.saldo = req.body.valor
                            carteira.save().then(() => {
                                req.flash('success_msg', 'Carteira atualizada com sucesso para o cliente: '+cliente.nome)
                                res.redirect('/funcionario/recarga')
                            }).catch((err) => {
                                req.flash('error_msg', 'Erro ao atualizar')
                                console.log('Erro ao atualizar: ' + err)
                                res.redirect('/funcionario/recarga')
                            })
                
                    }).catch((err) => {
                        req.flash('error_msg', 'Erro ao procurar cliente')
                        console.log('Erro ao atualizar: ' + err)
                        res.redirect('/funcionario/recarga')
                    })
                    }
                    
    })
}
})
router.get('/venda', (req, res) => {
    res.render('funcionario/venda')
})
module.exports = router