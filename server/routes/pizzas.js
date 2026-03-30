import express from 'express';
// import controller for custom items
import PizzasController from '../controllers/pizzas.js';


const router = express.Router()

// define routes to get, create, edit, and delete items
router.get('/', PizzasController.getPizzas);
router.get('/:pizzaId', PizzasController.getPizzaById);
router.post('/', PizzasController.createPizza);
router.delete('/:id', PizzasController.deletePizza);
router.patch('/:id', PizzasController.updatePizza);

export default router;