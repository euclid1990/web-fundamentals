exports.up = function(knex, Promise) {
  return knex.schema.hasTable('user_password_resets').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('user_password_resets', function(table) {
        table.increments('id').unsigned().primary();
        table.integer('user_id').unsigned().notNull();
        table.string('email').notNull();
        table.string('token').notNull();
        table.dateTime('created_at').notNull();
        table.dateTime('updated_at').nullable();
        table.dateTime('deleted_at').nullable();
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('user_password_resets').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('user_password_resets');
    }
  });
};
