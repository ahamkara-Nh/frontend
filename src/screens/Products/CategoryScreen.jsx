import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import FilterMenu from '../../components/FilterMenu/FilterMenu';
import ProductItem from '../../components/ProductItem/ProductItem';
import './CategoryScreen.css';

// Placeholder products data
const PLACEHOLDER_PRODUCTS = [
    { id: 1, name: 'Кукруза', type: 'red' },
    { id: 2, name: 'Рис', type: 'green' },
    { id: 3, name: 'Овсянка', type: 'green' },
    { id: 4, name: 'Киноа', type: 'yellow' },
    { id: 5, name: 'Гречка', type: 'green' },
    { id: 6, name: 'Пшено', type: 'yellow' },
    { id: 7, name: 'Ячмень', type: 'red' },
    { id: 8, name: 'Пшеница', type: 'red' },
    { id: 9, name: 'Мука пшеничная', type: 'red' },
    { id: 10, name: 'Мука кукурузная', type: 'red' },
];

const CategoryScreen = () => {
    const { categoryName } = useParams();
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [products, setProducts] = useState(PLACEHOLDER_PRODUCTS);

    // Add Telegram WebApp back button functionality
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            if (isFilterMenuOpen) {
                window.Telegram.WebApp.BackButton.show();
                window.Telegram.WebApp.onEvent('backButtonClicked', toggleFilterMenu);
            } else {
                window.Telegram.WebApp.BackButton.hide();
            }

            return () => {
                window.Telegram.WebApp.BackButton.hide();
                window.Telegram.WebApp.offEvent('backButtonClicked', toggleFilterMenu);
            };
        }
    }, [isFilterMenuOpen]);

    const toggleFilterMenu = () => {
        setIsFilterMenuOpen(!isFilterMenuOpen);
    };

    return (
        <div className="category-container">
            <div className="category-header">
                <h1 className="category-title-2">{categoryName || 'Категория'}</h1>
                <button className="filter-button" onClick={toggleFilterMenu}>
                    <img src="/icons/filter-icon.svg" alt="Filter" className="filter-icon" />
                </button>
            </div>

            <div className="category-content">
                <div className="products-list">
                    {products.map(product => (
                        <ProductItem
                            key={product.id}
                            name={product.name}
                            type={product.type}
                        />
                    ))}
                </div>
            </div>

            <div className="nav-spacer"></div>

            <div className="bottom-nav-container">
                <BottomNavBar />
            </div>

            <FilterMenu isOpen={isFilterMenuOpen} onClose={toggleFilterMenu} />
        </div>
    );
};

export default CategoryScreen; 