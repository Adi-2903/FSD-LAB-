require('dotenv').config();

const mysql = require('mysql2/promise');

const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'csa_library'
};

const pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10
});

async function runQuery(sql, values = []) {
    const [result] = await pool.execute(sql, values);
    return result;
}

async function initializeDatabase() {
    const serverConnection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password
    });

    try {
        await serverConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    } finally {
        await serverConnection.end();
    }

    await runQuery(`
        CREATE TABLE IF NOT EXISTS admissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            roll_number VARCHAR(50) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            full_name VARCHAR(150) NOT NULL,
            date_of_birth DATE NOT NULL,
            email VARCHAR(160) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            sport VARCHAR(50) NOT NULL,
            batch VARCHAR(50) NOT NULL,
            guardian_name VARCHAR(150),
            city VARCHAR(120),
            address TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

async function createAdmission(admission) {
    const result = await runQuery(`
        INSERT INTO admissions
            (roll_number, first_name, full_name, date_of_birth, email, phone,
             sport, batch, guardian_name, city, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        admission.rollNumber,
        admission.firstName,
        admission.fullName,
        admission.dateOfBirth,
        admission.email,
        admission.phone,
        admission.sport,
        admission.batch,
        admission.guardianName || null,
        admission.city || null,
        admission.address
    ]);

    return result.insertId;
}

module.exports = { createAdmission, initializeDatabase, pool };