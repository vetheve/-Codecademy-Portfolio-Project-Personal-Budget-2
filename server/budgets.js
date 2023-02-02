// Import express Router
const budgetsRouter = require('express').Router();

// Body-parsing middleware to parse the request body
const bodyParser = require('body-parser');
budgetsRouter.use(bodyParser.json());

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
        const allBudgets = getAllFromDatabase('budgets');
        if (allBudgets) {
            res.status(200).send(allBudgets);
        } else {
            res.status(404).send({
                error: "No budgets not found"
            });
        }
    })
    // Add a new budget to the list
    .post((req, res) => {
        const addedBudget = addBudgetToDatabase(req.body.id, req.body.category, req.body.amount);
        if (addedBudget) {
            res.status(201).send(addedBudget);
        } else {
            res.status(400).send({
                error: "Failed to add budget"
            });
        }
    });

// Endpoint to handle requests to a specific budget resource by ID
budgetsRouter
    .route('/:id')
    // Get a specific budget by ID
    .get((req, res) => {
        const getBudget = getFromDatabaseById(req.params.id)
        if (getBudget) {
            res.status(200).send(getBudget);
        } else {
            res.status(404).send({
                error: "ID: Budget not found"
            });
        }
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

  