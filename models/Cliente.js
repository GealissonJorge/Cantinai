const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Cliente = new Schema({
    nome: {
        type : String,
        required : true
    },
    cpf: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    telefone: {
        type : String,
        required : true
    },
    senha: {
        type : String,
        required : true
    },
    Carteira: {
        type : Number,
        required : true,
        default: 0
    },
    date: {
        type : Date,
        default : Date.now()
    }
})
mongoose.model('Clientes', Cliente)