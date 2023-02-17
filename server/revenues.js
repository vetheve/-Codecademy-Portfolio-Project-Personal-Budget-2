// Import express Router
const revenuesRouter = require('express').Router();

// Body-parsing middleware to parse the request body
const bodyParser = require('body-parser');
revenuesRouter.use(bodyParser.json());

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

// Export revenuesRouter for use in other modules
module.exports = revenuesRouter;

// Endpoint to handle requests for the revenues
revenuesRouter
    .route('/')
    // Endpoint to get all revenues
    .get((req, res) => {
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
    -- Define the subquery to get the total records of revenues
    SELECT * FROM revenues;`, (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                console.log(err)
                res.status(500).json({
                    error: "Error fetching revenues"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows);
            }
        });
    })
    // Add a new revenue to the table revenues
    .post((req, res) => {
        // Destructure revenue_id, category, and amount from the request body
        const {
        amount,
        description,
        } = req.body;

        // Generate a timestamp and convert it to an ISO string format
        const timestamp = Date.now();
        const isoString = new Date(timestamp).toISOString();

        // Generate a ULID
        const ulid_id = ulid.ulid();

        // Create a revenue object with the provided information and default timestamp and ID values
        const element = {
            ulid_id: ulid_id,
            dt_create: isoString,
            dt_update: isoString,
            dt_value: isoString,
            amount,
            description,
        };

        // Execute a query to insert the new revenue into the revenues table
        pool.query(`
        -- Define the subquery to insert a new record into the revenues table
        INSERT INTO revenues (ulid_id, dt_create, dt_update, dt_value, amount, description)
        VALUES ($1, to_timestamp($2, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), to_timestamp($3, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), 
        to_timestamp($4, 'YYYY-MM-DD"T"HH24:MI:SS.MS'), $5, $6);`, 
        [element.ulid_id, element.dt_create, element.dt_update, 
        element.dt_value, element.amount, element.description], (err, result) => {
            // If there is an error, return a 500 status code with an error message
            if (err) {
                console.error(err)
                res.status(500).json({
                    error: "Error adding revenue"
                });
            }
            // If the query is successful, return a 201 status code with a success message
            else {
                res.status(201).json({
                    message: "Revenue added successfully"
                });
            }
        });
    });

  
// Endpoint to handle requests to a specific revenue resource by ID
revenuesRouter
    .route('/ulid_id/:ulid_id')
    // Get a specific revenue by ID
    .get((req, res) => {
        const ulid_id = req.params.ulid_id
        // Connect to the PostgreSQL database using the connection pool
        pool.query(`
      -- Define the subquery to get a specific revenue resource by ulid_id
    SELECT * FROM revenues WHERE ulid_id  = $1;`, [ulid_id], (err, result) => {
            if (err) {
                // If there was an error, return a 500 status code with an error message
                console.error(err)
                res.status(500).json({
                    error: "Error fetching revenues"
                });
            } else {
                // If the query was successful, return a 200 status code with the result
                res.status(200).json(result.rows[0]);
            }
        });
    })
    // Update an existing revenue from the list
    .put((req, res) => {
        const updatedRevenue = updateInstanceInDatabase('revenues',req.params.id, req.body.item, req.body.value);
        if (updatedRevenue) {
            res.status(200).send(updatedRevenue);
        } else {
            res.status(404).send({
                error: "Failed to update revenue"
            });
        }
    })
    // Delete a specific revenue from the list
    .delete((req, res) => {
        const deletedRevenue = deleteFromDatabasebyId(req.params.id);
        if (deletedRevenue) {
            res.status(204).send(deletedRevenue);
        } else {
            res.status(404).send({
                error: "Failed to delete revenue"
            });
        }
    });