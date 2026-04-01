import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PizzasAPI from '../services/PizzasAPI';
import '../App.css';
import './CreatePizza.css';

const PRICING = {
    crust: {
        standard: 5,
        special: 7
    },
    sauce: {
        tomato: 2.5,
        barbecue: 2.5,
        'creamy-garlic': 3.35
    },
    cheese: {
        mozzarella: 2,
        cheddar: 2,
        provolone: 3
    },
    topping: 1.75
};

const formatCurrency = (price) => `$${price.toFixed(2)}`;

const formatPriceTag = (price) => ` (+${formatCurrency(price)})`;

const EMPTY_PIZZA = {
    id: 0,
    name: '',
    price: 0,
    crust: '',
    sauce: '',
    cheese: '',
    toppings: []
};

const calculatePizzaPrice = (pizza) => {
    const crustPrice = pizza.crust === 'standard'
        ? PRICING.crust.standard
        : pizza.crust
            ? PRICING.crust.special
            : 0;
    const saucePrice = pizza.sauce ? PRICING.sauce[pizza.sauce] ?? 0 : 0;
    const cheesePrice = pizza.cheese ? PRICING.cheese[pizza.cheese] ?? 0 : 0;
    const toppingsPrice = pizza.toppings.length * PRICING.topping;

    return crustPrice + saucePrice + cheesePrice + toppingsPrice;
};

