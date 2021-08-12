const express     = require('express');
const MongoClient = require('mongodb')
require('dotenv').config();

const conversionTools = require('./convert');

const app = express();

app.use(express.static('src'));

MongoClient.connect(process.env.CONNECTION_URL, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        const db = client.db('data');
        const collection = db.collection('dataCollection');

        app.get('/data', (req, res) => {
            collection
                .find()
                .toArray()
                .then(result => {
                    /*
                     * Convert linear data to nested tree data
                     * before sending it as the response
                     **/
                    const convertedData = conversionTools.convertToTree(result);
                    conversionTools.cleanUpParentProperty(convertedData);

                    res.send(convertedData);
                })
                .catch(error => {
                    res.status(500).send('Error loading data');
                });
        })
    })

app.listen(process.env.PORT);
