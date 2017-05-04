const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Jet Fuel';

app.locals.folders = []


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
app.post('/api/folders', (request, response) => {
  const { folderName } = request.body
  // check if folder exists - no need to on server, checking locally now.
  // make new folder in DB, make new ID
  app.locals.folders.push(folderName)
  // return info if successful
  response.json({ folderName: folderName })

})

//app.post to add URL

app.post('api/folders/:folderID', (request, response) => {
  const { newURL } = request.body
  let shortURL, date, clickTotal
  //make the short guy
  response.json({ shortURL, newURL, date, clickTotal })
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