const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
router.get('/', (req, res) => {
    res.render('funcionario/funcionario')
})
router.get('/recarga', (req, res) => {
    res.render('funcionario/recarga')
})
router.get('/venda', (req, res) => {
    res.render('funcionario/venda')
})
module.exports = router