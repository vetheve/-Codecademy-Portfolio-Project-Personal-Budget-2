const fs = require('fs'); // Importing the fs library
const jsonData = JSON.parse(fs.readFileSync('./server/data.json', 'utf8')); // Read the data from the file and parse it as JSON

/*GET AND FILTERING FUNCTIONS*/

// Function to retrieve all data from the JSON database 
const getAllFromDatabase = (key) => {
    try {
      // Check if the data is empty
      if (!jsonData) {
        return null;
      }
      // Return the data for the specified key
      return jsonData[key];
    } catch (err) {
      // Log the error message to the console
      console.error(err);
      // Return null if there is an error
      return null;
    }
  };

// Function to retrieve a specific data by id from the JSON database 
const getFromDatabaseById = (id, data = jsonData) => {
    try {
        // Initialize object variable to null
        let element = null;

        // Iterate over keys of data object
        Object.keys(data).some(key => {
            // Find object with matching id
            element = data[key].find(item => {
                return item.id === id;
            });

            // Return true if object is found
            return element !== undefined;
        });

        // Return the object or null if not found
        return element;
    } catch (error) {
        // Log any errors to the console
        console.log(error);
        // Return null if there is an error
        return null;
    }
};


// Function to retrieve a specific data from the JSON database 
const getFromDatabaseByItem = (key, item, value, data = jsonData) => {
    try {
        // Check if the data for the specified key is empty
        if (!data[key]) {
            return null;
        }
        // Search for the object with the specified ID and return it
        return data[key].find(element => element[item] === value);
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
        // Return null if there is an error
        return null;
    }
};

//This function filters records from the database by category
const getFromDatabaseByCategory = (value, data = jsonData) => {
    try {
        // Filter the budgets array by the specified category
        const budgets = data.budgets.filter(budget => budget['category'] === value);
        // Filter the expenses array by the specified category
        const expenses = data.expenses.filter(expense => expense['category'] === value);
        // Create an object with the filtered budgets and expenses
        const result = {
            budgets: budgets,
            expenses: expenses
        }
        // Return the result
        return result;
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
        // Return null if there is an error
        return null;
    }
};

//This function filters revenues & expenses records from the database by month and year
const filterNetBalanceByMonth = (month, year, data = jsonData) => {
    try {
        // Filter the budgets array by the provided month and year
        const revenues = data.revenues.filter(revenue => {
              let dateObject = new Date(revenue.dt_value);
              return dateObject.getMonth() + 1 === month && dateObject.getFullYear() === year;
          });
        // Filter the expenses array by the provided month and year
        const expenses = data.expenses.filter(expense => {
              let dateObject = new Date(expense.dt_value);
              return dateObject.getMonth() + 1 === month && dateObject.getFullYear() === year;
          });
        // Create an object with the filtered budgets and expenses
        const result = {
            revenues: revenues,
            expenses: expenses
        }
        // Return the result
        return result;
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
        // Return null if there is an error
        return null;
    }
};

//This function filters revenues & expenses records from the database by  year
const filterNetBalanceByYear = (year, data = jsonData) => {
    try {
        // Filter the budgets array by the provided year
        const revenues = data.revenues.filter(revenue => {
              let dateObject = new Date(revenue.dt_value);
              return dateObject.getFullYear() === year;
          });
        // Filter the expenses array by the provided year
        const expenses = data.expenses.filter(expense => {
              let dateObject = new Date(expense.dt_value);
              return dateObject.getFullYear() === year;
          });
        // Create an object with the filtered budgets and expenses
        const result = {
            revenues: revenues,
            expenses: expenses
        }
        // Return the result
        return result;
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
        // Return null if there is an error
        return null;
    }
};


//This function filters budgets & expenses records from the database by month and year
const filterBudgetBalanceByMonth = (month, year, data = jsonData) => {
    try {
        // Filter the budgets array by the provided month and year
        const budgets = data.budgets.filter(budget => {
              let dateObject = new Date(budget.dt_value);
              return dateObject.getMonth() + 1 === month && dateObject.getFullYear() === year;
          });
        // Filter the expenses array by the provided month and year
        const expenses = data.expenses.filter(expense => {
              let dateObject = new Date(expense.dt_value);
              return dateObject.getMonth() + 1 === month && dateObject.getFullYear() === year;
          });
        // Create an object with the filtered budgets and expenses
        const result = {
            budgets: budgets,
            expenses: expenses
        }
        // Return the result
        return result;
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
        // Return null if there is an error
        return null;
    }
};

//This function filters budgets & expenses records from the database by year
const filterBudgetBalanceByYear = (year, data = jsonData) => {
    try {
        // Filter the budgets array by the provided year
        const budgets = data.budgets.filter(budget => {
              let dateObject = new Date(budget.dt_value);
              return dateObject.getFullYear() === year;
          });
        // Filter the expenses array by the provided year
        const expenses = data.expenses.filter(expense => {
              let dateObject = new Date(expense.dt_value);
              return dateObject.getFullYear() === year;
          });
        // Create an object with the filtered budgets and expenses
        const result = {
            budgets: budgets,
            expenses: expenses
        }
        // Return the result
        return result;
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
        // Return null if there is an error
        return null;
    }
};

/*========================================================================================*/

/*POST FUNCTIONS*/

// This function pushes a new budget object in the jsonData
const addBudgetToDatabase = (id, category, amount, data = jsonData) => {
    try {
        // Generates timestamp and converts it to ISO string format
        const timestamp = Date.now();
        const isoString = new Date(timestamp).toISOString();

        // Creates budget object with provided information and default timestamp and ID values
        const element = {
            id: id,
            dt_create: isoString,
            dt_update: isoString,
            dt_value: isoString,
            category: category,
            amount: amount
        };

        // Pushes the budget object to the jsonData
        data['budgets'].push(element);
        fs.writeFileSync('./server/data.json', JSON.stringify(data));
        return element;
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
    }
};

