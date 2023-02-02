// Import express Router
const netBalanceRouter = require('express').Router();

// Body-parsing middleware to parse the request body
const bodyParser = require('body-parser');
netBalanceRouter.use(bodyParser.json());

// Import functions from db.js
const {
    filterNetBalanceByMonth,
    filterNetBalanceByYear,
    calculateNetBalance
} = require('./db.js')

// Export balanceRouter for use in other modules
module.exports = netBalanceRouter;

// Endpoint to handle requests for the total net balance
netBalanceRouter
  .route('/')
  // Get the total net balance
  .get((req, res) => {
      const netBalance = calculateNetBalance();
      if (netBalance) {
          res.status(200).send(netBalance);
      } else {
          res.status(404).send({
              error: "Net balance not found"
          });
      }
  });
  
netBalanceRouter
  .route('/:year/:month')
  // Get the total net balance for a specific year and month
  .get((req, res) => {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      const filteredBalance = filterNetBalanceByMonth(month, year)
      const netBalance = calculateNetBalance(filteredBalance)
      if (netBalance) {
          res.status(200).send(netBalance);
      } else {
          res.status(404).send({
              error: "Year and month : Net balance not found"
          });
      }
  });

// Endpoint to handle requests for the balance by year
netBalanceRouter
    .route('/:year')
    // Get the total net balance for a specific year
    .get((req, res) => {
        const year = parseInt(req.params.year);
        const filteredBalance = filterNetBalanceByYear(year)
        const netBalance = calculateNetBalance(filteredBalance)
        if (netBalance) {
            res.status(200).send(netBalance);
        } else {
            res.status(404).send({
                error: "Year : Net balance not found"
            });
        }
    });

