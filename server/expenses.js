// Import express Router
const expensesRouter = require('express').Router();

// Body-parsing middleware to parse the request body
const bodyParser = require('body-parser');
expensesRouter.use(bodyParser.json());

// Import the required module for creating a connection pool to a PostgreSQL database
const Pool = require('pg').Pool

// Import ULID
const ulid = require('ulid');

// Create a connection pool instance with the given configuration options
const pool = new Pool({
    host: 'localhost',
    database: 'balance_budget',
    port: 5432,
  });

// Export expensesRouter for use in other modules
module.exports = expensesRouter;

// Endpoint to handle requests for the expenses
expensesRouter
  .route('/')
    // Get all expenses
    .get((req, res) => {
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to get the total records of expenses
      SELECT * FROM expenses;`, (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                res.status(500).json({
                    error: "Error fetching expenses"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows);
            }
        });
    })
    // Add a new expense to the table expenses
    .post((req, res) => {
        // Destructure expense_id, category, and amount from the request body
        const {
        amount,
        description,
        budget_id,
        category
        } = req.body;

        // Generate a timestamp and convert it to an ISO string format
        const timestamp = Date.now();
        const isoString = new Date(timestamp).toISOString();

        // Generate a ULID
	    const ulid_id = ulid.ulid();

        // Create a expense object with the provided information and default timestamp and ID values
        const element = {
            ulid_id: ulid_id,
            dt_create: isoString,
            dt_update: isoString,
            dt_value: isoString,
            amount,
            description,
            budget_id,
            category,
        };

        // Execute a query to insert the new expense into the expenses table
        pool.query(`
        -- Define the subquery to insert a new record into the expenses table
        INSERT INTO expenses (ulid_id, dt_create, dt_update, dt_value, amount, description, budget_id, category)
        VALUES ($1, to_timestamp($2, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), to_timestamp($3, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), 
        to_timestamp($4, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), $5, $6, $7, $8);`, 
        [element.ulid_id, element.dt_create, element.dt_update, 
        element.dt_value, element.amount, element.description, 
        element.budget_id, element.category], (err, result) => {
            // If there is an error, return a 500 status code with an error message
            if (err) {
                console.error(err)
                res.status(500).json({
                    error: "Error adding expense"
                });
            }
            // If the query is successful, return a 201 status code with a success message
            else {
                res.status(201).json({
                    message: "Expense added successfully"
                });
            }
        });
    });
  
// Endpoint to handle requests to a specific expenseresource by ID
expensesRouter
    .route('/ulid_id/:ulid_id')
    // Get a specific expense by ID
    .get((req, res) => {
        const ulid_id = req.params.ulid_id
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to get a specific expense resource by ulid_id
    SELECT * FROM expenses WHERE ulid_id  = $1;`, [ulid_id], (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                console.error(err)
                res.status(500).json({
                    error: "Error fetching expenses"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows[0]);
            }
        });
    })
    // Delete a specific expense from the list
    .delete((req, res) => {
        const ulid_id = req.params.ulid_id
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to delete a specific expense resource by ID
      DELETE FROM expenses WHERE ulid_id = $1;`, [ulid_id], (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                console.log(err)
                res.status(500).json({
                    error: "Error deleting expense"
                });
            } else {
                // If the query was successful, return a 200 status code with a success message
                res.status(204).json({
                    message: 'expense deleted successfully'
                });
            }
        });
    })
    // Update an existing expense record in the expenses table 
    .put((req, res) => {
        const ulid_id = req.params.ulid_id;
        console.log(ulid_id)
        // Destructure the object sent from the request body
        const { amount, description, budget_id, category, dt_value } = req.body;

        // Generate a timestamp and convert it to an ISO string format
        const timestamp = Date.now();
        const isoString = new Date(timestamp).toISOString();

        // Execute a query to find the existing expense in the expenses table
        pool.query(`SELECT * from expenses where ulid_id = $1`, [ulid_id], (err, result) => {
            // If there is an error, return a 500 status code with an error message
            if (err) {
                console.log(err)
                res.status(500).json({
                    error: "Error finding expense"
                });
            } else if (result.rowCount > 0) {
                // Execute a query to update the existing expense in the expenses table
                pool.query(`
                    -- Define the subquery to update an existing record in the expenses table
                    UPDATE expenses
                    SET amount = $1, description = $2, dt_value = to_timestamp($3, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), 
                    dt_update = to_timestamp($4, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), budget_id = $5, category = $6
                    WHERE ulid_id = $7;
                `, [amount, description, dt_value, isoString, budget_id, category, ulid_id], (err, result) => {
                    // If there is an error, return a 500 status code with an error message
                    if (err) {
                        console.log(err)
                        res.status(500).json({
                            error: "Error updating expense"
                        });
                    }
                    // If the query is successful, return a 201 status code with a success message
                    else if (result.rowCount > 0) {
                        res.status(201).json({
                            message: "Expense updated successfully"
                        });
                    // If there is an error, return a 400 status code with an error message
                    } else {
                        console.log(err)
                        res.status(404).json({
                            error: "Expense exist but not found "
                        });
                    }
                });
            // If there is an error, return a 400 status code with an error message
            } else {
                console.log(err)
                res.status(404).json({
                    error: "Expense not found"
                });
            }
        });
    });