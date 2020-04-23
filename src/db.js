const mongoose = require('mongoose');

const db = () => {
  mongoose.connect('mongodb://localhost:27017/notesapp', { useNewUrlParser: true }).then(
    () => console.log('Mongo connected now!'),
    err => console.error(err),
  );

  return mongoose;
};

module.exports = db;
