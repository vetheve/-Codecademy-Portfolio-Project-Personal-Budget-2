// Import express Router
const netBalanceRouter = require('express').Router();

// Body-parsing middleware to parse the request body
const bodyParser = require('body-parser');
netBalanceRouter.use(bodyParser.json());

// Import the required module for creating a connection pool to a PostgreSQL database
const Pool = require('pg').Pool

// Create a connection pool instance with the given configuration options
const pool = new Pool({
  host: 'localhost',
  database: 'balance_budget',
  port: 5432,
});

// Export balanceRouter for use in other modules
module.exports = netBalanceRouter;

// Endpoint to handle requests for the total net balance
netBalanceRouter
    .route('/')
    // Get the total net balance
    .get((req, res) => {
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
    -- Define the subquery to calculate the total amount of revenues
    WITH revenue_total AS (
    SELECT SUM(amount) as total_revenues
    FROM revenues),
    -- Define the subquery to calculate the total amount of expenses
    expense_total AS (
    SELECT SUM(amount) as total_expenses
    FROM expenses)
    -- Calculate the net balance by subtracting the total expenses from the total revenues
    SELECT total_revenues - total_expenses as net_balance
    FROM revenue_total, expense_total;`, (err, result) => {
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
netBalanceRouter
    .route('/:year')
    // Get the total net balance for a specific year
    .get((req, res) => {
        const year = parseInt(req.params.year);
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
    -- Define the subquery to calculate the total amount of revenues
    WITH revenue_total AS (
    SELECT SUM(amount) as total_revenues
    FROM revenues
    WHERE extract(year from dt_value) = $1),
    -- Define the subquery to calculate the total amount of expenses
    expense_total AS (
    SELECT SUM(amount) as total_expenses
    FROM expenses
    WHERE extract(year from dt_value) = $1)
    -- Calculate the net balance by subtracting the total expenses from the total revenues
    SELECT total_revenues - total_expenses as net_balance
    FROM revenue_total, expense_total;`, [year], (err, result) => {
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

// Endpoint to handle requests for the balance by year and month    
netBalanceRouter
    .route('/:year/:month')
    // Get the total net balance for a specific year and month
    .get((req, res) => {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
    -- Define the subquery to calculate the total amount of revenues
    WITH revenue_total AS (
    SELECT SUM(amount) as total_revenues
    FROM revenues
    WHERE extract(year from dt_value) = $1 AND extract(month from dt_value) = $2),
    -- Define the subquery to calculate the total amount of expenses
    expense_total AS (
    SELECT SUM(amount) as total_expenses
    FROM expenses
    WHERE extract(year from dt_value) = $1 AND extract(month from dt_value) = $2)
    -- Calculate the net balance by subtracting the total expenses from the total revenues
    SELECT total_revenues - total_expenses as net_balance
    FROM revenue_total, expense_total;`, [year,month], (err, result) => {
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