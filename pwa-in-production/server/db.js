const knex = require('knex');
const utils = require('./utils');
const knexfile = require('./knexfile');

module.exports = function() {
  return knex(knexfile[utils.env('NODE_ENV', 'development')]);
}
