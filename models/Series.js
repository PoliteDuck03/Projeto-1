const mongoose = require('mongoose');

const serieSchema = new mongoose.Schema({
    titulo2: {
        type: String,
        required: true
    },
    assistidoEm2: {
        type: Date,
        required: true,
        default: new Date()
    },
    nota2: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Serie', serieSchema);