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
    .route('/:id')
    // Get a specific expenseby ID
    .get((req, res) => {
        const getExpense = getFromDatabaseById(req.params.id)
        if (getExpense) {
            res.status(200).send(getExpense);
        } else {
            res.status(404).send({
                error: "ID: Expense not found"
            });
        }
    })
    // Update an existing expense in the list
    .put((req, res) => {
        const updatedExpense = updateInstanceInDatabase('expenses',req.params.id, req.body.item, req.body.value);
        if (updatedExpense) {
            res.status(200).send(updatedExpense);
        } else {
            res.status(404).send({
                error: "Failed to update expense"
            });
        }
    })
    // Delete a specific expense from the list
    .delete((req, res) => {
        const deletedExpense = deleteFromDatabasebyId('expenses',req.params.id);
        if (deletedBudget) {
            res.status(204).send(deletedExpense);
        } else {
            res.status(404).send({
                error: "Failed to delete expense"
            });
        }
    });