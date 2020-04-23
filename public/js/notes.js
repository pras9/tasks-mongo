/* global document $ */

const config = {
  api_base: '/api',
  api_note_list: '/api/notes',
  api_note_create: '/api/notes',
  api_note_update: '/api/notes/',
  api_note_delete: '/api/notes/',
};

function renderNote(note) {
  return `<li>
    <div class="status-cont">
      <input type="checkbox" id="${note._id}" ${(note.done ? 'checked' : '')} title="Mark as done" class="done-check" />
      <a href="javascript: void(0);" title="Delete Note" class="delete-note"><img src="img/delete-24.ico" alt="Delete Note" /></a>
    </div>
    <a href="javascript:void(0);" class="note ${(note.done ? 'done' : '')}" data-id="${note._id}">
      <div class="note-title">${note.title}</div>
      <div class="note-description">${note.description}</div>
    </a>
  </li>`;
}

function bindEvents() {
  // on click of each note
  $('#note_list').on('click', '.note', (e) => {
    $('#note_title').val($(e.currentTarget).find('.note-title').html());
    $('#note_description').val($(e.currentTarget).find('.note-description').html());
    $('#note_done')[0].checked = $(e.currentTarget).parent().find('.status-cont input')[0].checked || false;
    $('#note_id').val($(e.currentTarget).data('id'));

    $('.note').removeClass('selected');
    $(e.currentTarget).addClass('selected');
  });

  // on click of create note
  $('.btn.create-new').on('click', () => {
    $('#note_title').val('');
    $('#note_description').val('');
    $('#note_done')[0].checked = false;
    $('#note_id').val('');
  });

  // on click of save button
  $('#save_note').on('click', () => {
    const noteid = $('#note_id').val().trim();
    if (noteid) { // when saving an existing note
      $.ajax(config.api_note_update + noteid, {
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
          title: $('#note_title').val().trim(),
          description: $('#note_description').val().trim(),
          done: $('#note_done')[0].checked || false,
        }),
      }).done((data) => {
        if (data && data.success) {
          $('input#' + noteid).parent().parent().find('.note-title').val(data.note.title);
          $('input#' + noteid).parent().parent().find('.note-description').val(data.note.description ? data.note.description : '');
          if (data.note.done) {
            $('input#' + noteid)[0].checked = true;
            $('input#' + noteid).parent().parent().find('.note')
              .addClass('done');
          } else {
            $('input#' + noteid)[0].checked = false;
            $('input#' + noteid).parent().parent().find('.note')
              .removeClass('done');
          }
        }
      });
    } else { // when submitting a new note
      $.ajax(config.api_note_create, {
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
          title: $('#note_title').val().trim(),
          description: $('#note_description').val().trim(),
          done: $('#note_done')[0].checked || false,
        }),
      }).done((data) => {
        if (data && data.success) {
          $('#note_list').prepend(renderNote({
            id: data.note.id,
            title: (data.note.title ? data.note.title : ''),
            description: (data.note.description ? data.note.description : ''),
            done: (data.note.done ? data.note.done : false),
          }));
        }
      });
    }
  });

  $('#note_list').on('click', '.done-check', (e) => {
    const noteid = $(e.currentTarget).attr('id');
    $.ajax(config.api_note_update + noteid, {
      method: 'PUT',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify({
        done: $(e.currentTarget)[0].checked || false,
      }),
    }).done((data) => {
      if (data && data.success) {
        if (data.note.done) {
          $('input#' + noteid)[0].checked = true;
          $('input#' + noteid).parent().parent().find('.note')
            .addClass('done');
        } else {
          $('input#' + noteid)[0].checked = false;
          $('input#' + noteid).parent().parent().find('.note')
            .removeClass('done');
        }
      }
    });
  });

  $('#note_list').on('click', '.delete-note', (e) => {
    const noteid = $(e.currentTarget).parent().find('input.done-check').attr('id');
    $.ajax(config.api_note_delete + noteid, {
      method: 'DELETE',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
    }).done((data) => {
      if (data && data.success) {
        $('input#' + noteid).parent().parent().remove();
      }
    });
  });
}

$(document).ready(() => {
  bindEvents();
  $.ajax(config.api_note_list, {
    method: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
  }).done((data) => {
    $('#note_list').html('');
    for (let i = 0; i < data.length; i += 1) {
      $('#note_list').append(renderNote(data[i]));
    }
    $('#note_list .note')[0].click();
  });
});
