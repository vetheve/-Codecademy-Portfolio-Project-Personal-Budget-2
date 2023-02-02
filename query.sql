



----------------------------------------------------------------------------------------------
--                                 CALCULATE THE BALANCE                                    --
----------------------------------------------------------------------------------------------

-- NET FINANCIAL BALANCE QUERY

-- Define the subquery to calculate the total amount of revenues
WITH revenue_total AS (
SELECT SUM(amount) as total_revenues
FROM revenues),
-- Define the subquery to calculate the total amount of expenses
expense_total AS (
SELECT SUM(amount) as total_expenses
FROM expenses)
-- Calculate the net balance by subtracting the total expenses from the total revenues
SELECT total_revenues - total_expenses as net_balance
FROM revenue_total, expense_total;

-- BUDGETED AMOUNT BALANCE

-- Define the subquery to calculate the total amount of envelops budgets
WITH budget_total AS (
SELECT SUM(amount) as total_budgets
FROM budgets),
-- Define the subquery to calculate the total amount of expenses
expense_total AS (
SELECT SUM(amount) as total_expenses
FROM expenses)
-- Calculate the budget balance by subtracting the total expenses from the total budgets
SELECT total_budgets - total_expenses as budget_balance
FROM budget_total, expense_total;

