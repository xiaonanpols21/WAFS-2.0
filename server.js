//Start-up set-up is gemaakt tijdens docent zijn workshop over ejs. Bron: https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
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

app.get('/home', async function(req, res) {
    try {
      const top3 = await fetchData();
      res.render('pages/home', {
          top3
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    }
  });

app.get('/gerechten', async function(req, res) {
  try {
    const addCountry = await fetchData();
    res.render('pages/food', {
        addCountry
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

// Fetch data Chat GPT
// Zie prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#c241f811bf5f46e5850dbfca926e628a
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

    // Get only the food from combinedData
    // Zie prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#a43f8e45789046b3bb341ba1de471d12
    const onlyFoodData = [];
    Object.keys(combinedData).forEach(item => {
        const itemData = combinedData[item];
        const itemDataArray = itemData.d;

        onlyFoodData.push(...itemDataArray);
    });

    // Convert id from string to number
    // Zie prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#a43f8e45789046b3bb341ba1de471d12
    const changeId = onlyFoodData.map(item => {
        return {
            ...item,
            id: parseInt(item.id, 10) // Parse id to number
        };
    }).sort((a, b) => a.id - b.id); // Sort, Zie prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#29c2ce5ffaf14cf3bad06a80e652691d

    // TODO: WIKI toevoegen
    // Add Country
    // Zie prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#a0daa7e8785b49b0a24cafc58861c960
    const addCountry = [];
    changeId.forEach(item => {
    if (item.Title.toLowerCase().includes("korea")) {
        addCountry.push({
        ...item,
        Country: "Korea"
        });
    } else if (item.Title.toLowerCase().includes("japan")) {
        addCountry.push({
        ...item,
        Country: "Japan"
        });
    } else if (item.Title.toLowerCase().includes("chinese")) {
        addCountry.push({
        ...item,
        Country: "China"
        });
    } else {
        addCountry.push(item);
    }
    });

    // Xiao's top 3
    const top3 = []
    addCountry.forEach(item => {
        if (item.Title.includes("Chinese Broccoli With Soy Paste")) {
            top3.push({
            ...item,
            });
        } else if (item.Title.includes("Korean Fried Chicken")) {
            top3.push({
                ...item,
            });
        } else if (item.Title.includes("Good Luck Beef and Korean Rice Cake Soup (Tteokguk)")) {
            top3.push({
                ...item,
            });
        }
    })

    console.log(top3);
    return addCountry, top3;

    } catch (error) {
        throw error;
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

// Port
app.listen(port, () => {
    console.log(`EServer is listening on port ${port}`);
});
