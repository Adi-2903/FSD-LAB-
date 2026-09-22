require('dotenv').config();

const mysql = require('mysql2/promise');

const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'csa_library'
};

const sampleBook = {
    title: 'Modern Cricket Training',
    author: 'Arjun Mehta',
    publisher: 'CSA Publications',
    publishedYear: 2026,
    isbn: `CSA-${Date.now()}`,
    quantity: 12
};

async function runQuery(connection, sql, values = []) {
    const [result] = await connection.execute(sql, values);
    return result;
}

async function createDatabase(connection) {
    await runQuery(connection, `CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    console.log(`1. Database ready: ${config.database}`);
}

async function createTable(connection) {
    await runQuery(connection, `
        CREATE TABLE IF NOT EXISTS library_books (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            author VARCHAR(120) NOT NULL,
            publisher VARCHAR(120) NOT NULL,
            published_year SMALLINT NOT NULL,
            isbn VARCHAR(30) NOT NULL UNIQUE,
            quantity INT NOT NULL DEFAULT 1,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `);
    console.log('2. Table ready: library_books');
}

async function insertRecord(connection, book) {
    const result = await runQuery(connection, `
        INSERT INTO library_books
            (title, author, publisher, published_year, isbn, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [book.title, book.author, book.publisher, book.publishedYear, book.isbn, book.quantity]);

    console.log(`3. Inserted record with id: ${result.insertId}`);
    return result.insertId;
}

async function updateRecord(connection, id, quantity) {
    const result = await runQuery(connection, 'UPDATE library_books SET quantity = ? WHERE id = ?', [quantity, id]);
    console.log(`4. Updated record ${id}; rows changed: ${result.affectedRows}`);
}

async function deleteRecord(connection, id) {
    const result = await runQuery(connection, 'DELETE FROM library_books WHERE id = ?', [id]);
    console.log(`5. Deleted record ${id}; rows changed: ${result.affectedRows}`);
}

async function selectRecord(connection, id) {
    const rows = await runQuery(connection, 'SELECT * FROM library_books WHERE id = ?', [id]);
    console.log('6. Selected record:', rows[0] || 'No record found');
    return rows[0];
}

async function selectUniqueAuthors(connection) {
    const rows = await runQuery(connection, 'SELECT DISTINCT author FROM library_books ORDER BY author');
    console.log('7. Unique authors:', rows);
    return rows;
}

async function dropTable(connection) {
    await runQuery(connection, 'DROP TABLE IF EXISTS library_books');
    console.log('8. Dropped table: library_books');
}

async function main() {
    const serverConnection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password
    });

    try {
        await createDatabase(serverConnection);
    } finally {
        await serverConnection.end();
    }

    const connection = await mysql.createConnection(config);

    try {
        await createTable(connection);
        const recordId = await insertRecord(connection, sampleBook);
        await updateRecord(connection, recordId, 20);
        await selectRecord(connection, recordId);
        await selectUniqueAuthors(connection);
        await deleteRecord(connection, recordId);
        await dropTable(connection);
    } finally {
        await connection.end();
    }
}

main().catch(error => {
    const detail = error.code ? `${error.code}: ${error.message || 'connection failed'}` : error.message;
    console.error('MySQL practical failed:', detail || error);
    process.exitCode = 1;
});

module.exports = {
    createDatabase,
    createTable,
    insertRecord,
    updateRecord,
    deleteRecord,
    selectRecord,
    selectUniqueAuthors,
    dropTable,
    runQuery
};
