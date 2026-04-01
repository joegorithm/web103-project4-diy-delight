import { pool } from '../config/database.js';

const getPizzas = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM pizzas ORDER BY id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const getPizzaById = async (req, res) => {
    try {
        const selectQuery = 'SELECT * FROM pizzas WHERE id = $1';
        const pizzaId = req.params.pizzaId;
        const results = await pool.query(selectQuery, [pizzaId]);

        if (!results.rows[0]) {
            return res.status(404).json({ error: 'Pizza not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const createPizza = async (req, res) => {
    try {
        const { name, price, crust, sauce, cheese, toppings } = req.body;
        
        // Validation
        if (!name || !crust || !sauce || !cheese) {
            return res.status(400).json({ error: 'Missing required fields: name, crust, sauce, and cheese are required' });
        }
        
        const results = await pool.query(`
            INSERT INTO pizzas (name, price, crust, sauce, cheese, toppings)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [name, price, crust, sauce, cheese, toppings]
        );
        res.status(201).json(results.rows[0]);
    } catch (error) {
        console.error('Error creating pizza:', error.message);
        res.status(409).json({ error: error.message });
    }
}

const updatePizza = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'Invalid pizza id' });
        }

        const { name, price, crust, sauce, cheese, toppings } = req.body;
        const results = await pool.query(`
            UPDATE pizzas SET name = $1, price = $2, crust = $3, sauce = $4, cheese = $5, toppings = $6 WHERE id = $7 RETURNING *`,
            [name, price, crust, sauce, cheese, toppings, id]
        );

        if (!results.rows[0]) {
            return res.status(404).json({ error: 'Pizza not found' });
        }

        res.status(200).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const deletePizza = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'Invalid pizza id' });
        }

        const results = await pool.query('DELETE FROM pizzas WHERE id = $1 RETURNING *', [id]);

        if (!results.rows[0]) {
            return res.status(404).json({ error: 'Pizza not found' });
        }

        res.status(200).json({ message: 'Pizza deleted successfully' });
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

export default {
    getPizzas,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
};