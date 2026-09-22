require('dotenv').config();

const express = require('express');
const path = require('path');
const { createAdmission, initializeDatabase, pool } = require('./db');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/health', async (request, response) => {
    try {
        await pool.query('SELECT 1');
        response.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        response.status(503).json({ status: 'error', database: 'disconnected' });
    }
});

app.post('/api/admissions', async (request, response) => {
    const admission = request.body;
    const requiredFields = [
        'rollNumber', 'firstName', 'fullName', 'dateOfBirth', 'email',
        'phone', 'sport', 'batch', 'address'
    ];

    if (requiredFields.some(field => !admission[field])) {
        return response.status(400).json({ error: 'Please complete all required admission fields.' });
    }

    try {
        const id = await createAdmission(admission);
        response.status(201).json({ id, message: 'Admission saved successfully.' });
    } catch (error) {
        console.error('Admission insert failed:', error.message);
        response.status(500).json({ error: 'The admission could not be saved.' });
    }
});

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

initializeDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Champion Sports Academy running at http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error('Database initialization failed:', error.message);
        process.exitCode = 1;
    });

process.on('SIGINT', async () => {
    await pool.end();
    process.exit(0);
});