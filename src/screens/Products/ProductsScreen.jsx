import React, { useState, useEffect } from 'react';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './ProductsScreen.css';

const ProductsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/categories');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data.categories || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

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

                    {loading ? (
                        <LoadingSpinner size="medium" />
                    ) : error ? (
                        <p className="error-message">Error loading categories</p>
                    ) : (
                        categories.map((category, index) => (
                            <CategoryCard
                                key={index}
                                title={category.name}
                                backgroundImage={`/images/categories/${category.image_name}.png`}
                                path={`/products/category/${category.name}`}
                            />
                        ))
                    )}
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