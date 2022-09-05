const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    assistidoEm: {
        type: Date,
        required: true,
        default: new Date()
    },
    nota: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Movie', movieSchema);