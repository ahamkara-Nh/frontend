import React, { useState } from 'react';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import './ProductsScreen.css';

const ProductsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="products-container">
            <div className="products-header">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Найти продукт ..."
                />
                <button className="filter-button">
                    <img src="/icons/filter-icon.svg" alt="Filter" className="filter-icon" />
                </button>
            </div>

            <div className="products-content">
                {/* Products will be listed here */}
                <p className="placeholder-text">Список продуктов будет отображаться здесь</p>
            </div>

            <div className="divider"></div>
            <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%" }}>
                <BottomNavBar />
            </div>
        </div>
    );
};

export default ProductsScreen; 