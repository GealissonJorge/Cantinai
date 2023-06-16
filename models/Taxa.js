const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Taxa = new Schema({
    taxa: {
        type: Number,
        required: true,
        default: 0.0
    },
    bebida: {
        type: Number,
        required: true,
        default: 0
    },
    suco: {
        type: Number,
        required: true,
        default: 0
    },
    refrigerante: {
        type: Number,
        required: true,
        default: 0
    },
    agua: {
        type: Number,
        default: 0
    }

})
mongoose.model('Taxas', Taxa)