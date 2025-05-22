import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import FilterMenu from '../../components/FilterMenu/FilterMenu';
import ProductItem from '../../components/ProductItem/ProductItem';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './CategoryScreen.css';

const CategoryScreen = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Determine FODMAP level indicator type based on the highest FODMAP value
    const determineFodmapLevel = (product) => {
        const fodmapLevels = [
            product.fructose_level,
            product.lactose_level,
            product.fructan_level,
            product.mannitol_level,
            product.sorbitol_level,
            product.gos_level
        ];

        const maxLevel = Math.max(...fodmapLevels);

        if (maxLevel <= 1) {
            return 'green';
        } else if (maxLevel === 2) {
            return 'yellow';
        } else {
            return 'red';
        }
    };

    // Fetch products data
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Hardcoded category_id=1 for "Масла" as requested
                const categoryId = 1;

                // Get Telegram user ID or use a default for development
                const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

                const response = await fetch(`/categories/${categoryId}/products/${telegramId}`);

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle going back to the products screen
    const handleGoBack = () => {
        navigate('/products');
    };

    // Add Telegram WebApp back button functionality
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            if (isFilterMenuOpen) {
                // When filter menu is open, back button should close it
                window.Telegram.WebApp.BackButton.show();
                window.Telegram.WebApp.onEvent('backButtonClicked', toggleFilterMenu);
            } else {
                // When on the main category screen, back button should navigate to products
                window.Telegram.WebApp.BackButton.show();
                window.Telegram.WebApp.onEvent('backButtonClicked', handleGoBack);
            }

            return () => {
                window.Telegram.WebApp.BackButton.hide();
                window.Telegram.WebApp.offEvent('backButtonClicked', isFilterMenuOpen ? toggleFilterMenu : handleGoBack);
            };
        }
    }, [isFilterMenuOpen]);

    const toggleFilterMenu = () => {
        setIsFilterMenuOpen(!isFilterMenuOpen);
    };

    return (
        <div className="category-container">
            <div className="category-header">
                <h1 className="category-title-2">{categoryName || 'Масла'}</h1>
                <button className="filter-button" onClick={toggleFilterMenu}>
                    <img src="/icons/filter-icon.svg" alt="Filter" className="filter-icon" />
                </button>
            </div>

            <div className="category-content">
                {loading ? (
                    <LoadingSpinner size="large" />
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="products-list">
                        {products.map(product => (
                            <ProductItem
                                key={product.product_id}
                                name={product.name}
                                type={determineFodmapLevel(product)}
                            />
                        ))}
                    </div>
                )}
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