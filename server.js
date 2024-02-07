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
const fs = require('fs');
const path = require('path');

async function fetchData() {
  try {
    const koreaData = await readFile('./public/data/korea.json');
    const chinaData = await readFile('./public/data/china.json');
    const japanData = await readFile('./public/data/japan.json');

    // Combine the data from all JSON files into a single array or object
    const combinedData = {
        korea: JSON.parse(koreaData),
        china: JSON.parse(chinaData),
        japan: JSON.parse(japanData)
    };
    console.log(combinedData);
    
  } catch (error) {
        console.error(error);
  }
}

async function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

fetchData();





// Port
app.listen(port, () => {
  console.log(`EServer is listening on port ${port}`);
})