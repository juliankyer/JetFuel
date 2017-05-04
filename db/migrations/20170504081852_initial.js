
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', function(table) {
      table.increments('id').primary();
      table.string('name');
      
      table.timestamps();
    }),
    
    knex.schema.createTable('links', function(table) {
      table.increments('id').primary();
      table.string('longURL');
      table.string('shortURL');
      table.integer('clicks');
      
      table.integer('folder_id').unsigned()
      table.foreign('folder_id').references('folders.id');
      
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('folders'),
    knex.schema.dropTable('links')
  ]);
};
