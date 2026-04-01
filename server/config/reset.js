import { pool } from './database.js';
import dotenv from 'dotenv';

dotenv.config();

const createPizzasTable = async () => {
    const createTableQuery = `
        DROP TABLE IF EXISTS pizzas;

        CREATE TABLE IF NOT EXISTS pizzas (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price NUMERIC(10,2) NOT NULL,
            crust TEXT NOT NULL,
            sauce TEXT NOT NULL,
            cheese TEXT NOT NULL,
            toppings TEXT[] NOT NULL
        )
    `;

    try {
        const res = await pool.query(createTableQuery);
        console.log('🎉 pizzas table created successfully');
    } catch (error) {
        console.error('⚠️ error creating pizzas table', error);
    }
}

createPizzasTable().finally(() => pool.end());