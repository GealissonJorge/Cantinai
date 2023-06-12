const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const {eFuncionario} = require('../helpers/eFuncionario')

router.get('/', eFuncionario ,(req, res) => {
    res.render('funcionario/funcionario')
})
router.get('/recarga', eFuncionario ,(req, res) => {
    res.render('funcionario/recarga')
})
router.get('/venda', eFuncionario, (req, res) => {
    res.render('funcionario/venda')
})
module.exports = router