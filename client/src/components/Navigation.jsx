import React from 'react';
import '../App.css';
import './Navigation.css';

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li><h1>Pizza Hutch 🍕</h1></li>
            </ul>

            <ul>
                <li><a href='/' role='button'>Build Pizza</a></li>
                <li><a href='/pizzas' role='button'>View Pizza Collection</a></li>
            </ul>
            
        </nav>
    );
}

export default Navigation;