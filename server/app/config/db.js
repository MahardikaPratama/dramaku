const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.NODE_ENV !== 'test') {
    const connectionString = process.env.DATABASE_URL;

    pool = new Pool(
        connectionString
            ? { connectionString, ssl: { rejectUnauthorized: false } }
            : {
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,
            }
    );

    pool.connect()
    .then(client => {
        console.log('Connected to the database successfully');
        // Set timezone for this session
        return client.query("SET timezone = 'Asia/Jakarta';")
            .then(() => {
                client.release();
                console.log('Timezone has been set to Asia/Jakarta');
            })
            .catch(err => {
                client.release();
                console.error('Error setting timezone:', err.stack);
            });
    })
    .catch(err => {
        console.error('Database connection error:', err.stack);
    });
}

module.exports = pool;
