// Import express Router
const budgetBalanceRouter = require('express').Router();

// Body-parsing middleware to parse the request body
const bodyParser = require('body-parser');
budgetBalanceRouter.use(bodyParser.json());

// Import the required module for creating a connection pool to a PostgreSQL database
const Pool = require('pg').Pool

// Create a connection pool instance with the given configuration options
const pool = new Pool({
  host: 'localhost',
  database: 'balance_budget',
  port: 5432,
});

// Export balanceRouter for use in other modules
module.exports = budgetBalanceRouter;

// Endpoint to handle requests for the total budget balance
budgetBalanceRouter
    .route('/')
    // Get the total budget balance
    .get((req, res) => {
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to calculate the total amount of budgets
      WITH budget_total AS (
      SELECT SUM(amount) as total_budgets
      FROM budgets),
      -- Define the subquery to calculate the total amount of expenses
      expense_total AS (
      SELECT SUM(amount) as total_expenses
      FROM expenses)
      -- Calculate the budget balance by subtracting the total expenses from the total budgets
      SELECT total_budgets - total_expenses as budget_balance
      FROM budget_total, expense_total;`, (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                res.status(500).json({
                    error: "Error fetching budget balance"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows[0]);
            }
        });
    });

// Endpoint to handle requests for the balance by year  
budgetBalanceRouter
    .route('/period/:year')
    // Get the total budget balance for a specific year
    .get((req, res) => {
        const year = parseInt(req.params.year);
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to calculate the total amount of budgets
      WITH budget_total AS (
      SELECT SUM(amount) as total_budgets
      FROM budgets
      WHERE extract(year from dt_value) = $1),
      -- Define the subquery to calculate the total amount of expenses
      expense_total AS (
      SELECT SUM(amount) as total_expenses
      FROM expenses
      WHERE extract(year from dt_value) = $1)
      -- Calculate the budget balance by subtracting the total expenses from the total budgets
      SELECT total_budgets - total_expenses as budget_balance
      FROM budget_total, expense_total;`, [year], (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                res.status(500).json({
                    error: "Error fetching budget balance"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows[0]);
            }
        });
    });
  

// Endpoint to handle requests for the total budget balance by year and month
budgetBalanceRouter
    .route('/period/:year/:month')
    // Get the total budget balance for a specific year and month
    .get((req, res) => {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to calculate the total amount of budgets
      WITH budget_total AS (
      SELECT SUM(amount) as total_budgets
      FROM budgets
      WHERE extract(year from dt_value) = $1 AND extract(month from dt_value) = $2),
      -- Define the subquery to calculate the total amount of expenses
      expense_total AS (
      SELECT SUM(amount) as total_expenses
      FROM expenses
      WHERE extract(year from dt_value) = $1 AND extract(month from dt_value) = $2)
      -- Calculate the budget balance by subtracting the total expenses from the total budgets
      SELECT total_budgets - total_expenses as budget_balance
      FROM budget_total, expense_total;`, [year, month], (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                res.status(500).json({
                    error: "Error fetching budget balance"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows[0]);
            }
        });
    });

// Endpoint to handle requests for the balance by category 
budgetBalanceRouter
    .route('/category/:category')
    // Get the total budget balance for a specific category
    .get((req, res) => {
        const category = req.params.category;
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to calculate the total amount of budgets
      WITH budget_total AS (
      SELECT SUM(amount) as total_budgets
      FROM budgets
      WHERE category = $1),
      -- Define the subquery to calculate the total amount of expenses 
      expense_total AS (
      SELECT SUM(amount) as total_expenses
      FROM expenses
      WHERE category = $1)
      -- Calculate the budget balance by subtracting the total expenses from the total budgets
      SELECT total_budgets - total_expenses as budget_balance
      FROM budget_total, expense_total;`, [category], (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                res.status(500).json({
                    error: "Error fetching budget balance"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows[0]);
            }
        });
    });


// Endpoint to handle requests for the balance by year and category 
budgetBalanceRouter
    .route('/period/:year/category/:category')
    // Get the total budget balance for a specific category and by year
    .get((req, res) => {
        const year = parseInt(req.params.year);
        const category = req.params.category;
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to calculate the total amount of budgets
      WITH budget_total AS (
      SELECT SUM(amount) as total_budgets
      FROM budgets
      WHERE extract(year from dt_value) = $1 AND category = $2),
      -- Define the subquery to calculate the total amount of expenses
      expense_total AS (
      SELECT SUM(amount) as total_expenses
      FROM expenses
      WHERE extract(year from dt_value) = $1 AND category = $2)
      -- Calculate the budget balance by subtracting the total expenses from the total budgets
      SELECT total_budgets - total_expenses as budget_balance
      FROM budget_total, expense_total;`, [year, category], (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                res.status(500).json({
                    error: "Error fetching budget balance"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows[0]);
            }
        });
    });

// Endpoint to handle requests for the balance by year and category     
budgetBalanceRouter
    .route('/period/:year/:month/:category')
    // Get the total budget balance for a specific category and by year and month
    .get((req, res) => {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        const category = req.params.category;
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to calculate the total amount of budgets
      WITH budget_total AS (
      SELECT SUM(amount) as total_budgets
      FROM budgets
      WHERE extract(year from dt_value) = $1 AND extract(month from dt_value) = $2 AND category = $3),
      -- Define the subquery to calculate the total amount of expenses
      expense_total AS (
      SELECT SUM(amount) as total_expenses
      FROM expenses
      WHERE extract(year from dt_value) = $1 AND extract(month from dt_value) = $2  AND category = $3)
      -- Calculate the budget balance by subtracting the total expenses from the total budgets
      SELECT total_budgets - total_expenses as budget_balance
      FROM budget_total, expense_total;`, [year, month, category], (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                res.status(500).json({
                    error: "Error fetching budget balance"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows[0]);
            }
        });
    });
