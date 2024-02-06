// Packages
const express = require('express');

// Site laten werken
const app = express();
const port = 3000;

// Public, View
app.use(express.static('public'))
app.set('view engine', 'ejs');

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// about page
app.get('/home', function(req, res) {
  res.render('pages/home');
});

app.listen(port, () => {
  console.log(`EServer is listening on port ${port}`);
})