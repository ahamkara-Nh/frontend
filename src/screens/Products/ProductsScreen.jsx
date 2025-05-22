import React, { useState, useEffect } from 'react';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import FilterMenu from '../../components/FilterMenu/FilterMenu';
import './ProductsScreen.css';

const ProductsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

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
        console.log('[ProductsScreen] Toggling filter menu. Current isFilterMenuOpen:', isFilterMenuOpen, 'Setting to:', !isFilterMenuOpen);
        setIsFilterMenuOpen(!isFilterMenuOpen);
    };

    return (
        <div className="products-container">
            <div className="products-header">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    placeholder="Найти продукт ..."
                />
                <button className="filter-button" onClick={toggleFilterMenu}>
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

            <FilterMenu isOpen={isFilterMenuOpen} onClose={toggleFilterMenu} />
        </div>
    );
};

export default ProductsScreen; 