const test = require("ava");  // Importing the AVA test library
const request = require("supertest");  // Importing the supertest library for making HTTP requests
const apiRouter = require('../../server/api.js');  // Importing the api router file for the all the routers
const express = require('express'); // Importing express

// Create an instance of the express application
const app = express();

// Use the apiRouter with the '/api' route
app.use('/', apiRouter);

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

// Test to check if the GET request to '/expenses' route returns a specific expense with the given ID
test('2.2 GET /expenses/ulid_id/:ulid_id should retrieve a specific expense with the given ID', async t => {

    // Selecting a expense ID to test with
    const expenseId = '01EXC70S4N9GC6TGYERY9BD7ZZ';
    
    // Making a GET request to the '/expenses/:id' route with the selected expense ID
    const res = await request(app).get(`/expenses/ulid_id/${expenseId}`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);

    // Print the object in the console
    t.log(res.body)
    
    // Asserting that the response body is an object and contains the selected expense ID
    t.true(typeof res.body === 'object' && res.body.ulid_id === expenseId);
});

/*
// Test to check if the POST request to '/expenses' route add a new expense in the list expenses
test('2.3 POST /expenses should add a new expense to the list', async t => {

    // Creating a new expense object to add
    const newExpense = {
        amount: '0',
        description: 'Malabar',
        budget_id: "2022-01 Monthly Food Budget",
        category: "food"       
    };

    // Making a POST request to the '/expenses' route with the new expense object
    const res = await request(app).post('/expenses').send(newExpense);

    // Asserting that the status code of the response is 201
    t.is(res.status, 201);

    // Print the object in the console
    t.log(res.body)
});
*/
/*
// Test to check if the DELETE request to '/expenses/ulid_id/:ulid_id' route delete a specific expense by ID
test('2.4 DELETE /expenses/ulid_id/:ulid_id should delete a specific expense with the given ID', async t => {

    // Selecting a expense ID to test with
    const ulid_id = '01GRXNT3KRKRG2Y0YJG5HS8TGF';
    
    // Making a DELETE request to the '/expenses/ulid_id/:ulid_id' route with the selected expense ID
    const res = await request(app).delete(`/expenses/ulid_id/${ulid_id}`);
    
    // Asserting that the status code of the response is 204
    t.is(res.status, 204);
});
*/

// Test to check if the PUT request to '/expenses/ulid_id/:ulid_id' route updates a expense in the table expenses
test('2.5 PUT /expenses/ulid_id/:ulid_id should update a expense in the list', async t => {

    // Generate a timestamp and convert it to an ISO string format
    const timestamp = Date.now();
    const isoString = new Date(timestamp).toISOString();


    // Selecting a expense ID to test with
    const ulid_id = "01GRXNJA8PNY4BHFTZZCM0N0CV";

    // Creating a new expense object to update
    const updatedExpense = {
        amount: '0',
        description: 'Carambar',
        budget_id: "2022-02 Personnal Budget",
        category: "Candy",
        dt_value: isoString            
    };
    
    // Making a PUT request to the '/expenses/ulid_id/:ulid_id' route with the updated expense object
    const res = await request(app).put(`/expenses/ulid_id/${ulid_id}`).send(updatedExpense);

    // Asserting that the status code of the response is 201
    t.is(res.status, 201);

    // Print the object in the console
    t.log(res.body)
});