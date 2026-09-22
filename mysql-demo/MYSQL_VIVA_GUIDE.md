# Node.js + MySQL Practical Viva Guide

## Practical Explanation

This practical uses Node.js and the `mysql2` package to connect to MySQL Server and perform database operations.

The program performs these operations:

- Create a database
- Create a table
- Insert a record
- Update the record
- Delete a record
- Select a record
- Select unique authors
- Drop the table

The implementation is in `demo.js`.

## How to Run

Make sure MySQL Server is running, then run:

```powershell
cd mysql-demo
npm install
npm run check
npm run demo
```

Expected output includes:

```text
1. Database ready: csa_library
2. Table ready: library_books
3. Inserted record with id: 1
4. Updated record 1; rows changed: 1
6. Selected record: ...
7. Unique authors: [ { author: 'Arjun Mehta' } ]
5. Deleted record 1; rows changed: 1
8. Dropped table: library_books
```

The number labels identify the functions. The actual execution order is select, select unique, delete, and then drop table.

## Operation Mapping

| Requirement | Function | SQL operation |
|---|---|---|
| Create database | `createDatabase()` | `CREATE DATABASE IF NOT EXISTS` |
| Create table | `createTable()` | `CREATE TABLE IF NOT EXISTS` |
| Insert record | `insertRecord()` | `INSERT INTO` |
| Update record | `updateRecord()` | `UPDATE ... SET` |
| Delete record | `deleteRecord()` | `DELETE FROM` |
| Select record | `selectRecord()` | `SELECT * FROM ... WHERE` |
| Select unique | `selectUniqueAuthors()` | `SELECT DISTINCT author` |
| Drop table | `dropTable()` | `DROP TABLE IF EXISTS` |
| User-defined function | `runQuery()` | Executes parameterized SQL |

## User-Defined Function

```javascript
async function runQuery(connection, sql, values = []) {
    const [result] = await connection.execute(sql, values);
    return result;
}
```

This function accepts the MySQL connection, SQL query, and optional values. It executes the query and returns the result. The delete, select, unique-select, and drop-table functions use this helper.

## File Locations

- `demo.js`: Node.js implementation
- `schema.sql`: Database and table SQL structure
- `.env.example`: MySQL connection settings
- `package.json`: Node.js dependencies and run scripts
- `README.md`: Setup and verification notes

## Viva Questions and Answers

### 1. Which package did you use?

I used the `mysql2` Node.js package.

```javascript
const mysql = require('mysql2/promise');
```

It supports MySQL connections and Promise-based asynchronous operations.

### 2. Why did you use the Promise version?

It allows the use of `async` and `await`, which makes asynchronous database code easier to read.

### 3. What is the purpose of `createConnection()`?

It creates a connection between the Node.js application and MySQL Server.

### 4. Why are two connections created?

The first connection connects to MySQL Server without selecting a database so the database can be created. The second connection connects directly to the newly created database.

### 5. What does `IF NOT EXISTS` do?

It prevents an error if the database or table already exists.

### 6. What is a primary key?

The `id` column is the primary key. It uniquely identifies each table record.

```sql
id INT AUTO_INCREMENT PRIMARY KEY
```

### 7. What does `AUTO_INCREMENT` do?

It automatically generates a new numeric ID for each inserted record.

### 8. Why are question marks used in SQL queries?

Question marks are parameter placeholders. Values are supplied separately, which helps prevent SQL injection and unsafe string concatenation.

```javascript
'UPDATE library_books SET quantity = ? WHERE id = ?'
```

### 9. What does `SELECT DISTINCT` do?

It returns only unique values. In this project it returns each author only once.

```sql
SELECT DISTINCT author FROM library_books
```

### 10. What does `affectedRows` mean?

It shows how many rows were changed by an update or delete operation.

### 11. What does `insertId` mean?

It gives the automatically generated ID of the newly inserted record.

### 12. Why is `try...finally` used?

It ensures that the database connection is closed even if an error occurs.

```javascript
try {
    // database operations
} finally {
    await connection.end();
}
```

### 13. What happens if MySQL Server is not running?

The application reports a connection error such as `ECONNREFUSED`. MySQL Server must be running on the configured host and port.

### 14. Where are the connection credentials stored?

They are loaded from environment variables in `.env`:

```text
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=csa_library
```

The `.env` file is ignored by Git so credentials are not uploaded.

### 15. What is the difference between `DELETE` and `DROP TABLE`?

- `DELETE` removes records from a table.
- `DROP TABLE` removes the complete table structure and its records.

### 16. What happens after the program finishes?

The sample record is deleted and the demonstration table is dropped. The database remains available for another execution.

## Presentation Order

Show these files during the practical presentation:

1. `package.json` for the dependency and scripts
2. `.env.example` for the MySQL settings
3. `demo.js` for the Node.js functions
4. `schema.sql` for the database and table structure
5. The terminal output from `npm run demo`

## Important Project Note

The standalone MySQL practical is connected to the real MySQL Server and works end-to-end.

The admission form in the main website currently stores its data in browser `localStorage` through `js/main.js`. It has not yet been connected to the MySQL backend.
