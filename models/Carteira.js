const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Carteira = new Schema({
    saldo: {
        type: Number,
        required: true,
        default: 0.0
    },
    date: {
        type: Date,
        default: Date.now()
    }
})
mongoose.model('Carteiras', Carteira)