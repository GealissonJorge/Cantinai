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
    carteira: {
        type : Schema.Types.ObjectId,
        ref: 'Carteiras',
        required : true
    },
    date: {
        type : Date,
        default : Date.now()
    },
    eAdmin:{
        type: Number,
        default: 0
    },
    eFuncionario:{
        type: Number,
        default: 0
    }
})
mongoose.model('Clientes', Cliente)