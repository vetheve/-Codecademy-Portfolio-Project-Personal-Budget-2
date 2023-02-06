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
    .route('/budget_id/:budget_id')
    // Get a specific budget by ID
    .get((req, res) => {
        const budget_id = req.params.budget_id
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
        // Destructure budget_id, item, and value from the request body
        const budget_id = req.params.budget_id
        const {
            item,
            value
        } = req.body;

        // Generate a timestamp and convert it to an ISO string format
        const timestamp = Date.now();
        const isoString = new Date(timestamp).toISOString();

        // Create a budget object with the provided information and default timestamp and ID values
        const element = {
            budget_id: budget_id,
            item: item,
            value: value,
            dt_update: isoString
        };

        // Execute a query to update the existing budget in the budgets table
        pool.query(`
      -- Define the subquery to update an existing record in the budgets table
      UPDATE budgets
      SET $2 = $3, dt_update = to_timestamp($4, 'YYYY-MM-DD"T"HH24:MI:SS.MS')
      WHERE budget_id = $1;
        `, [element.budget_id, element.item, element.value, element.dt_update], (err, result) => {
            // If there is an error, return a 500 status code with an error message
            if (err) {
                res.status(500).json({
                    error: "Error updating budget"
                });
            }
            // If the query is successful, return a 201 status code with a success message
            else {
                res.status(201).json({
                    message: "Budget updated successfully"
                });
            }
        });
    })
    // Delete a specific budget from the list
    .delete((req, res) => {
        const budget_id = req.params.budget_id
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to delete a specific budget resource by ID
      DELETE FROM budgets WHERE budget_id = $1;`, [budget_id], (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                res.status(500).json({
                    error: "Error deleting budget"
                });
            } else {
                // If the query was successful, return a 200 status code with a success message
                res.status(204).json({
                    message: 'Budget deleted successfully'
                });
            }
        });
    });

  