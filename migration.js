const MongoClient = require('mongodb')
require('dotenv').config();

let linearData =[
    {
        "name":"A",
        "description":"This is a description of A",
        "parent":""
    },
    {
        "name":"B",
        "description":"This is a description of B",
        "parent":"A"
    },
    {
        "name":"C",
        "description":"This is a description of C",
        "parent":"A"
    },
    {
        "name":"D",
        "description":"This is a description of D",
        "parent":"A"
    },
    {
        "name":"B-1",
        "description":"This is a description of B-1",
        "parent":"B"
    },
    {
        "name":"B-2",
        "description":"This is a description of B-2",
        "parent":"B"
    },
    {
        "name":"B-3",
        "description":"This is a description of B-3",
        "parent":"B"
    },
    {
        "name":"C-1",
        "description":"This is a description of C-1",
        "parent":"C"
    },
    {
        "name":"C-1-a",
        "description":"This is a description of C-1-a",
        "parent":"C-1"
    },
    {
        "name":"C-1-b",
        "description":"This is a description of C-1-b",
        "parent":"C-1"
    },
    {
        "name":"D-1",
        "description":"This is a description of D-1",
        "parent":"D"
    },
    {
        "name":"D-2",
        "description":"This is a description of D-2",
        "parent":"D"
    },
];

MongoClient.connect(process.env.CONNECTION_URL, { useUnifiedTopology: true })
    .then(client => {
        const db = client.db('data');
        const collection = db.collection('dataCollection');

        // Drop collection to support multiple runs
        return collection.drop().catch(error => {
            if (/ns not found/.test(error.message)) {
                // Ignore error thrown because of missing collection 
                return;
            }

            throw (error);
        }).then(() => {
            return collection.insertMany(linearData)
                .then(result => {
                    console.log('Data inserted to the database successfully');
                })
                .catch(error => {
                    console.log('Something went wrong');
                    console.log(error);
                })
                .then(() => client.close());
        });
    });
