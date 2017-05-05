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
        $('#link-folder-dropdown').append(`<option value=${data.id}>${data.name}</option>`);
      })
    }).catch(err => console.log(err))
  }
}

const addURL = () => {
  const newURL = $('#long-url-input').val();
  const folderID = $('#link-folder-dropdown').val();
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
  return '/' + id.toString(32);
}

const splitDate = (date) => {
  let dateArray = date.split('T');
  let dateBreakdown = dateArray[0].split('-');

  let year = dateBreakdown.shift();
  dateBreakdown.push(year);
  let dateString = dateBreakdown.join('/');
  return dateString;
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
            <a href="${convertIdToUrl(link.id)}" target="_blank">${window.location.hostname + convertIdToUrl(link.id)}</a>
            <div>
            <p class="date-added">Added ${splitDate(link.created_at)}</p>
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
  const kids= $('.link-wrapper').children()
  $('.link-wrapper').empty()

  kids.sort((a, b) => {
    return $(a)[0].attributes.clicks.value > $(b)[0].attributes.clicks.value
  })

  kids.each(function () {
    $('.link-wrapper').prepend(this)
  })
})

$('#sort-date').on('click', () => {
  const kids= $('.link-wrapper').children()
  $('.link-wrapper').empty()

  kids.sort((a, b) => {
    const aDateArray = $(a).find('.date-added').text().split(' ')[1].split('/')
    const bDateArray = $(b).find('.date-added').text().split(' ')[1].split('/')
    if(aDateArray[2] > bDateArray[2]) {
      return true
    }

    if(aDateArray[0] > bDateArray[0]) {
      return true
    }

    if(aDateArray[1] > bDateArray[1]) {
      return true
    }
    return false
  })

  kids.each(function () {
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



