$('#add-folder-btn').on('click', function(e) {
  e.preventDefault();
  console.log('boom');
  $('#link-folder-dropdown').append(`<option value="${$('#new-folder-name').val()}">${$('#new-folder-name').val()}</option>`);
});