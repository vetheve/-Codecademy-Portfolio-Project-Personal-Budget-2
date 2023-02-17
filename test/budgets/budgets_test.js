const test = require("ava");  // Importing the AVA test library
const request = require("supertest");  // Importing the supertest library for making HTTP requests
const apiRouter = require('../../server/api.js');  // Importing the api router file for the all the routers
const express = require('express'); // Importing express

// Create an instance of the express application
const app = express();

// Use the apiRouter with the '/api' route
app.use('/', apiRouter);

/*BUDGETS*/

// Test to check if the GET request to '/budgets' route returns an array of all budgets
test('1.1 GET /budgets should return an array of all budgets', async t => {

    // Making a GET request to the '/budgets' route
    const res = await request(app).get('/budgets');

    // Asserting that the status code of the response is 200
    t.is(res.status, 200);

    // Asserting that the response body is an array
    t.true(Array.isArray(res.body));

    // Print the array in the console
    //t.log(res.body)
});

// Test to check if the GET request to '/budgets/id/:id' route returns a specific budget by ID
test('1.2 GET /budgets/budget_id/:budget_id should retrieve a specific budget with the given ID', async t => {

    // Selecting a budget ID to test with
    const budgetId = '2022-02 Personnal Budget';
    
    // Making a GET request to the '/budgets/:id' route with the selected budget ID
    const res = await request(app).get(`/budgets/budget_id/${budgetId}`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);

    // Print the object in the console
    t.log(res.body)
    
    // Asserting that the response body is an object and contains the selected budget ID
    t.true(typeof res.body === 'object');

    // Asserting that the response body contains the selected budget ID
    t.true(res.body.budget_id === budgetId);
});
/*
// Test to check if the POST request to '/budgets' route add a new budget in the list budgets
test('1.3 POST /budgets should add a new budget to the list', async t => {
    // Selecting a budget ID to test with
    const budgetId = '2021-02 Monthly Housing Budget';


    // Creating a new budget object to add
    const newBudget = {
        budget_id: "2022-02 Personnal Budget",
        category: "personnal",
        amount: "0"
    };

    // Making a POST request to the '/budgets' route with the new budget object
    const res = await request(app).post('/budgets').send(newBudget);

    // Asserting that the status code of the response is 201
    t.is(res.status, 201);

    // Print the object in the console
    t.log(res.body)

});
*/


// Test to check if the PUT request to '/budgets/id/:id' route updates a budget in the list budgets
test('1.4.1 PUT /budgets/budget_id/:budget_id should update a budget in the list', async t => {

    // Selecting a budget ID to test with
    const budgetId = "2022-02 Personnal Budget";

    // Creating a new budget object to update
    const updatedBudget = {
        category: "Very personal",
        amount: "0",
        dt_value: "2023-02-09 07:47:53.491"
    };
    
    // Making a PUT request to the '/budgets/budget_id/:budget_id' route with the updated budget object
    const res = await request(app).put(`/budgets/budget_id/${budgetId}`).send(updatedBudget);

    // Asserting that the status code of the response is 201
    t.is(res.status, 201);

    // Print the object in the console
    t.log(res.body)
});


/*
// Test to check if the DELETE request to '/budgets' route delete a specific budget by ID
test('1.5 DELETE /budgets/budget_id/:budget_id should delete a specific budget with the given ID', async t => {

    // Selecting a budget ID to test with
    const budgetId = '2022-02 Personnal Budget';
    
    // Making a DELETE request to the '/budgets/budget_id/:budget_id' route with the selected budget ID
    const res = await request(app).delete(`/budgets/budget_id/${budgetId}`);
    
    // Asserting that the status code of the response is 204
    t.is(res.status, 204);
});*/