const EditPizza = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [pizza, setPizza] = useState(EMPTY_PIZZA);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleNameChange = (event) => {
        setPizza((prev) => ({
                ...prev,
                name: event.target.value ,
        }));
    };

    const handleCrustSelection = (event) => {
        setPizza((prev) => ({ ...prev, crust: event.target.value }));
    };

    const handleSauceSelection = (event) => {
        setPizza((prev) => ({ ...prev, sauce: event.target.value }));
    };

    const handleCheeseSelection = (event) => {
        setPizza((prev) => ({ ...prev, cheese: event.target.value }));
    };

    const handleToppingChange = (event) => {
        const { value, checked } = event.target;
        setPizza((prev) => {
            if (checked) {
                // Add topping to array if checked
                return {
                    ...prev,
                    toppings: [...prev.toppings, value]
                };
            } else {
                // Remove topping from array if unchecked
                return {
                    ...prev,
                    toppings: prev.toppings.filter(topping => topping !== value)
                };
            }
        });
    };

    useEffect(() => {
        const totalPrice = calculatePizzaPrice(pizza);

        setPizza((prev) => (
            prev.price === totalPrice
                ? prev
                : { ...prev, price: totalPrice }
        ));
    }, [pizza.crust, pizza.sauce, pizza.cheese, pizza.toppings]);

    const updatePizza = async (event) => {
        event.preventDefault();
        
        // Validation
        if (!pizza.name.trim()) {
            alert('Please enter a pizza name');
            return;
        }
        if (!pizza.crust) {
            alert('Please select a crust');
            return;
        }
        if (!pizza.sauce) {
            alert('Please select a sauce');
            return;
        }
        if (!pizza.cheese) {
            alert('Please select a cheese');
            return;
        }

        const pizzaToSave = {
            ...pizza,
            price: calculatePizzaPrice(pizza)
        };
        
        try {
            const updatedPizza = await PizzasAPI.updatePizza(id, pizzaToSave);
            alert('Pizza updated successfully!');
            navigate(`/pizzas/${updatedPizza.id ?? id}`);
        } catch (error) {
            alert('Error updating pizza: ' + error.message);
        }
    }

    useEffect(() => {
        let isActive = true;

        const loadPizza = async () => {
            setIsLoading(true);
            setErrorMessage('');

            try {
                const data = await PizzasAPI.getPizzaById(id);

                if (!isActive) {
                    return;
                }

                if (!data) {
                    setErrorMessage('Pizza not found.');
                    return;
                }

                setPizza(data);
            } catch (error) {
                if (isActive) {
                    setErrorMessage(error.message);
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        loadPizza();

        return () => {
            isActive = false;
        };
    }, [id]);


    const formatPrice = (price) => {
        const numericPrice = Number(price);
        return Number.isNaN(numericPrice)
            ? price
            : formatCurrency(numericPrice);
    };

    if (isLoading) {
        return (
            <div className="create-edit-pizza-container">
                <p>Loading pizza...</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="create-edit-pizza-container">
                <div className="pizza-details-status pizza-details-error">
                    <h2>Could not load pizza</h2>
                    <p>{errorMessage}</p>
                    <Link to="/pizzas" role="button">Back to collection</Link>
                </div>
            </div>
        );
    }

    const handleDeletePizza = async (event) => {
        event.preventDefault();

        const shouldDelete = window.confirm('Delete this pizza?');
        if (!shouldDelete) {
            return;
        }

        try {
            await PizzasAPI.deletePizza(id);
            alert('Pizza deleted successfully!');
            navigate('/pizzas');
        } catch (error) {
            alert('Error deleting pizza: ' + error.message);
        }
    }
    
    return (
        <>
            <div className="create-edit-pizza-container">
                <div className="pizza-display-container">
                    <div className="pizza-display">
                        {pizza.crust ? (
                            <img src={`/src/assets/pizza-layers/crust/${pizza.crust}.png`} className="pizza-display-item" draggable="false" />
                        ) : (
                            ""
                        )}
                        {pizza.sauce ? (
                            <img src={`/src/assets/pizza-layers/sauce/${pizza.sauce}.png`} className="pizza-display-item" draggable="false" />
                        ) : (
                            ""
                        )}
                        {pizza.cheese ? (
                            <img src={`/src/assets/pizza-layers/cheese/${pizza.cheese}.png`} className="pizza-display-item" draggable="false" />
                        ) : (
                            ""
                        )}
                        {pizza.toppings.length > 0 ? (
                            pizza.toppings.map((topping) =>
                                (<img src={`/src/assets/pizza-layers/toppings/${topping}.png`} className="pizza-display-item" draggable="false" />)
                            )
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                <div className="delete-button-container">
                    <button type="button" onClick={handleDeletePizza}>Delete</button>
                </div>
                <form onSubmit={updatePizza}>
                    <center><h2>Pizza Builder</h2></center>
                    <div className="scrollable-pizza-form">
                        <label>
                            <span>Name</span>
                            <input type="text" id="name" name="name" value={pizza.name} onChange={handleNameChange} />
                        </label>
                        <span>Crust</span>
                        <label>
                            <input type="radio" id="standard" name="crust" value="standard" checked={pizza.crust === 'standard'} onChange={handleCrustSelection} />
                            Standard
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.crust.standard)}</span>
                        </label>
                        <label>
                            <input type="radio" id="pretzel" name="crust" value="pretzel" checked={pizza.crust === 'pretzel'} onChange={handleCrustSelection} />
                            Pretzel
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.crust.special)}</span>
                        </label>
                        <label>
                            <input type="radio" id="garlic" name="crust" value="garlic" checked={pizza.crust === 'garlic'} onChange={handleCrustSelection} />
                            Garlic
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.crust.special)}</span>
                        </label>
                        <span>Sauce</span>
                        <label>
                            <input type="radio" id="tomato" name="sauce" value="tomato" checked={pizza.sauce === 'tomato'} onChange={handleSauceSelection} />
                            Traditional Tomato
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.sauce.tomato)}</span>
                        </label>
                        <label>
                            <input type="radio" id="barbecue" name="sauce" value="barbecue" checked={pizza.sauce === 'barbecue'} onChange={handleSauceSelection} />
                            Barbecue
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.sauce.barbecue)}</span>
                        </label>
                        <label>
                            <input type="radio" id="creamy-garlic" name="sauce" value="creamy-garlic" checked={pizza.sauce === 'creamy-garlic'} onChange={handleSauceSelection} />
                            Creamy Garlic
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.sauce['creamy-garlic'])}</span>
                        </label>
                        <span>Cheese</span>
                        <label>
                            <input type="radio" id="mozzarella" name="cheese" value="mozzarella" checked={pizza.cheese === 'mozzarella'} onChange={handleCheeseSelection} />
                            Mozzarella
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.cheese.mozzarella)}</span>
                        </label>
                        <label>
                            <input type="radio" id="cheddar" name="cheese" value="cheddar" checked={pizza.cheese === 'cheddar'} onChange={handleCheeseSelection} />
                            Cheddar
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.cheese.cheddar)}</span>
                        </label>
                        <label>
                            <input type="radio" id="provolone" name="cheese" value="provolone" checked={pizza.cheese === 'provolone'} onChange={handleCheeseSelection} />
                            Provolone
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.cheese.provolone)}</span>
                        </label>
                        <span>Toppings</span>
                        <label>
                            <input type="checkbox" id="pepparoni" name="toppings" value="pepperoni" checked={pizza.toppings.includes('pepperoni')} onChange={handleToppingChange} />
                            Pepperoni
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.topping)}</span>
                        </label>
                        <label>
                            <input type="checkbox" id="chicken" name="toppings" value="chicken" checked={pizza.toppings.includes('chicken')} onChange={handleToppingChange} />
                            Chicken
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.topping)}</span>
                        </label>
                        <label>
                            <input type="checkbox" id="peppers" name="toppings" value="peppers" checked={pizza.toppings.includes('peppers')} onChange={handleToppingChange} />
                            Green Bell Peppers
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.topping)}</span>
                        </label>
                        <label>
                            <input type="checkbox" id="olives" name="toppings" value="olives" checked={pizza.toppings.includes('olives')} onChange={handleToppingChange} />
                            Black Olives
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.topping)}</span>
                        </label>
                        <label>
                            <input type="checkbox" id="onions" name="toppings" value="onions" checked={pizza.toppings.includes('onions')} onChange={handleToppingChange} />
                            Onions
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.topping)}</span>
                        </label>
                        <label>
                            <input type="checkbox" id="pineapple" name="toppings" value="pineapple" checked={pizza.toppings.includes('pineapple')} onChange={handleToppingChange} />
                            Pineapple
                            <span className="pizza-layer-price">{formatPriceTag(PRICING.topping)}</span>
                        </label>
                    </div>
                    <input type="submit" className="submit-button" value="Bake 🔥" />
                </form>
            </div>
            <div className="price-indicator">
                {formatPrice(pizza.price)}
            </div>
        </>
    );
}

export default EditPizza;