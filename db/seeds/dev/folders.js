
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
              longURL: 'www.fakesite.com',
              clicks: 0,
              folder_id: folder[0]
            },
            {
              longURL: 'www.cyclingnews.com',
              clicks: 0,
              folder_id: folder[0]
            }
          ])
        })
      ])
    });
};
