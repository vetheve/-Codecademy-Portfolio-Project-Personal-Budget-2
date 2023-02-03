// Import express Router
const budgetsRouter = require('express').Router();

// Body-parsing middleware to parse the request body
const bodyParser = require('body-parser');
budgetsRouter.use(bodyParser.json());

// Import the required module for creating a connection pool to a PostgreSQL database
const Pool = require('pg').Pool

// Create a connection pool instance with the given configuration options
const pool = new Pool({
    host: 'localhost',
    database: 'balance_budget',
    port: 5432,
  });

// Import functions from db.js
const {
    getAllFromDatabase,
    getFromDatabaseById,
    addBudgetToDatabase,
    deleteFromDatabasebyId,
    updateInstanceInDatabase
} = require('./db.js');

// Export budgetsRouter for use in other modules
module.exports = budgetsRouter;

// Endpoint to handle requests to budgets
budgetsRouter
    .route('/')
    // Endpoint to get all budgets
    .get((req, res) => {
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to get the total records of budgets
      SELECT * FROM budgets;`, (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                res.status(500).json({
                    error: "Error fetching budgets"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows);
            }
        });
    })
    // Add a new budget to the table budgets
    .post((req, res) => {
        // Destructure budget_id, category, and amount from the request body
        const {
            budget_id,
            category,
            amount
        } = req.body;

        // Generate a timestamp and convert it to an ISO string format
        const timestamp = Date.now();
        const isoString = new Date(timestamp).toISOString();

        // Create a budget object with the provided information and default timestamp and ID values
        const element = {
            budget_id: budget_id,
            dt_create: isoString,
            dt_update: isoString,
            dt_value: isoString,
            category: category,
            amount: amount
        };

        // Execute a query to insert the new budget into the budgets table
        pool.query(`
        -- Define the subquery to insert a new record into the budgets table
        INSERT INTO budgets (budget_id, dt_create, dt_update, dt_value, category, amount)
        VALUES ($1, to_timestamp($2, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), to_timestamp($3, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), to_timestamp($4, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), $5, $6);
    `, [element.budget_id, element.dt_create, element.dt_update, element.dt_value, element.category, element.amount], (err, result) => {
            // If there is an error, return a 500 status code with an error message
            if (err) {
                res.status(500).json({
                    error: "Error adding budget"
                });
            }
            // If the query is successful, return a 201 status code with a success message
            else {
                res.status(201).json({
                    message: "Budget added successfully"
                });
            }
        });
    });

// Endpoint to handle requests to a specific budget resource by ID
budgetsRouter
    .route('/:id')
    // Get a specific budget by ID
    .get((req, res) => {
        const budget_id = req.params.id
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to get a specific budget resource by ID
      SELECT * FROM budgets WHERE budget_id  = $1;`, [budget_id], (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                res.status(500).json({
                    error: "Error fetching budgets"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows[0]);
            }
        });
    })
    // Update an existing budget in the list
    .put((req, res) => {
        const updatedBudget = updateInstanceInDatabase('budgets',req.params.id, req.body.item, req.body.value);
        if (updatedBudget) {
            res.status(200).send(updatedBudget);
        } else {
            res.status(404).send({
                error: "Failed to update budget"
            });
        }
    })
    // Delete a specific budget from the list
    .delete((req, res) => {
        const deletedBudget = deleteFromDatabasebyId(req.params.id);
        if (deletedBudget) {
            res.status(204).send(deletedBudget);
        } else {
            res.status(404).send({
                error: "Failed to delete budget"
            });
        }
    });

  