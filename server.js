// Packages
const express = require('express');

// Site laten werken
const app = express();
const port = 3000;

// Public, View
app.use(express.static('public'))
app.set('view engine', 'ejs');

// Pages
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/home', function(req, res) {
  res.render('pages/home');
});

app.get('/gerechten', function(req, res) {
  res.render('pages/food');
});

// Fetch data
const url = 'https://food-recipes-with-images.p.rapidapi.com/?q=korea';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'c20e05d39emsh51bf7509082730ep146d0cjsn622276aaec1a',
        'X-RapidAPI-Host': 'food-recipes-with-images.p.rapidapi.com'
    }
};

async function fetchData() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

fetchData();




// Port
app.listen(port, () => {
  console.log(`EServer is listening on port ${port}`);
})