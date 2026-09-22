# Node.js + MySQL Practical Viva Guide

## What This Project Is

This is a Champion Sports Academy website connected to a real MySQL Server through Node.js and Express.

The main website is served by `server.js`. The database logic is in `db.js`. The complete practical operations are demonstrated in `mysql-practical.js`.

## How To Start The Connected Website

Make sure MySQL Server is running, then run these commands from the project root:

```powershell
npm install
npm run check
npm start
```

Open:

```text
http://localhost:3000
```

Check the database connection:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

The server automatically creates the `csa_library` database and the `admissions` table.

## How To Run The Full Practical

From the project root:

```powershell
npm run practical
```

This runs all required operations:

1. Create database
2. Create table
3. Insert a record
4. Update the record
5. Select the record
6. Select unique authors
7. Delete the record
8. Drop the table

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

The printed numbers identify the functions. The live execution order is select, unique select, delete, and drop after insert and update.

## Operation Mapping

| Requirement | Function | SQL |
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

The delete, select, unique-select, and drop-table functions use this helper. Values are passed separately using `?` placeholders, which helps prevent SQL injection.

## How The Website Is Connected

The admission form in `admissions.html` is handled by `js/main.js`:

```text
Admission form
      |
      v
POST /api/admissions
      |
      v
server.js
      |
      v
db.js -> MySQL admissions table
```

The browser sends JSON to `/api/admissions`. The server inserts the data using a parameterized query and returns the new admission ID.

## Files To Show The Instructor

1. `package.json` - dependencies and scripts
2. `server.js` - Express server and API route
3. `db.js` - MySQL connection and admission insert
4. `mysql-practical.js` - all practical operations and `runQuery()`
5. `schema.sql` - database and table definitions
6. `admissions.html` - connected admission form
7. `js/main.js` - browser API submission
8. Terminal output from `npm run practical`
9. Health-check output from `/api/health`

## Viva Questions And Answers

### Which package did you use?

I used the `mysql2` Node.js package with its Promise API, together with Express for the website server.

### Why use `async` and `await`?

Database operations are asynchronous. `async` and `await` make the order of operations clear and prevent the next operation from running before the previous one finishes.

### Why are two MySQL connections created in the practical?

The first connection does not select a database, so it can create the database. The second connection selects that database and creates the table and records.

### What does `IF NOT EXISTS` do?

It prevents an error if the database or table already exists.

### What is a primary key?

The `id` column uniquely identifies each record.

```sql
id INT AUTO_INCREMENT PRIMARY KEY
```

### What does `AUTO_INCREMENT` do?

It generates a new numeric ID automatically for each inserted record.

### Why use question marks in SQL?

They are parameter placeholders. The values are supplied separately, which is safer than building SQL using string concatenation.

### What does `SELECT DISTINCT` do?

It returns unique values only. This practical uses it to return each author once.

### What do `insertId` and `affectedRows` mean?

- `insertId` is the generated ID of an inserted record.
- `affectedRows` is the number of rows changed by an update or delete.

### Difference between DELETE and DROP TABLE?

`DELETE` removes records while keeping the table. `DROP TABLE` removes the complete table structure and its records.

### What happens if MySQL is stopped?

The application cannot connect and reports an error such as `ECONNREFUSED`. MySQL Server must be running before starting the Node.js application.

### Where are the credentials stored?

They are stored in `.env`, which is ignored by Git. `.env.example` documents the required variables without exposing credentials.

## Short Explanation To Tell The Instructor

> “I created a Node.js and Express website connected to MySQL Server. The admission form sends data to a backend API, and the backend stores it in the admissions table using parameterized queries. I also implemented the required database practical in `mysql-practical.js`. The `runQuery()` user-defined function executes the delete, select, distinct-select, and drop-table queries. I verified the connection with `/api/health` and verified all operations using `npm run practical`.”
