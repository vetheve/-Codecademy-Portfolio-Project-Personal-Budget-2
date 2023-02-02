// Import express Router
const revenuesRouter = require('express').Router();

// Body-parsing middleware to parse the request body
const bodyParser = require('body-parser');
revenuesRouter.use(bodyParser.json());

// Import functions from db.js
const {
    getAllFromDatabase,
    getFromDatabaseById,
    addRevenueToDatabase,
    deleteFromDatabasebyId,
    updateInstanceInDatabase
} = require('./db.js')

// Export revenuesRouter for use in other modules
module.exports = revenuesRouter;

// Endpoint to handle requests for the revenues
revenuesRouter
  .route('/')
    // Get all revenues
    .get((req, res) => {
        const allRevenues = getAllFromDatabase('revenues');
        if (allRevenues) {
            res.status(200).send(allRevenues);
        } else {
            res.status(404).send({
                error: "No revenues found"
            });
        }
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