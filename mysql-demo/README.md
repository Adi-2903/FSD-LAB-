# Node.js + MySQL Demonstration

This exercise demonstrates the requested Node.js/MySQL operations for the Champion Sports Academy resource library.

## Operations covered

### Requirement I

1. Create database: `createDatabase`
2. Create table: `createTable`
3. Insert a record: `insertRecord`
4. Update the record: `updateRecord`

### Requirement II

The operations below use the user-defined `runQuery(connection, sql, values)` function:

1. Delete record: `deleteRecord`
2. Select record: `selectRecord`
3. Select unique values: `selectUniqueAuthors` using `SELECT DISTINCT`
4. Drop table: `dropTable`

## Setup

1. Install and start MySQL Server.
2. Copy `.env.example` to `.env` and set the MySQL credentials.
3. Install Node dependencies:

   ```powershell
   npm install
   ```

4. Check JavaScript syntax:

   ```powershell
   npm run check
   ```

5. Run the complete demonstration:

   ```powershell
   npm run demo
   ```

The script creates the database while connected to the MySQL server, reconnects to that database, runs each operation in order, and drops the demonstration table at the end. The database itself is retained for another run.

## Verification checklist

- `1. Database ready` confirms `CREATE DATABASE IF NOT EXISTS`.
- `2. Table ready` confirms `CREATE TABLE IF NOT EXISTS`.
- `3. Inserted record` prints the generated id.
- `4. Updated record` reports the changed row count.
- `5. Deleted record` reports the deleted row count.
- `6. Selected record` prints the inserted row after its update.
- `7. Unique authors` confirms `SELECT DISTINCT`.
- `8. Dropped table` confirms `DROP TABLE IF EXISTS`.

All values supplied by the sample record and update use parameterized queries (`?` placeholders).
