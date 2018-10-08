exports.up = function(knex, Promise) {
  return knex.schema.hasTable('cryptocurrencies').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('cryptocurrencies', function(table) {
        table.increments('id').unsigned().primary();
        table.string('name').notNull();
        table.string('symbol').notNull();
        table.bigInteger('market_cap').unsigned().notNull();
        table.float('price').unsigned().notNull();
        table.bigInteger('volume').unsigned().notNull();
        table.bigInteger('circulating_supply').unsigned().notNull();
        table.float('change', 5, 2).notNull();
        table.boolean('is_mineable').notNull();
        table.dateTime('created_at').notNull();
        table.dateTime('updated_at').nullable();
        table.dateTime('deleted_at').nullable();
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.hasTable('cryptocurrencies').then(function(exists) {
    if (exists) {
      return knex.schema.dropTable('cryptocurrencies');
    }
  });
};
