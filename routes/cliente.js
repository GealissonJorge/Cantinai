const express = require('express')
const router = express.Router()
router.get('/', (req, res) => {
    res.render('cliente/cliente')
})
router.get('/cadastro', (req, res) => {
    res.render('cliente/cadastro')
})
module.exports = router