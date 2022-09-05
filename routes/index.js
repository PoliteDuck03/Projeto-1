const express = require('express');
const router = express.Router();
const Movie = require('../models/Movies.js');
const Serie = require('../models/Series.js');
const bodyParser = require('body-parser');

router.get('/', async (req, res) => {
    let movie;
    let serie;
    try{
        movie = await Movie.find();
        serie = await Serie.find();
    } catch (e) {
        console.log(e);
        movie = [];
        serie = [];
    }
    res.render('index', {movie, serie});
});

//Cria nova movie
router.post('/', async (req, res) => {
    //A função addDays resolve o problema de fuso horário
    const movie = new Movie ({
        titulo: req.body.titulo,
        assistidoEm: new Date(req.body.assistidoEm).addDays(1),
        nota: req.body.nota
    });
    const serie = new Serie ({
        titulo2: req.body.titulo2,
        assistidoEm2: new Date(req.body.assistidoEm2).addDays(1),
        nota2: req.body.nota2
    });
    try {
        if (movie.titulo !== undefined) {
            const newMovie = movie.save();
        }
        if (serie.titulo2 !== undefined) {
            const newSerie = serie.save();
        }
        
        res.redirect('/');
    } catch (e) {
        console.log(e.message);
    }

})

Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

module.exports = router;