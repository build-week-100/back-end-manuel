const knex = require("knex");

const knexfile = requier("../knexfile");

const environment = process.env.DB_ENV || "development";

module.exports = knex(knexfile[environment]);