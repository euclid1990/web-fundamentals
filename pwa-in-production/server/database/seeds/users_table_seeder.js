const moment = require('moment');
const bcrypt = require('bcrypt');
const utils = require('./utils');

exports.seed = function(knex, Promise) {
  rawPwd = 'admin@123456';
  encryptedPwd = bcrypt.hashSync(rawPwd, 10);
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      let now = utils.nowUtc();
      // Inserts seed entries
      return knex('users').insert([
        { name: 'Administrator', avatar: '', birthday: moment('1990-12-01').format('YYYY-MM-DD'), username: 'admin', email: 'admin@example.com', password: encryptedPwd, status: 'active', created_at: now }
      ]);
    });
};
