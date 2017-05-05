
/////HELPERS HERE! @#$%@#$%@#$%@#$%@$%@$%@#$%@#$%@#$5
const addFolder = () => {
  const newFolderName = $('#new-folder-name').val();
  const currentOptions = $('#link-folder-dropdown').children().toArray().map(item => {
    return item.innerText
  });

  if(currentOptions.indexOf(newFolderName) < 0) {

    fetch('/api/v1/folders', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          name: $('#new-folder-name').val(),
        })
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
        $('#link-folder-dropdown').append(`<option value=${data.id}>${data.name}</option>`);
      })
    }).catch(err => console.log(err))
  } else {
    //come back to this
  }
}

const addURL = () => {
  const newURL = $('#long-url-input').val();
  const folderID = $('#link-folder-dropdown').val();
  //validation?
  return fetch('/api/v1/links', {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({
      newURL,
      folderID
    })
  }).then((response) => {
    response.json().then((json) => {
      const linkID = json[0]
    })
  })
}

const convertIdToUrl = (id) => {
  const urlBase = 'http://localhost:3000/';
  return urlBase + id.toString(32);
}

const refreshLinkDisplay = (folderID) => {
  fetch(`/api/v1/folders/${folderID}`)
    .then((response) => {
      response.json().then((json) => {
        $('.link-wrapper').empty()
        json.forEach((link) => {
          $('.link-wrapper').prepend(`
            <article class="link-card" clicks="${link.clicks}">
            <p>${link.longURL}</p>
            <a href="${convertIdToUrl(link.id)}" target="_blank">${convertIdToUrl(link.id)}</a>
            <div>
            <p>Added 5/1/2017</p>
            <p>${link.clicks} Visits</p>
            </div>
            </article>
            `)
        })
      })
    })
};

const populateFolderOptions = (options) => {
  const select = $('#link-folder-dropdown');
  options.forEach((folder) => {
    select.append(`<option value=${folder.id}>${folder.name}</option>`)
  });
}

$('#add-folder-btn').on('click', function(e) {
  e.preventDefault();
  addFolder();
});

$('#add-url').on('click', function(e) {
  const folderID = $('#link-folder-dropdown').val();
  e.preventDefault();
  addURL()
    .then(() => refreshLinkDisplay(folderID));
});

$('#link-folder-dropdown').on('change', function(e)  {
  const folderID = e.target.value
  refreshLinkDisplay(folderID);
});

$('#sort-clicks').on('click', () => {
  console.log('sorting by clicks now')
  const kids= $('.link-wrapper').children()
  $('.link-wrapper').empty()

  kids.sort((a, b) => {
    console.log($(a)[0].attributes.clicks.value, b)
    return $(a)[0].attributes.clicks.value > $(b)[0].attributes.clicks.value
  })
  // console.log(kids)


  kids.each(function () {
    console.log(this)
    $('.link-wrapper').prepend(this)
  })
})

$(document).ready(() => {
  fetch('/api/v1/folders')
    .then((response) => {
      response.json()
      .then(json => {
        populateFolderOptions(json)
      })
      .then(() => {
        refreshLinkDisplay($('#link-folder-dropdown').val())
      })
    });
});



