const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Administrador = new Schema({
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
        type : Number,
        required : true
    },
    senha: {
        type : String,
        required : true
    },
    endereco: {
        type : String,
        required : true
    },
    date: {
        type : Date,
        default : Date.now()
    }
})
mongoose.model('Administradores', Administrador)