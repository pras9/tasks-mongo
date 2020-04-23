
const notesModel = require('./NotesModel');

const NotesController = {
  create(req, res) {
    notesModel.create(req.body, (response) => {
      if (response) {
        res.status(201).json({ success: true, message: 'created', note: response });
      } else {
        res.status(500).json({ success: false, message: 'Some error occured!' });
      }
    });
  },
  read(req, res) {
    notesModel.read(req.params.id, (note) => {
      if (note) {
        res.status(200).json({
          success: true,
          note,
        });
      } else {
        res.status(404).json({ success: false, message: 'Not found!' });
      }
    });
  },
  update(req, res) {
    notesModel.update(req.params.id, req.body, (response) => {
      if (response) {
        res.status(200).json({
          success: true,
          note: response,
        });
      } else {
        res.status(500).json({ success: false, message: 'Some error occured!' });
      }
    });
  },
  delete(req, res) {
    notesModel.deleteNote(req.params.id, (note) => {
      if (note) {
        res.status(200).json({
          success: true,
          note,
        });
      } else {
        res.status(404).json({ success: false, message: 'Not found!' });
      }
    });
  },
  list(req, res) {
    notesModel.retrieveNotes((notes) => {
      if (notes) {
        res.status(200).json(notes);
      } else {
        res.status(500).json({ success: false, message: 'Some error occured!' });
      }
    });
  },
};

module.exports = NotesController;
