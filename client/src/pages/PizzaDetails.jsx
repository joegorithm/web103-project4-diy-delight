import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PizzasAPI from '../services/PizzasAPI';
import '../App.css';
import './PizzaDetails.css';

const LABELS = {
    crust: {
        standard: 'Standard',
        pretzel: 'Pretzel',
        garlic: 'Garlic'
    },
    sauce: {
        tomato: 'Traditional Tomato',
        barbecue: 'Barbecue',
        'creamy-garlic': 'Creamy Garlic'
    },
    cheese: {
        mozzarella: 'Mozzarella',
        cheddar: 'Cheddar',
        provolone: 'Provolone'
    },
    toppings: {
        pepperoni: 'Pepperoni',
        chicken: 'Chicken',
        peppers: 'Green Bell Peppers',
        olives: 'Black Olives',
        onions: 'Onions',
        pineapple: 'Pineapple'
    }
};

const formatPrice = (price) => {
    const numericPrice = Number(price);
    return Number.isNaN(numericPrice) ? price : `$${numericPrice.toFixed(2)}`;
};

const getLabel = (category, value) => LABELS[category]?.[value] || value;

const PizzaDetails = () => {
    const { id } = useParams();
    const [pizza, setPizza] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

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
                    setPizza(null);
                    setErrorMessage('Pizza not found.');
                    return;
                }

                setPizza(data);
            } catch (error) {
                if (isActive) {
                    setPizza(null);
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

    const toppings = pizza?.toppings ?? [];

    if (isLoading) {
        return (
            <div className="pizza-details-page">
                <p className="pizza-details-status">Loading pizza...</p>
            </div>
        );
    }

    if (errorMessage && !pizza) {
        return (
            <div className="pizza-details-page">
                <div className="pizza-details-status pizza-details-error">
                    <h2>Could not load pizza</h2>
                    <p>{errorMessage}</p>
                    <Link to="/pizzas" role="button">Back to collection</Link>
                </div>
            </div>
        );
    }

    if (!pizza) {
        return (
            <div className="pizza-details-page">
                <div className="pizza-details-status pizza-details-error">
                    <h2>Pizza not found</h2>
                    <p>The pizza you are looking for does not exist.</p>
                    <Link to="/pizzas" role="button">Back to collection</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pizza-details-page">
            <div className="pizza-details-header">
                <div>
                    <p className="pizza-details-kicker">Pizza details</p>
                    <h2>{pizza.name}</h2>
                </div>
                <div>
                    <a href={`/edit/${id}`} role="button">Edit</a>
                </div>
            </div>

            <div className="pizza-details-layout">
                <section className="pizza-details-display-panel">
                    <div className="pizza-display pizza-details-display">
                        {pizza.crust ? (
                            <img
                                src={`/src/assets/pizza-layers/crust/${pizza.crust}.png`}
                                className="pizza-display-item"
                                draggable="false"
                                alt=""
                            />
                        ) : null}

                        {pizza.sauce ? (
                            <img
                                src={`/src/assets/pizza-layers/sauce/${pizza.sauce}.png`}
                                className="pizza-display-item"
                                draggable="false"
                                alt=""
                            />
                        ) : null}

                        {pizza.cheese ? (
                            <img
                                src={`/src/assets/pizza-layers/cheese/${pizza.cheese}.png`}
                                className="pizza-display-item"
                                draggable="false"
                                alt=""
                            />
                        ) : null}

                        {toppings.length > 0
                            ? toppings.map((topping) => (
                                <img
                                    key={topping}
                                    src={`/src/assets/pizza-layers/toppings/${topping}.png`}
                                    className="pizza-display-item"
                                    draggable="false"
                                    alt=""
                                />
                            ))
                            : null}
                    </div>

                    <div className="pizza-details-price">{formatPrice(pizza.price)}</div>
                </section>

                <article className="pizza-details-card">
                    <div className="pizza-details-section">
                        <h3>Summary</h3>
                        <div className="pizza-details-grid">
                            <div className="pizza-details-field">
                                <span className="pizza-details-label">Crust</span>
                                <strong>{getLabel('crust', pizza.crust)} crust</strong>
                            </div>
                            <div className="pizza-details-field">
                                <span className="pizza-details-label">Sauce</span>
                                <strong>{getLabel('sauce', pizza.sauce)}</strong>
                            </div>
                            <div className="pizza-details-field">
                                <span className="pizza-details-label">Cheese</span>
                                <strong>{getLabel('cheese', pizza.cheese)}</strong>
                            </div>
                            <div className="pizza-details-field">
                                <span className="pizza-details-label">Toppings</span>
                                <strong>{toppings.length} selected</strong>
                            </div>
                        </div>
                    </div>

                    <div className="pizza-details-section">
                        <h3>Toppings</h3>
                        {toppings.length > 0 ? (
                            <div className="pizza-details-chip-row">
                                {toppings.map((topping) => (
                                    <span className="pizza-details-chip" key={topping}>
                                        {getLabel('toppings', topping)}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="pizza-details-muted">No toppings selected.</p>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
};

export default PizzaDetails;