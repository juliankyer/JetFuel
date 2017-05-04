
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('links').del()
    .then(() => knex('folders').del())
    .then(() => {
      return Promise.all([
        knex('folders').insert({
          name: 'My Test Folders'
        }, 'id')
        .then(folder => {
          return knex('links').insert([
            {
              longURL: 'www.google.com',
              shortURL: 'jet.fuel/2343d',
              clicks: 0,
              folder_id: folder[0]
            },
            {
              longURL: 'www.cyclingnews.com',
              shortURL: 'jet.fuel/2d33d',
              clicks: 0,
              folder_id: folder[0]
            }
          ])
        })
      ])
    });
};
