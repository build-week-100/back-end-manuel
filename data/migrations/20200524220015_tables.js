
exports.up = function(knex) {
  return knex.schema
    .createTable('users', tbl => {
        tbl.increments();
        tbl.text('username', 125).notNullable().unique();
        tbl.text('password', 125).notNullable();
    })

    .createTable('listings', tbl => {
        tbl.increments();
        tbl.text('product_name', 125).notNullable();
        tbl.text('product_category', 125).notNullable();
        tbl.text('product_description', 250);
        tbl.text('product_quantity', 125).notNullable();
        tbl.text('product_price').notNullable();
        tbl.text('country', 125).notNullable();
        tbl.text('market_name', 125).notNullable();
        tbl.timestamp('created_at').defaultTo(knex.fn.now());

        tbl.integer('user_id')
            .notNullable()
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('listings')
    .dropTableIfExists('users')
};
