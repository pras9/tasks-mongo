const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const notes = require('./src/routes/notes');

const app = express();
const port = process.env.PORT || 8080;
console.log(process.env.PORT);
app.use(session({
  secret: 'pras',
}));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));
app.use('/api/notes', notes);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).send('Not Found!');
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

module.exports = app;
