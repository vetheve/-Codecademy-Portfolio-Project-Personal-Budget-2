// Import express Router
const budgetBalanceRouter = require('express').Router();

// Body-parsing middleware to parse the request body
const bodyParser = require('body-parser');
budgetBalanceRouter.use(bodyParser.json());

// Import functions from db.js
const {
    getFromDatabaseByCategory,
    filterBudgetBalanceByMonth,
    filterBudgetBalanceByYear,
    calculateBudgetBalance
} = require('./db.js')

// Export balanceRouter for use in other modules
module.exports = budgetBalanceRouter;

// Endpoint to handle requests for the total budget balance
budgetBalanceRouter
  .route('/')
  // Get the total budget balance
  .get((req, res) => {
      const budgetBalance = calculateBudgetBalance();
      if (budgetBalance) {
          res.status(200).send(budgetBalance);
      } else {
          res.status(404).send({
              error: "Budget balance not found"
          });
      }
  });

  
// Endpoint to handle requests for the total budget balance by year and month
budgetBalanceRouter
  .route('/:year/:month')
  // Get the total budget balance for a specific year and month
  .get((req, res) => {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      const filteredBalance = filterBudgetBalanceByMonth(month, year)
      const budgetBalance = calculateBudgetBalance(filteredBalance);
      if (budgetBalance) {
          res.status(200).send(budgetBalance);
      } else {
          res.status(404).send({
              error: "Year and month : Budget balance not found"
          });
      }
  });

// Endpoint to handle requests for the balance by year  
budgetBalanceRouter
  .route('/:year')
  // Get the total budget balance for a specific year
  .get((req, res) => {
      const year = parseInt(req.params.year);
      const filteredBalance = filterBudgetBalanceByYear(year)
      const budgetBalance = calculateBudgetBalance(filteredBalance);
      if (budgetBalance) {
          res.status(200).send(budgetBalance);
      } else {
          res.status(404).send({
              error: "Year : budget balance not found"
          });
      }
  });

budgetBalanceRouter
  .route('/:category')
  // Get the total budget balance for a specific category
  .get((req, res) => {
      const category = req.params.category;
      const filteredBalance = getFromDatabaseByCategory(category);
      const budgetBalance = calculateBudgetBalance(filteredBalance)
      if (budgetBalance) {
          res.status(200).send();
      } else {
          res.status(404).send({
              error: 'Category : budget balance not found'
          });
      }
  });

budgetBalanceRouter
  .route('/:year/:category')
  // Get the total budget balance for a specific category and by year
  .get((req, res) => {
      const category = req.params.category;
      const year = parseInt(req.params.year);
      const filteredRecords = filterBudgetBalanceByYear(year);
      const filteredBalance = getFromDatabaseByCategory(category, filteredRecords);
      const budgetBalance = calculateBudgetBalance(filteredBalance)
      if (budgetBalance ) {
          res.status(200).send(budgetBalance);
      } else {
          res.status(404).send({
              error: 'Category and year : budget balance not found'
          });
      }
  });

  budgetBalanceRouter
  .route('/:year/:month/:category')
  // Get the total budget balance for a specific category and by year and month
  .get((req, res) => {
      const category = req.params.category;
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      const filteredRecords = filterBudgetBalanceByMonth(month, year);
      const data = getFromDatabaseByCategory(category, filteredRecords);
      if (data) {
          res.status(200).send(calculateBudgetBalance(data));
      } else {
          res.status(404).send({
              error: 'Category, year and month : budget balance not found'
          });
      }
  });
