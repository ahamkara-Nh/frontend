import React, { useState } from 'react';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
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
                <div className="categories-container">
                    <CategoryCard
                        title="Мои продукты и блюда"
                        backgroundImage="/images/my-foods-bg.svg"
                        path="/products/my-foods"
                    />
                    <CategoryCard
                        title="Low-FODMAP рецепты"
                        backgroundImage="/images/recipes-bg.svg"
                        path="/products/recipes"
                    />
                </div>
            </div>

            <div className="nav-spacer"></div>

            <div className="bottom-nav-container">
                <BottomNavBar />
            </div>
        </div>
    );
};

export default ProductsScreen; 