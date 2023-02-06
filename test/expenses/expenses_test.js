const test = require("ava");  // Importing the AVA test library
const request = require("supertest");  // Importing the supertest library for making HTTP requests
const apiRouter = require('../../server/api.js');  // Importing the api router file for the all the routers
const express = require('express'); // Importing express

// Create an instance of the express application
const app = express();

// Use the apiRouter with the '/api' route
app.use('/', apiRouter);

// Import functions from db.js
const {
    getFromDatabaseByItem
} = require('../../server/db.js');

/*EXPENSES*/

// Test to check if the GET request to '/expenses' route returns an array of all expenses
test('2.1 GET /expenses should return an array of all expenses', async t => {

    // Making a GET request to the '/budgets' route
    const res = await request(app).get('/expenses');

    // Asserting that the status code of the response is 200
    t.is(res.status, 200);

    // Asserting that the response body is an array
    t.true(Array.isArray(res.body));
    
    // Print the array in the console
    //t.log(res.body)
});

