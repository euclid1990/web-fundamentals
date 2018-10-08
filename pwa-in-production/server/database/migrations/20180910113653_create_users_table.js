exports.up = function(knex, Promise) {
  return knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('users', function(table) {
        table.increments('id').unsigned().primary();
        table.string('name', 100).notNull();
        table.string('avatar', 255).nullable();
        table.date('birthday').nullable();
        table.string('username', 50).unique().nullable();
        table.string('email').unique().notNull();
        table.string('password').notNull();
        table.enum('status', ['inactive', 'active', 'banned']).notNull().defaultTo('inactive');
        table.dateTime('created_at').notNull();
        table.dateTime('updated_at').nullable();
        table.dateTime('deleted_at').nullable();
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('users').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('users');
    }
  });
};
