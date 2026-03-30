import pool from './database.js';
import 'dotenv.js';

const createPizzasTable = async () => {
    const createTableQuery = `
        DROP TABLE IF EXISTS pizzas;

        CREATE TABLE IF NOT EXISTS pizzas (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            pricePoint VARCHAR(10) NOT NULL,
            audience VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            submittedBy VARCHAR(255) NOT NULL,
            submittedOn TIMESTAMP NOT NULL
        )
    `;

    try {
        const res = await pool.query(createTableQuery);
        console.log('🎉 pizzas table created successfully');
    } catch (error) {
        console.error('⚠️ error creating pizzas table', error);
    }
}