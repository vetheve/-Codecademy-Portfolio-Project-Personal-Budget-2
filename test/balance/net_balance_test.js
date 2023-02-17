const test = require("ava");  // Importing the AVA test library
const request = require("supertest");  // Importing the supertest library for making HTTP requests
const apiRouter = require('../../server/api.js');  // Importing the api router file for the all the routers
const express = require('express'); // Importing express

// Create an instance of the express application
const app = express();

// Use the apiRouter with the '/api' route
app.use('/', apiRouter);

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

// Test to check if the Get request to '/netbalance/:year' route returns the total net balance by year
test('4.2 Get /netbalance/:year should returns the total net balance by year', async t => {

    // Selecting a year to test with
    const year = '2021';

    // Making a Get request to the '/netbalance/:year' route which does not exist yet
    const res = await request(app).get(`/netbalance/${year}`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);
    
    // Print the object in the console
    t.log(res.body)
        
    // Asserting that the response body is an object and contains the key 'Net balance'
    t.true(typeof res.body === 'object' && 'net_balance' in res.body);
    
    // Asserting that the value of the 'Net balance' key is 5640
    t.is(res.body['net_balance'], '5640');
});

// Test to check if the Get request to '/netbalance/:year/:month' route returns the total net balance by year and month
test('4.3 Get /netbalance/:year/:month should returns the total net balance by year', async t => {

    // Selecting a year and a month to test with
    const year = '2021';
    const month = '11';

    // Making a Get request to the '/netbalance/:year/:month' route which does not exist yet
    const res = await request(app).get(`/netbalance/${year}/${month}`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);
    
    // Print the object in the console
    t.log(res.body)
        
    // Asserting that the response body is an object and contains the key 'Net balance'
    t.true(typeof res.body === 'object' && 'net_balance' in res.body);
    
    // Asserting that the value of the 'Net balance' key is 470
    t.is(res.body['net_balance'], '470');
});