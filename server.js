const express = require('express');
const app = express();
const bodyParser = require('body-parser');


const environment = 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Jet Fuel';

// app.locals.folders = []


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
  })

  // check if folder exists - no need to on server, checking locally now.
  // make new folder in DB, make new ID
  // app.locals.folders.push(folderName)
  // return info if successful

})


app.post('/api/v1/links', (request, response) => {
  const { folderID, newURL } = request.body
  console.log(folderID, newURL);
  database('links').insert({
    longURL: newURL,
    shortURL: null,
    clicks: 0,
    folder_id: folderID,
  }, 'id').then((id) => {
    console.log(id);
    response.status(201).json(id)
  })
})

app.get('/api/v1/folders/:folderID', (request, response) => {
  const { folderID } = request.params
console.log(folderID)
  database('links').where('folder_id', folderID).select()
    .then(links => {
      response.status(200).json(links)
    })
    .catch((error) => {
      console.error(error)
    })
})

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




app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});


//
// Need to store per link:
//  Long URL - only thing we get to start
//  Short URL
//  Number of clicks
//  Date added
//  Folder


//MOCK DATA ???
// folders: [
//   {
//     hats: [
//       {
//         id: 1,
//         longURL: www.google.com,
//         shortURL: w.g.co,
//         date: 5/1/2017,
//         clicks: 6
//       },
//       {
//         id: 1,
//         longURL: www.google.com,
//         shortURL: w.g.co,
//         date: 5/1/2017,
//         clicks: 6
//       },
//       {
//         id: 1,
//         longURL: www.google.com,
//         shortURL: w.g.co,
//         date: 5/1/2017,
//         clicks: 6
//       }
//     ]
//   },
//   {
//     cats: [
//       {
//         id: 1,
//         longURL: www.google.com,
//         shortURL: w.g.co,
//         date: 5/1/2017,
//         clicks: 6
//       }
//     ]
//   },
//   {
//     pants: [
//       {
//         id: 1,
//         longURL: www.google.com,
//         shortURL: w.g.co,
//         date: 5/1/2017,
//         clicks: 6
//       },
//       {
//         id: 1,
//         longURL: www.google.com,
//         shortURL: w.g.co,
//         date: 5/1/2017,
//         clicks: 6
//       }
//     ]
//   }
// ]