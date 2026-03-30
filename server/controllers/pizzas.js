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
        const selectQuery = 'SELECT name, price, crust, sauce, toppings FROM pizzas WHERE id = $1';
        const pizzaId = req.params.pizzaId;
        const results = await pool.query(selectQuery, [pizzaId]);
        res.status(200).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const createPizza = async (req, res) => {
    try {
        const { name, price, crust, sauce, toppings } = req.body;
        const results = await pool.query(`
            INSERT INTO pizzas (name, price, crust, sauce, toppings)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [name, price, crust, sauce, toppings]
        );
        res.status(201).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const updatePizza = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, price, crust, sauce, toppings } = req.body;
        const results = await pool.query(`
            UPDATE pizzas SET name = $1, price = $2, crust = $3, sauce = $4, toppings = $5 WHERE id = $6 RETURNING *`,
            [name, price, crust, sauce, toppings]
        );
        res.status(200).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

const deletePizza = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await pool.query('DELETE FROM pizzas WHERE id = $1', [id]);
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