const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Produto = new Schema({
    descricao: {
        type : String,
        required : true
    },
    quantidade: {
        type : Number,
        required : true
    },
    preco: {
        type : Number,
        required : true
    },
    date: {
        type : Date,
        default : Date.now()
    }
})
mongoose.model('Produtos', Produto)