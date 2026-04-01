import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PizzasAPI from '../services/PizzasAPI';
import '../App.css';
import './ViewPizzas.css';

const ViewPizzas = () => {
    const [pizzas, setPizzas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isActive = true;

        const loadPizzas = async () => {
            try {
                const data = await PizzasAPI.getAllPizzas();
                if (isActive) {
                    setPizzas(data);
                }
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

        loadPizzas();

        return () => {
            isActive = false;
        };
    }, []);

    const formatPrice = (price) => {
        const numericPrice = Number(price);
        return Number.isNaN(numericPrice)
            ? price
            : `$${numericPrice.toFixed(2)}`;
    };

    const capitalize = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleDeletePizza = async (event, id) => {
        event.preventDefault();

        const shouldDelete = window.confirm('Delete this pizza?');
        if (!shouldDelete) {
            return;
        }

        try {
            await PizzasAPI.deletePizza(id);
            alert('Pizza deleted successfully!');
            setPizzas((prevPizzas) => prevPizzas.filter((pizza) => pizza.id !== id));
        } catch (error) {
            alert('Error deleting pizza: ' + error.message);
        }
    }

    return (
        <div className="view-pizzas-page">
            <p className="view-pizzas-header">Pizza collection</p>

            {isLoading ? (
                <p className="view-pizzas-status">Loading pizzas...</p>
            ) : errorMessage ? (
                <p className="view-pizzas-status view-pizzas-error">{errorMessage}</p>
            ) : pizzas.length === 0 ? (
                <div className="view-pizzas-empty">
                    <h3>No pizzas yet</h3>
                    <p>Use the builder to create the first one.</p>
                </div>
            ) : (
                <section className="pizza-grid">
                    {pizzas.map((pizza) => (
                        <article className="pizza-card" key={pizza.id}>
                            <div className="pizza-controls">
                                <Link to={`/edit/${pizza.id}`} role="button">Edit</Link>
                                <button type="button" onClick={(event) => handleDeletePizza(event, pizza.id)}>Delete</button>
                            </div>
                            <Link to={`/pizzas/${pizza.id}`} className="pizza-card-link">
                                <div className="pizza-card-display">
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
                                <div className="pizza-card-header">
                                    <h3>{pizza.name}</h3>
                                    <span className="pizza-price">{formatPrice(pizza.price)}</span>
                                </div>
                                <div className="pizza-meta">
                                    <span>{capitalize(pizza.crust.replace(/-/g, ' '))} Crust</span>
                                    <span>{capitalize(pizza.sauce.replace(/-/g, ' '))} Sauce</span>
                                    <span>{capitalize(pizza.cheese.replace(/-/g, ' '))}</span>
                                    {pizza.toppings?.length > 0 ? pizza.toppings.map((topping) => (
                                        <span key={`${pizza.id}-${topping}`}>{capitalize(topping.replace(/-/g, ' '))}</span>
                                    )) : (
                                        <p className="pizza-muted">No toppings selected.</p>
                                    )}
                                </div>
                            </Link>
                        </article>
                    ))}
                </section>
            )}
        </div>
    );
}

export default ViewPizzas;