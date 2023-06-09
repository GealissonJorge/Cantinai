const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Taxa = new Schema({
    taxa: {
        type: Number,
        required: true,
        default: 0.0
    }
})
mongoose.model('Taxas', Taxa)