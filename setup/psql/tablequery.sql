-- create table named "budgets"
CREATE TABLE budgets (
  -- auto-incrementing id field
  id SERIAL,
  -- unique identifier for the budget
  budget_id VARCHAR(40) PRIMARY KEY,
  -- date when the budget was created
  dt_create VARCHAR(40),	
  -- date when the budget was last updated
  dt_update	VARCHAR(40),
  -- date of the budget value
  dt_value	VARCHAR(40),
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
  dt_create VARCHAR(40),	
  -- date when the expense was last updated
  dt_update	VARCHAR(40),
  -- date of the expense value
  dt_value	VARCHAR(40),
  -- amount of the expense
  amount INT,
  -- description of the expense
  description VARCHAR(50),
  -- foreign key referencing the budget_id of the budgets table
  budget_id VARCHAR(40),
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
  dt_create VARCHAR(40),	
  -- date when the revenue was last updated
  dt_update	VARCHAR(40),
  -- date of the revenue value
  dt_value	VARCHAR(40),
  -- amount of the revenue
  amount INT,
  -- description of the revenue
  description VARCHAR(20)
);

-- copy data from budgets.csv file into the budgets table
COPY budgets (budget_id, dt_create, dt_update, dt_value, category, amount)
FROM '/workspace/-Codecademy-Portfolio-Project-Personal-Budget-2/setup/psql/budgets.csv'
WITH (FORMAT CSV, HEADER true, DELIMITER ';');

-- copy data from expenses.csv file into the expenses table
COPY expenses (ulid_id, dt_create, dt_update, dt_value, amount, description, budget_id, category)
FROM '/workspace/-Codecademy-Portfolio-Project-Personal-Budget-2/setup/psql/expenses.csv'
WITH (FORMAT CSV, HEADER true, DELIMITER ';');

-- copy data from revenues.csv file into the revenues table
COPY revenues (ulid_id, dt_create, dt_update, dt_value, amount, description)
FROM '/workspace/-Codecademy-Portfolio-Project-Personal-Budget-2/setup/psql/revenues.csv'
WITH (FORMAT CSV, HEADER true, DELIMITER ';');

-- Use the to_timestamp function to convert the values in the columns dt_value, dt_update, and dt_create to the timestamp type
UPDATE budgets
SET dt_value = to_timestamp(dt_value, 'YYYY-MM-DD"T"HH24:MI:SS.MS'),
    dt_update = to_timestamp(dt_update, 'YYYY-MM-DD"T"HH24:MI:SS.MS'),
    dt_create = to_timestamp(dt_create, 'YYYY-MM-DD"T"HH24:MI:SS.MS');

-- Alter the data type of the columns to timestamp
ALTER TABLE budgets ALTER COLUMN dt_value TYPE timestamp using dt_value::timestamp;
ALTER TABLE budgets ALTER COLUMN dt_update TYPE timestamp using dt_update::timestamp;
ALTER TABLE budgets ALTER COLUMN dt_create TYPE timestamp using dt_create::timestamp;

-- Use the to_timestamp function to convert the values in the columns dt_value, dt_update, and dt_create to the timestamp type
UPDATE expenses
SET dt_value = to_timestamp(dt_value, 'YYYY-MM-DD"T"HH24:MI:SS.MS'),
    dt_update = to_timestamp(dt_update, 'YYYY-MM-DD"T"HH24:MI:SS.MS'),
    dt_create = to_timestamp(dt_create, 'YYYY-MM-DD"T"HH24:MI:SS.MS');

-- Alter the data type of the columns to timestamp
ALTER TABLE expenses ALTER COLUMN dt_value TYPE timestamp using dt_value::timestamp;
ALTER TABLE expenses ALTER COLUMN dt_update TYPE timestamp using dt_update::timestamp;
ALTER TABLE expenses ALTER COLUMN dt_create TYPE timestamp using dt_create::timestamp;

-- Use the to_timestamp function to convert the values in the columns dt_value, dt_update, and dt_create to the timestamp type
UPDATE revenues
SET dt_value = to_timestamp(dt_value, 'YYYY-MM-DD"T"HH24:MI:SS.MS'),
    dt_update = to_timestamp(dt_update, 'YYYY-MM-DD"T"HH24:MI:SS.MS'),
    dt_create = to_timestamp(dt_create, 'YYYY-MM-DD"T"HH24:MI:SS.MS');

-- Alter the data type of the columns to timestamp
ALTER TABLE revenues ALTER COLUMN dt_value TYPE timestamp using dt_value::timestamp;
ALTER TABLE revenues ALTER COLUMN dt_update TYPE timestamp using dt_update::timestamp;
ALTER TABLE revenues ALTER COLUMN dt_create TYPE timestamp using dt_create::timestamp;