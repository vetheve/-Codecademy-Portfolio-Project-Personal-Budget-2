// Import express Router
const expensesRouter = require('express').Router();

// Body-parsing middleware to parse the request body
const bodyParser = require('body-parser');
expensesRouter.use(bodyParser.json());

// Import the required module for creating a connection pool to a PostgreSQL database
const Pool = require('pg').Pool

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
    // Add a new expenses to the list
    .post((req, res) => {
        const addedExpense = addExpenseToDatabase(req.body.amount, req.body.description, req.body.budget_id, req.body.category);
        if (addedExpense) {
            res.status(201).send(addedExpense);
        } else {
            res.status(400).send({
                error: "Failed to add expense"
            });
        }
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