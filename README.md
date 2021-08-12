# ABN Amro Full Stack Development Challenge

This project is built using Vanilla Javascript ES6 and Node.js with Express.js. It connects to a Mongo database.

## Setup development environment

### Environment variables

The environment variables are the ones shown below and are defined in the .env file:

`PORT=8000`
`CONNECTION_URL=mongodb+srv://dbUser:test12345@cluster0.rable.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

Feel free to change the variables and use, for example, a mongo connection url of your liking, to test the functionality.

### Initiate the project

Before you can use the project, install the required dependencies by running

`npm install`

Execute the migration script and add the data to the database by running

`npm run migrate`

Run the project with 

`npm start`

You can view the page on http://localhost:8000



You can run a linter for the back-end by using 

`npm run lint`

You can run the tests for the conversion functions by using 

`npm run test` or `mocha tests/convert.js`


