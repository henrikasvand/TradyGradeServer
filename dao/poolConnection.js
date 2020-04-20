const Pool = require('pg').Pool;
require('dotenv').config();
// Get Postgres entry information from dot dot dot dot .. rebooot : dot env

let conopts = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  database: process.env.PG_DB
  // port: process.env.PG_PORT
};

if (process.env.NODE_ENV === 'test') {
  conopts = {
    user: process.env.TEST_PG_USER,
    password: process.env.TEST_PG_PASSWORD,
    host: process.env.TEST_PG_HOST,
    database: process.env.TEST_PG_DB
  };
}

const pool = new Pool(conopts);

module.exports = pool;
