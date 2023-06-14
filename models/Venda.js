const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Venda = new Schema({
    valor:{
        type: Number,
        required: true
    },
    cliente:{
        type: Schema.Types.ObjectId,
        ref: 'Clientes'
    },
    funcionario:{
        type: Schema.Types.ObjectId,
        ref: 'Funcionarios',
        required: true
    },
    bebida:{
        type: Number,
        default: 0
    },
    suco:{
        type: Number,
        default: 0
    },
    refrigerante:{
        type: Number,
        default: 0
    },
    agua:{
        type: Number,
        default: 0
    },
    horario:{
        type: Date,
        default: Date.now()
    }
})
mongoose.model('Vendas', Venda)