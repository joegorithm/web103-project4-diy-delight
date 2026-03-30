const API_BASE = '/pizzas';

const request = async (path = '', options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, options);

    if (!response.ok) {
        throw new Error(`Pizzas API request failed with status ${response.status}`);
    }

    return response.json();
}

const getAllPizzas = async () => request();

const getPizzaById = async (pizzaId) => request(`/${pizzaId}`);

const createPizza = async (pizzaData) =>
    request('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pizzaData)
    });

const updatePizza = async (pizzaId, pizzaData) =>
    request(`/${pizzaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pizzaData)
    });

const deletePizza = async (pizzaId) =>
    request(`/${pizzaId}`, { method: 'DELETE' });

export default {
    getAllPizzas,
    getPizzaById,
    createPizza,
    updatePizza,
    deletePizza
};