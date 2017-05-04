
const addFolder = () => {
  const newFolderName = $('#new-folder-name').val()

  const currentOptions = $('#link-folder-dropdown').children().toArray().map(item => {
    return item.innerText
  })

  if(currentOptions.indexOf(newFolderName) < 0) {
    console.log('in the if');

    fetch('/api/v1/folders', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          name: $('#new-folder-name').val(),
          // folderID
        }
      )
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
        $('#link-folder-dropdown').append(`<option value=${data.id}>${data.name}</option>`);

      })
    }).catch(err => console.log(err))
  } else {
    console.log('Folder already made up yo!');
    //come back to this
  }
}

const addURL = () => {
  const newURL = $('#long-url-input').val();
  //grab option value
  const folderID = $('#link-folder-dropdown').val();
  //validation?
  console.log(newURL, folderID);
  fetch('/api/v1/links', {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({
      newURL,
      folderID
    })
  }).then((response) => {
    response.json().then((json) => {
      console.log(json[0]);
      const linkID = json[0]
    })
    ////
  })
}

/////HELPERS HERE! @#$%@#$%@#$%@#$%@$%@$%@#$%@#$%@#$5
const convertIdToUrl = (id) => {
  const urlBase = 'http://localhost:3000/'
  return urlBase + id.toString(32)
}

const refreshLinkDisplay = (folderID) => {

}

$('#add-folder-btn').on('click', function(e) {
  e.preventDefault();
  addFolder();
});

$('#add-url').on('click', function(e) {
  e.preventDefault();
  addURL();
})

$('#link-folder-dropdown').on('change', function(e)  {
  const folderID = e.target.value

  fetch('/api/v1/folders/:folderID')
    .then((response) => {
      response.json((json) => {
        console.log(json)
      })
    })
})

const populateFolderOptions = (options) => {
  console.log('in the pop', options)
  const select = $('#link-folder-dropdown')
  options.forEach((folder) => {
    select.append(`<option value=${folder.id}>${folder.name}</option>`)
  })
}

$(document).ready(() => {
  console.log('doc is read')
  fetch('/api/v1/folders')
    .then((response) => {
      console.log(response)
      response.json().then(json => {
        populateFolderOptions(json)
      })
    })
})


