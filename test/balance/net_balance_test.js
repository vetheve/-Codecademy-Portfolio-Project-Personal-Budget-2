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

/*NET BALANCE*/

// Test to check if the Get request to '/netbalance' route returns the total net balance
test('4.1 Get /netbalance should returns the total net balance', async t => {

    // Making a Get request to the '/netbalance' route which does not exist yet
    const res = await request(app).get(`/netbalance`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);
    
    // Print the object in the console
    t.log(res.body)
        
    // Asserting that the response body is an object and contains the key 'Net balance'
    t.true(typeof res.body === 'object' && 'net_balance' in res.body);
    
    // Asserting that the value of the 'Net balance' key is 5640
    t.is(res.body['net_balance'], '5640');
});