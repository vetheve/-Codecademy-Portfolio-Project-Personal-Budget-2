-- create table named "budgets"
CREATE TABLE budgets (
  -- auto-incrementing id field
  id SERIAL,
  -- unique identifier for the budget
  budget_id VARCHAR(30) PRIMARY KEY,
  -- date when the budget was created
  dt_create DATE,	
  -- date when the budget was last updated
  dt_update	DATE,
  -- date of the budget value
  dt_value	DATE,
  -- category of the budget
  category	VARCHAR(20),
  -- amount of the budget
  amount INT
);

-- create table named "expenses"
CREATE TABLE expenses (
  -- auto-incrementing id field
  id SERIAL,
  -- unique identifier for the expense
  ulid_id VARCHAR(30) PRIMARY KEY, 
  -- date when the expense was created
  dt_create DATE,	
  -- date when the expense was last updated
  dt_update	DATE,
  -- date of the expense value
  dt_value	DATE,
  -- amount of the expense
  amount INT,
  -- description of the expense
  description VARCHAR(20),
  -- foreign key referencing the budget_id of the budgets table
  budget_id VARCHAR(30),
  -- category of the expense
  category VARCHAR(20),
  FOREIGN KEY (budget_id) REFERENCES budgets(budget_id)
);

-- create table named "revenues"
CREATE TABLE revenues (
  -- auto-incrementing id field
  id SERIAL,
  -- unique identifier for the revenue
  ulid_id VARCHAR(30) PRIMARY KEY, 
  -- date when the revenue was created
  dt_create DATE,	
  -- date when the revenue was last updated
  dt_update	DATE,
  -- date of the revenue value
  dt_value	DATE,
  -- amount of the revenue
  amount INT,
  -- description of the revenue
  description VARCHAR(20)
);

-- copy data from budgets.csv file into the budgets table
COPY budgets (budget_id, dt_create, dt_update, dt_value, category, amount)
FROM './data/budgets.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ';');

-- copy data from expenses.csv file into the expenses table
COPY expenses (ulid_id, dt_create, dt_update, dt_value, amount, description, budget_id, category)
FROM './data/expenses.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ';');

-- copy data from revenues.csv file into the revenues table
COPY revenues (ulid_id, dt_create, dt_update, dt_value, amount, description)
FROM './data/revenues.csv'
WITH (FORMAT csv, HEADER true, DELIMIT ';');