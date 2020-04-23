const db = require('../../db');

const mongoose = db();
const NotesSchema = new mongoose.Schema({
  title: String,
  description: String,
  done: Boolean,
  created: Number,
  updated: Number,
});

const Notes = mongoose.model('notes', NotesSchema);

function create(data, done) {
  const timestamp = parseInt(((new Date()).getTime() / 1000).toFixed(0), 10);
  if (data && data.description) {
    const note = new Notes();
    note.title = data.title ? data.title : '';
    note.description = data.description;
    note.done = data.done || false;
    note.created = timestamp;
    note.updated = timestamp;
    note.save((err) => {
      if (err) {
        done(false);
      } else {
        note.id = note._id;
        done(note);
      }
    });
  } else {
    done(false);
  }
}

function read(id, done) {
  Notes.findOne({ _id: id }, (err, response) => {
    if (err) {
      done(false);
    } else {
      response.id = response._id;
      done(response);
    }
  });
}

function update(id, data, done) {
  const note = data;
  note.updated = parseInt(((new Date()).getTime() / 1000).toFixed(0), 10);
  Notes.update({ _id: id }, { $set: note }, (err, response) => {
    if (err) {
      done(false);
    } else {
      note.id = id;
      done(note);
    }
  });
}

function deleteNote(id, done) {
  Notes.deleteOne({ _id: id }, (err, response) => {
    if (err) {
      done(false);
    } else {
      response.id = response._id;
      done(response);
    }
  });
}

function retrieveNotes(done) {
  Notes.find({}, null, { sort: { created: -1 } }, (err, response) => {
    if (err) {
      done(err);
    } else {
      done(response);
    }
  });
}

module.exports = {
  create,
  read,
  update,
  deleteNote,
  retrieveNotes,
};
