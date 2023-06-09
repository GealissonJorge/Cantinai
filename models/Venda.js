const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Venda = new Schema({
    valor:{
        type: Number,
        required: true
    },
    horario:{
        type: Date,
        default: Date.now()
    }
})
mongoose.model('Vendas', Venda)