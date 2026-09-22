# Champion Sports Academy

Champion Sports Academy is a static website served by a Node.js/Express backend with a real MySQL Server connection.

## Run the Connected Website

1. Start MySQL Server.
2. Copy `.env.example` to `.env` and set the MySQL credentials.
3. Install dependencies:

   ```powershell
   npm install
   ```

4. Start the website:

   ```powershell
   npm start
   ```

5. Open <http://localhost:3000>.

The server creates the `csa_library` database and `admissions` table automatically when it starts.

## Connected Admission Flow

The form in `admissions.html` sends a `POST` request to `/api/admissions`. The API in `server.js` validates required fields and stores the admission through the parameterized MySQL insert in `db.js`.

Health check:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
```

Expected result:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## Project Areas

- `server.js`: Express server and admission API
- `db.js`: MySQL pool, database initialization, and admission insert
- `admissions.html`: Admission form
- `js/main.js`: Browser validation and API submission
- `mysql-demo/`: Separate MySQL practical demonstration and viva guide

The library book form remains a browser `localStorage` practical. The admission form is connected to MySQL.
