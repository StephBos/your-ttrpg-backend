const { Pool } = require('pg');
require('dotenv').config();

// Connect to default postgres database first
const defaultPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Connect to default database
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function setupDatabase() {
  const client = await defaultPool.connect();
  
  try {
    console.log('Creating database...');
    
    // Create database if it doesn't exist
    await client.query(`
      SELECT 'CREATE DATABASE your_ttrpg_db'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'your_ttrpg_db')\gexec
    `);
    
    console.log('Database created successfully!');
    
    // Close connection to default database
    client.release();
    
    // Connect to the new database
    const appPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: 'your_ttrpg_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });
    
    const appClient = await appPool.connect();
    
    try {
      console.log('Creating users table...');
      
      // Create users table
      await appClient.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          userName VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Users table created successfully!');
      
      // Insert sample data
      const result = await appClient.query('SELECT COUNT(*) FROM users');
      if (parseInt(result.rows[0].count) === 0) {
        console.log('Inserting sample data...');
        await appClient.query(`
          INSERT INTO users (userName, email) VALUES 
            ('John Doe', 'john@example.com'),
            ('Jane Smith', 'jane@example.com'),
            ('Bob Johnson', 'bob@example.com')
        `);
        console.log('Sample data inserted successfully!');
      } else {
        console.log('Sample data already exists.');
      }
      
    } finally {
      appClient.release();
      await appPool.end();
    }
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await defaultPool.end();
  }
}

setupDatabase();

