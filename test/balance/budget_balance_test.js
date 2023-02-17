const test = require("ava");  // Importing the AVA test library
const request = require("supertest");  // Importing the supertest library for making HTTP requests
const apiRouter = require('../../server/api.js');  // Importing the api router file for the all the routers
const express = require('express'); // Importing express

// Create an instance of the express application
const app = express();

// Use the apiRouter with the '/api' route
app.use('/', apiRouter);

/*BUDGET BALANCE*/

// Test to check if the Get request to '/budgetbalance' route returns the total budget balance
test('5.1 Get /budgetbalance should returns the total budget balance', async t => {

    // Making a Get request to the '/budgetbalance' route which does not exist yet
    const res = await request(app).get(`/budgetbalance`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);
    
    // Print the object in the console
    t.log(res.body)
        
    // Asserting that the response body is an object and contains the key 'Budget balance'
    t.true(typeof res.body === 'object' && 'budget_balance' in res.body);
    
    // Asserting that the value of the 'Budget balance' key is 4140
    t.is(res.body['budget_balance'], '4140');
});

// Test to check if the Get request to '/budgetbalance/:year' route returns the total budget balance by year
test('5.2 Get /budgetbalance/period/:year should returns the total budget balance by year', async t => {

    // Selecting a year to test with
    const year = '2021';

    // Making a Get request to the '/budgetbalance/:year' route which does not exist yet
    const res = await request(app).get(`/budgetbalance/period/${year}`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);
    
    // Print the object in the console
    t.log(res.body)
        
    // Asserting that the response body is an object and contains the key 'Budget balance'
    t.true(typeof res.body === 'object' && 'budget_balance' in res.body);
    
    // Asserting that the value of the 'Budget balance' key is 4140
    t.is(res.body['budget_balance'], '4140');
});

// Test to check if the Get request to '/budgetbalance/:year/:month' route returns the total budget balance by year and month
test('5.3 Get /budgetbalance/period/:year/:month should returns the total budget balance by year and month', async t => {

    // Selecting a year and a month to test with
    const year = '2021';
    const month = '11';

    // Making a Get request to the '/budgetbalance/:year/:month' route which does not exist yet
    const res = await request(app).get(`/budgetbalance/period/${year}/${month}`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);
    
    // Print the object in the console
    t.log(res.body)
        
    // Asserting that the response body is an object and contains the key 'Budget balance'
    t.true(typeof res.body === 'object' && 'budget_balance' in res.body);
    
    // Asserting that the value of the 'Budget balance' key is 345
    t.is(res.body['budget_balance'], '345');
});

// Test to check if the Get request to '/budgetbalance/:category' route returns the total budget balance by category
test('5.4 Get /budgetbalance/category/:category should returns the total budget balance by category', async t => {

    // Selecting an category to test with
    const category = 'housing';

    // Making a Get request to the '/budgetbalance/:category' route which does not exist yet
    const res = await request(app).get(`/budgetbalance/category/${category}`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);
    
    // Print the object in the console
    t.log(res.body)
        
    // Asserting that the response body is an object and contains the key 'Budget balance'
    t.true(typeof res.body === 'object' && 'budget_balance' in res.body);
    
    // Asserting that the value of the 'Budget balance' key is 300
    t.is(res.body['budget_balance'], '300');
});

// Test to check if the Get request to '/budgetbalance/:year/:category' route returns the total budget balance by year and by category
test('5.5 Get /budgetbalance/period/:year/category/:category should returns the total budget balance by year and by category', async t => {

    // Selecting a year to test with
    const year = '2021';

    // Selecting an category to test with
    const category = 'housing';

    // Making a Get request to the '/budgetbalance/:year' route which does not exist yet
    const res = await request(app).get(`/budgetbalance/period/${year}/category/${category}`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);
    
    // Print the object in the console
    t.log(res.body)
        
    // Asserting that the response body is an object and contains the key 'Budget balance'
    t.true(typeof res.body === 'object' && 'budget_balance' in res.body);
    
    // Asserting that the value of the 'Budget balance' key is 300
    t.is(res.body['budget_balance'], '300');
});

// Test to check if the Get request to '/budgetbalance/:year/:month/:category' route returns the total budget balance by year, month, and category
test('5.6 Get /budgetbalance/period/:year/:month/:category should returns the total budget balance by year and month', async t => {

    // Selecting a year and a month to test with
    const year = '2021';
    const month = '11';

    // Selecting an category to test with
    const category = 'housing';

    // Making a Get request to the '/budgetbalance/:year/:month' route which does not exist yet
    const res = await request(app).get(`/budgetbalance/period/${year}/${month}/${category}`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);
    
    // Print the object in the console
    t.log(res.body)
        
    // Asserting that the response body is an object and contains the key 'Budget balance'
    t.true(typeof res.body === 'object' && 'budget_balance' in res.body);
    
    // Asserting that the value of the 'Budget balance' key is 25
    t.is(res.body['budget_balance'], '25');
});