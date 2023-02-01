CREATE DATABASE Balance_budget;

\c Balance_budget

CREATE TABLE budgets (
  id SERIAL,
  budget_id VARCHAR(30) PRIMARY KEY,
  dt_create DATE,	
  dt_update	DATE,
  dt_value	DATE,
  category	VARCHAR(20),
  amount INT
);

CREATE TABLE expenses (
  id SERIAL,
  ulid_id VARCHAR(30) PRIMARY KEY, 
  dt_create DATE,	
  dt_update	DATE,
  dt_value	DATE,
  amount INT,
  description VARCHAR(20),
  budget_id VARCHAR(30),
  category VARCHAR(20),
  FOREIGN KEY (budget_id) REFERENCES budgets(budget_id)
);

CREATE TABLE revenues (
  id SERIAL,
  ulid_id VARCHAR(30) PRIMARY KEY, 
  dt_create DATE,	
  dt_update	DATE,
  dt_value	DATE,
  amount INT,
  description VARCHAR(20)
);

COPY budgets (budget_id, dt_create, dt_update, dt_value, category, amount)
FROM './data/budgets.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ';');

COPY expenses (ulid_id, dt_create, dt_update, dt_value, amount, description, budget_id, category)
FROM './data/expenses.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ';');

COPY revenues (ulid_id, dt_create, dt_update, dt_value, amount, description)
FROM './data/revenues.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ';');

