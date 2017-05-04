$('#add-folder-btn').on('click', function(e) {
  e.preventDefault();

  const newFolderName = $('#new-folder-name').val()

  const currentOptions = $('#link-folder-dropdown').children().toArray().map(item => {
    return item.innerText
  })

  if(currentOptions.indexOf(newFolderName) < 0) {
    console.log('in the if');

    fetch('/api/folders', {
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
        $('#link-folder-dropdown').append(`<option>${data.folderName}</option>`);

      })
    }).catch(err => console.log(err))
  } else {
    console.log('Folder already made up yo!');
  }
});




