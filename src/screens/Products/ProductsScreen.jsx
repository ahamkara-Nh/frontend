import React, { useState, useEffect } from 'react';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import FilterMenu from '../../components/FilterMenu/FilterMenu';
import ProductItem from '../../components/ProductItem/ProductItem';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './ProductsScreen.css';

const CATEGORIES = [
    { name: "Масла", image_name: "oil" },
    { name: "Молочные продукты", image_name: "milk" },
    { name: "Мясо, рыба, яйца", image_name: "meat" },
    { name: "Напитки", image_name: "beverages" },
    { name: "Овощи", image_name: "vegetables" },
    { name: "Орехи, бобовые, тофу", image_name: "nuts" },
    { name: "Перекус, батончики, печенье", image_name: "snaks" },
    { name: "Пищевые добавки", image_name: "addons" },
    { name: "Приправы и соусы", image_name: "sauce" },
    { name: "Сладости", image_name: "sweets" },
    { name: "Фрукты", image_name: "fruits" },
    { name: "Хлеб, хлопья, рис, макароны", image_name: "bread" }
];

const ProductsScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isSearchActive = searchQuery.trim() !== '';

    // Reset scroll position when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Handle clearing search
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    // Add Telegram WebApp back button functionality
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            if (isFilterMenuOpen) {
                window.Telegram.WebApp.BackButton.show();
                window.Telegram.WebApp.onEvent('backButtonClicked', toggleFilterMenu);
            } else if (isSearchActive) {
                // Show back button when search is active
                window.Telegram.WebApp.BackButton.show();
                window.Telegram.WebApp.onEvent('backButtonClicked', clearSearch);
            } else {
                window.Telegram.WebApp.BackButton.hide();
            }

            return () => {
                window.Telegram.WebApp.BackButton.hide();
                window.Telegram.WebApp.offEvent('backButtonClicked', isFilterMenuOpen ? toggleFilterMenu : clearSearch);
            };
        }
    }, [isFilterMenuOpen, isSearchActive]);

    const toggleFilterMenu = () => {
        console.log('[ProductsScreen] Toggling filter menu. Current isFilterMenuOpen:', isFilterMenuOpen, 'Setting to:', !isFilterMenuOpen);
        setIsFilterMenuOpen(!isFilterMenuOpen);
    };

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

    // Handle search functionality
    const handleSearch = async (query) => {
        if (!query || query.trim() === '') {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Get Telegram user ID or use a default for development
            const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

            const response = await fetch(`/products/search/${telegramId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    search_term: query.trim()
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data.products || []);
        } catch (err) {
            console.error('Error searching products:', err);
            setError('Failed to search products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Handle search query changes with debounce
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    return (
        <div className="products-container">
            <div className="products-header">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={(query) => {
                        // Limit to 25 characters
                        if (query.length <= 25) {
                            setSearchQuery(query);
                        }
                    }}
                    placeholder="Найти продукт ..."
                />
                <button className="filter-button" onClick={toggleFilterMenu}>
                    <img src="/icons/filter-icon.svg" alt="Filter" className="filter-icon" />
                </button>
            </div>

            <div className="products-content">
                {loading ? (
                    <LoadingSpinner size="medium" />
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : isSearchActive && searchResults.length > 0 ? (
                    <div className="search-results">
                        {searchResults.map(product => (
                            <ProductItem
                                key={product.product_id}
                                name={product.name}
                                type={determineFodmapLevel(product)}
                            />
                        ))}
                    </div>
                ) : isSearchActive ? (
                    <div className="empty-search-message">Ничего не найдено</div>
                ) : (
                    <div className="categories-container">
                        <CategoryCard
                            title="Мои продукты"
                            backgroundImage="/images/my-foods-bg.svg"
                            path="/products/my-products"
                        />
                        <CategoryCard
                            title="Low-FODMAP рецепты"
                            backgroundImage="/images/recipes-bg.svg"
                            path="/products/recipes"
                        />

                        {CATEGORIES.map((category, index) => (
                            <CategoryCard
                                key={index}
                                title={category.name}
                                backgroundImage={`/images/categories/${category.image_name}.png`}
                                path={`/products/category/${category.name}`}
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

export default ProductsScreen; 