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
    serie = await selectFrom('titulo, assistido_em, nota','series', 'ORDER BY id')
        .catch(err => console.log(`Erro ao buscar linhas:${err.stack}`));
    movie = await getMovies();

    res.render('index', {movie, serie});
});

//Cria novo filme
router.post('/', async (req, res) => {
    //A função addDays resolve o problema de fuso horário
    const movie = new Movie ({
        titulo: req.body.titulo,
        assistidoEm: new Date(req.body.assistidoEm).addDays(1),
        nota: req.body.nota
    });
    const serie = {
        titulo: req.body.titulo2,
        assistidoEm: new Date(req.body.assistidoEm2).addDays(1).toLocaleString("pt-BR", {dateStyle: "short"}),
        nota: req.body.nota2
    };

    try {
        //Salva na MongoDB
        if (movie.titulo !== undefined) {
            const newMovie = movie.save();
        }
        //Salva na PostgreSQL
        if (serie.titulo !== undefined) {
            await insertInto('series', 'titulo, assistido_em, nota',serie.titulo, serie.assistidoEm, serie.nota)
                .catch(err => console.log(`Erro ao inserir linha na tabela:${err.stack}`));
        }
        //Deleta da MongoDB
        if (req.body.btnMD !== undefined) {
            const ind = req.body.btnMD;
            await deleteMovie(ind);
        }
        //Deleta da PostgreSQL
        if (req.body.btnPSQL !== undefined) {
            const q = await selectFrom('id', 'series')
                .catch(err => console.log(`Erro ao buscar linhas [id]:${err.stack}`));
            const rowId = q[req.body.btnPSQL].id;
            await deleteByIdFrom('series', rowId)
                .catch(err => console.log(`Erro ao deletar registro:${err.stack}`));
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

async function selectFrom(col, table, condition) {
    const client = await psql.connect()
  try {
    const res = await client.query(`SELECT ${col} FROM ${table} ${condition}`);
    return res.rows;
  } finally {
    client.release();
  } 
}

async function insertInto(table, col, v1, v2, v3) {
    const client = await psql.connect(); 
    try {
        await client.query(`INSERT INTO ${table} (${col}) VALUES ($1, $2, $3)`, [v1, v2, v3]);
        console.log('[PSQL] Nova linha inserida');
    } finally {
        client.release();
    }
}

async function deleteByIdFrom(table, id) {
    const client = await psql.connect();
    try {
        await client.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        console.log(`[PSQL] Um registro de id = ${id} foi deletado.`);
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

async function deleteMovie(ind) {
    try {
        const res = await Movie.find();
        const id = res[ind]._id;

        await Movie.deleteOne({_id: id});
        console.log(`Filme com id ${id} deletado.`);
    } catch (e) {
        console.log(e);
    }
}

module.exports = router;