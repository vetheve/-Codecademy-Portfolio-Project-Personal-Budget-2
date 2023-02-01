/* Method 1: update system catalog */
UPDATE pg_database SET datallowconn = 'false' WHERE datname = 'balance_budget';

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'balance_budget';

DROP DATABASE balance_budget;