// This function pushes a new expense object in the jsonData
const addExpenseToDatabase = (amount, description, budget_id, category, data = jsonData) => {
    try {
        // Generates timestamp and converts it to ISO string format
        const timestamp = Date.now();
        const isoString = new Date(timestamp).toISOString();

        // Generates unique ID for the expenses object
        const newId = generateULID();

        // Creates  expense object with provided information and default timestamp and ID values
        const element = {
            id: newId,
            dt_create: isoString,
            dt_update: isoString,
            dt_value: isoString,
            amount: amount,
            description: description,
            budget_id: budget_id,
            category: category
        };

        // Pushes the expenses object to the jsonData
        data['expenses'].push(element);
        fs.writeFileSync('./server/data.json', JSON.stringify(data));
        return element;
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
    }
};

// This function pushes a new revenue object in the jsonData
const addRevenueToDatabase = (amount, description, data = jsonData) => {
    try {
        // Generates timestamp and converts it to ISO string format
        const timestamp = Date.now();
        const isoString = new Date(timestamp).toISOString();

        // Generates unique ID for the revenue object
        const newId = generateULID();

        // Creates revenue object with provided information and default timestamp and ID values
        const element = {
            id: newId,
            dt_create: isoString,
            dt_update: isoString,
            dt_value: isoString,
            amount: amount,
            description: description
        };

        // Pushes the revenue object to the specified key in the jsonData object
        data['revenues'].push(element);
        fs.writeFileSync('./server/data.json', JSON.stringify(data));
        return element;
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
    }
};

/*========================================================================================*/

/*DELETE FUNCTION*/

// This function delete a specific object in the jsonData
const deleteFromDatabasebyId = (id, data = jsonData) => {
    try {
        // Search for the object with the specified ID across all keys
        for (let key in data) {
            data[key] = data[key].filter(element => {
                //filter out the element with the specified id
                return element.id !== id;
            });
        }
        fs.writeFileSync('./server/data.json', JSON.stringify(data));
        return data;
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
    }
};

/*========================================================================================*/

/*PUT FUNCTION*/

// This function update a specific object in the jsonData
const updateInstanceInDatabase = (key, id, item, value, data = jsonData) => {
    try {
        // Generates timestamp and converts it to ISO string format
        const timestamp = Date.now();
        const isoString = new Date(timestamp).toISOString();

        // Find the object that matches the provided id
        const element = data[key].find(element => element.id === id);

        // If the object is not found, throw an error
        if (!element) {
            throw new Error("Instance not found");
        }

        // Update the key value and dt_update properties
        element[item] = value;
        element.dt_update = isoString;
        console.log("Successfully Updated");

        // write the updated data to the file
        fs.writeFileSync('./server/data.json', JSON.stringify(data));
        return element
    } catch (error) {
        // Log any errors that occur
        console.log(error);
    }
};

/*========================================================================================*/

/*CALCULATING FUNCTIONS*/

// Function to calculate the total of any array passed as a parameter
const calculateTotal = (arr) => {
    // Use reduce method to iterate over the array and sum up the amounts
    return arr.reduce((acc, curr) => {
        // Add the current amount to the accumulator
        return acc + parseFloat(curr.amount)
    }, 0);
}

// Function to calculate the "Net Financial Balance" by calling the helper function 'calculateTotal'
const calculateNetBalance = (data = jsonData) => {
    try {
        // Calculate the total revenues by passing the revenues array to the helper function
        const totalRevenues = calculateTotal(data.revenues);
        // Calculate the total expenses by passing the expenses array to the helper function
        const totalExpenses = calculateTotal(data.expenses);
        // Calculate the "Net Financial Balance" by subtracting the total expenses from the total revenues
        const netBalance = totalRevenues - totalExpenses;
        // Return the Net Balance
        return {"Net balance" : netBalance};
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
        // Return null if there is an error
        return null;
    }
};

// Function to calculate the "Budgeted Amount Balance" by calling the helper function 'calculateTotal'
const calculateBudgetBalance = (data = jsonData) => {
    try {
        // Calculate the total budgets by passing the revenues array to the helper function
        const totalBudgets = calculateTotal(data.budgets);
        // Calculate the total expenses by passing the expenses array to the helper function
        const totalExpenses = calculateTotal(data.expenses);
        // Calculate the "Budgeted Amount Balance" by subtracting the total expenses from the total budgets
        const budgetBalance = totalBudgets - totalExpenses;
        // Return the Budget Balance
        return {"Budget balance" : budgetBalance};
    } catch (err) {
        // Log any errors that occur
        console.error(err.message);
        // Return null if there is an error
        return null;
    }
};

/*========================================================================================*/

/*ULID FUNCTION*/

// This code imports the ULID library, which is used to generate unique, lexicographically sortable identifiers.
const ulid = require('ulid');

// This function uses the ulid library to generate a new ULID and returns it.
function generateULID() {
    return ulid.ulid();
}

/*========================================================================================*/

/* MODULE EXPORTS*/

 
module.exports = {
    getAllFromDatabase,
    getFromDatabaseById,
    getFromDatabaseByItem,
    getFromDatabaseByCategory,
    filterNetBalanceByMonth,
    filterNetBalanceByYear,
    filterBudgetBalanceByMonth,
    filterBudgetBalanceByYear,
    addBudgetToDatabase,
    addExpenseToDatabase,
    addRevenueToDatabase,
    deleteFromDatabasebyId,
    updateInstanceInDatabase,
    calculateNetBalance,
    calculateBudgetBalance,
    generateULID
  };