import { Pool } from 'pg';
import config from './config.js';
import dotenv from 'dotenv';
console.log('Database config:', {
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password ? '[SET]' : '[NOT SET]'
});
const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
async function testConnection() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        console.log('Database connection test successful:', result.rows[0]);
        return true;
    }
    catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
}
async function query(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    }
    catch (error) {
        console.error('Query error:', error);
        throw error;
    }
}
async function getClient() {
    return await pool.connect();
}
export { query, getClient, testConnection, pool, };
//# sourceMappingURL=database.js.map