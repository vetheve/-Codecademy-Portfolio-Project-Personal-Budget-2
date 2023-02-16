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
    // Add a new revenues to the list
    .post((req, res) => {
        const addedRevenue = addRevenueToDatabase(req.body.amount, req.body.description);
        if (addedRevenue) {
            res.status(201).send(addedRevenue);
        } else {
            res.status(400).send({
                error: "Failed to add revenue"
            });
        }
    });
  
// Endpoint to handle requests to a specific revenue resource by ID
revenuesRouter
  .route('/:id')
    // Get a specific revenue by ID
    .get((req, res) => {
        const getRevenue = getFromDatabaseById(req.params.id)
        if (getRevenue) {
            res.status(200).send(getRevenue);
        } else {
            res.status(404).send({
                error: "ID: Revenue not found"
            });
        }
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