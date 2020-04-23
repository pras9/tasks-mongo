const notesRouter = require('express').Router();
const notesController = require('../modules/notes/NotesController');

notesRouter.route('/:id')
  .get(notesController.read)
  .delete(notesController.delete)
  .put(notesController.update);

notesRouter.route('/')
  .get(notesController.list)
  .post(notesController.create);

module.exports = notesRouter;
