const express = require('express');
const app = express();
const bodyParser = require('body-parser');


const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Jet Fuel';


app.get('/', (request, response) => {
  if (! `${__dirname}/public/index.html`) {
    return response.status(404).send({
      error: 'File not found'
    })
  }

  fs.readFile(`${__dirname}/public/index.html`, (err, file) => {
    response.send(file)
  });
});

// app.post to add Folder
app.post('/api/v1/folders', (request, response) => {
  const folderInfo = request.body

  database('folders').insert(folderInfo, ['id', 'name'])
  .then(folder => {
    response.status(201).json( folder[0] )
  });
});


app.post('/api/v1/links', (request, response) => {
  const { folderID, newURL } = request.body
  database('links').insert({
    longURL: newURL,
    clicks: 0,
    folder_id: folderID,
  }, 'id').then((id) => {
    response.status(201).json(id)
  })
  .catch((error) => {
    console.log('WE NEED  A BETTER ERROR');
  });
});

app.get('/api/v1/folders/:folderID', (request, response) => {
  const { folderID } = request.params
  database('links').where('folder_id', folderID).select()
    .then(links => {
      response.status(200).json(links)
    })
    .catch((error) => {
      console.error(error)
    });
});

app.get('/api/v1/folders', (request, response) => {
  console.log('give client all the folders!')
  database('folders').select()
    .then(folders => {
      console.log(folders)
      response.status(200).json(folders)
    })
    .catch((error) => {
      console.error(error)
    })
})

app.get('/:shortID', (request, response) => {
  const { shortID } = request.params
  const actualID = parseInt(shortID, 32)

  database('links').where('id', actualID).select()
    .then((link) => {
      const url = link[0].longURL
      response.redirect('http://' + url)
      /// May need to revist the text input handling here
    })

  database('links').where('id', actualID).select()
    .then((link) => {
      let newCount = link[0].clicks + 1;
      database('links')
        .where('id', actualID)
        .update('clicks', newCount)
        .catch((error) => {
          console.log(error);
        })
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
