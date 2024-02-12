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
app.get('/', async function(req, res) {
    try {
        const data = await getData();
        console.log(data)

        res.render('pages/index', {
            data: data 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});


app.get('/home', async function(req, res) {
    try {
      const {top3} = await fetchData();
      res.render('pages/home', {
          top3
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    }
});

// Filteren op Country met URL
// Zie prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#b44bf72ac5ed4c23bbce69e9ec82b7e5
app.get('/gerechten', async function(req, res) {
    try {
        const { country } = req.query; 
        let filteredData;

        if (country) {
            const { addSlug } = await fetchData();
            filteredData = addSlug.filter(item => item.Country === country);
        } else {
            const { addSlug } = await fetchData(); // Corrected destructuring
            filteredData = addSlug;
        }

        res.render('pages/food', {
            addSlug: filteredData,

            // Change title based on URL
            // Zie prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#0f8df4dca8234cc0a8f2726e5a8a2b19
            country: country
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

// Food single page
// Zie prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#1873125a962f4929a57c672bcf28ae4c
app.get('/gerechten/:slug', async function(req, res) {
    try {
        const data = await fetchData();
        const { addSlug } = data;
        const item = addSlug.find(item => item.Slug === req.params.slug);

        if (!item) {
            res.status(404).send('Item not found');
            return;
        }

        // Next 3 related items
        // Zie prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#561c4d97b2094d24beb69199d4edb32d
        const index = addSlug.findIndex(item => item.Slug === req.params.slug);
        const related = addSlug.slice(index + 1, index + 4);

        res.render('pages/single', {
            addSlug: item,
            related: related
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

// 404
app.use( async (req, res) => {
    console.error("Error 404: page nog found");
    res.status(404).render("pages/404");
});

// Get personal data
// Zie prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#7d68ee3f70f14a959a906a5d5bd918e0
async function getData() {
    try {
        const data = await readFile('./info.json');
        return JSON.parse(data); // Parse the JSON data and return it
    } catch (error) {
        throw error;
    }
}

// Fetch data 3 URLS
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
        const onlyFoodData = [];
        Object.keys(combinedData).forEach(item => {
            const itemData = combinedData[item];
            const itemDataArray = itemData.d;
            onlyFoodData.push(...itemDataArray);
        });

        // Convert id from string to number
        const changeId = onlyFoodData.map(item => {
            return {
                ...item,
                id: parseInt(item.id, 10) // Parse id to number
            };
        }).sort((a, b) => a.id - b.id); // Sort by id

        // Add Country information
        const addCountry = changeId.map(item => {
            let country;
            if (item.Title.toLowerCase().includes("korea")) {
                country = "Korea";
            } else if (item.Title.toLowerCase().includes("japan")) {
                country = "Japan";
            } else if (item.Title.toLowerCase().includes("chinese")) {
                country = "China";
            }
            return {
                ...item,
                Country: country
            };
        });

        // Add slug
        // Bron: https://www.geeksforgeeks.org/how-to-convert-title-to-url-slug-using-javascript/
        // Zie Prompts: https://chemical-bunny-323.notion.site/Chat-GPT-Documentatie-d93ea570990b4754bec559e9bfcc2217#3cadcb64c52840ebbefb621688ca2426
        const addSlug = addCountry.map(item => {
            let slug;
            slug = item.Title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''); // Assign the modified string to slug
        
            return {
                ...item,
                Slug: slug
            }
        });

        // Filter top 3 items
        const top3 = addSlug.filter(item => {
            return (
                item.Title.includes("Chinese Broccoli With Soy Paste") ||
                item.Title.includes("Korean Fried Chicken") ||
                item.Title.includes("Good Luck Beef and Korean Rice Cake Soup (Tteokguk)")
            );
        });

        return { addSlug: addSlug, top3: top3 }; 
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


