BEGIN;

-- Restore schema (CREATE TABLE statements)
\i db/backups/schema/auth_user_schema.sql
\i db/backups/schema/auth_user_userprofile_schema.sql
\i db/backups/schema/transactions_accountgroups_schema.sql
\i db/backups/schema/transactions_accounts_schema.sql
\i db/backups/schema/transactions_transactiontypes_schema.sql
\i db/backups/schema/transactions_transactioncategories_schema.sql
\i db/backups/schema/transactions_transaction_schema.sql
\i db/backups/schema/transactions_transfer_schema.sql
\i db/backups/schema/transactions_budget_schema.sql

-- Restore data (INSERT statements)
i db/backups/schema/auth_user_data.sql
\i db/backups/schema/auth_user_userprofile_data.sql
\i db/backups/data/transactions_accountgroups_data.sql
\i db/backups/data/transactions_accounts_data.sql
\i db/backups/data/transactions_transactiontypes_data.sql
\i db/backups/data/transactions_transactioncategories_data.sql
\i db/backups/data/transactions_transaction_data.sql
\i db/backups/data/transactions_transfer_data.sql
\i db/backups/data/transactions_budget_data.sql
COMMIT;


-- psql -U your_user -f create_db.sql (Run this first then second statement)
-- psql -U your_user -d your_database -f restore.sql (Execute this in psql to run this file. Only works in psql)
