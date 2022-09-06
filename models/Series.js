const { Pool } = require('pg');
const server_data = require('../server_data.js');

const pool = new Pool(server_data);

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

module.exports = {
    connect: () => {
        return pool.connect();
    }
  }