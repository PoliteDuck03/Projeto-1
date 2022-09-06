const express = require('express');
const router = express.Router();
const Movie = require('../models/Movies.js');
const Serie = require('../models/Series.js');
const bodyParser = require('body-parser');
const psql = require('../models/Series.js');

router.get('/', async (req, res) => {
    let movie;
    let serie = [];
    //A query do psql só pode pegar erros depois de liberar o client, por isso ele aparece aqui em cima
    serie = await selectFrom('*','series').catch(err => console.log(`Erro ao buscar linhas:${err.stack}`));
    movie = await getMovies();

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

    let dataSerieString;
    if (req.body.assistidoEm2) {
        const dataSerie = new Date(req.body.assistidoEm2).addDays(1);
        dataSerieString = dataSerie.toISOString().slice(0,10);
    }

    const serie = {
        titulo: req.body.titulo2,
        assistidoEm: dataSerieString,
        nota: req.body.nota2
    };

    try {
        if (movie.titulo !== undefined) {
            const newMovie = movie.save();
        }

        if (serie.titulo !== undefined) {
            await insertInto(serie.titulo, serie.assistidoEm, serie.nota)
                .catch(err => console.log(`Erro ao inserir linha na tabela:${err.stack}`));
        }

        res.redirect('/');
    } catch (e) {
        console.log(e.message);
    }
});

Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

//SQL Queries vv

async function selectFrom(text, table, condition) {
    const client = await psql.connect()
  try {
    const res = await client.query(`SELECT * FROM ${table} ${condition}`);
    return res.rows;
  } finally {
    client.release();
  } 
}

async function insertInto(v1, v2, v3) {
    const client = await psql.connect();
    try {
        await client.query('INSERT INTO series (titulo, assistido_em, nota) VALUES ($1, $2, $3)', [ v1, v2, v3]);
        console.log('[PSQL] Nova linha inserida');
    } finally {
        client.release();
    }
}

//MongoDB Queries vv

async function getMovies() {
    try{
        const res = await Movie.find();
        return res;
    } catch (e) {
        console.log(e);
    }
}

module.exports = router;