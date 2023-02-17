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

/*REVENUES*/

// Test to check if the GET request to '/revenues' route returns an array of all revenues
test('3.1 GET /revenues should return an array of all revenues', async t => {

    // Making a GET request to the '/budgets' route
    const res = await request(app).get('/revenues');

    // Asserting that the status code of the response is 200
    t.is(res.status, 200);

    // Asserting that the response body is an array
    t.true(Array.isArray(res.body));

    // Print the array in the console
    //t.log(res.body)
});

// Test to check if the GET request to '/revenues/ulid_id/:ulid_id' route returns a specific revenue with the given ID
test('3.2 GET /revenues/ulid_id/:ulid_id should retrieve a specific budget with the given ID', async t => {

    // Selecting a revenues ID to test with
    const revenuesId = '01EXBDPV5NM0W5RSMG31WMQM6B';
    
    // Making a GET request to the '/revenues/:id' route with the selected revenue ID
    const res = await request(app).get(`/revenues/ulid_id/${revenuesId}`);
    
    // Asserting that the status code of the response is 200
    t.is(res.status, 200);
    
    // Print the object in the console
    t.log(res.body)
        
    // Asserting that the response contains the selected revenue ID
    t.true(res.body.ulid_id === revenuesId);
    
    // Asserting that the response body is an object
    t.true(typeof res.body === 'object');
});

// Test to check if the DELETE request to '/revenues/ulid_id/:ulid_id' route delete a specific revenue by ID
test('2.4 DELETE /revenues/ulid_id/:ulid_id should delete a specific revenue with the given ID', async t => {

    // Selecting a revenue ID to test with
    const ulid_id = '01GSF2QXTK9RX0C130Q92PFNZC';
    
    // Making a DELETE request to the '/revenues/ulid_id/:ulid_id' route with the selected revenue ID
    const res = await request(app).delete(`/revenues/ulid_id/${ulid_id}`);
    
    // Asserting that the status code of the response is 204
    t.is(res.status, 204);
});

/*
// Test to check if the POST request to '/revenues' route add a new revenue in the list revenues
test('3.3 POST /revenues should add a new revenue to the list', async t => {

    // Creating a new revenue object to add
    const newRevenue = {
        amount: '0',
        description: 'Salary for January 2022'
    };

    // Making a POST request to the '/revenues' route with the new revenue object
    const res = await request(app).post('/revenues').send(newRevenue);

    // Asserting that the status code of the response is 201
    t.is(res.status, 201);

    // Print the object in the console
    t.log(res.body)
});
*/