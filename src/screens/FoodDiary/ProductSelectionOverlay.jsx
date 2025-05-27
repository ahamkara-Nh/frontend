import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import FilterMenu from '../../components/FilterMenu/FilterMenu';
import ProductItem from '../../components/ProductItem/ProductItem';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './ProductSelectionOverlay.css';

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

const ProductSelectionOverlay = ({ onClose, onSelectProduct }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);

    const isSearchActive = searchQuery.trim() !== '';

    // Handle clearing search
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    // Add Telegram WebApp back button functionality
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.BackButton.show();

            // If in category view, go back to categories on back button
            if (selectedCategory) {
                window.Telegram.WebApp.onEvent('backButtonClicked', () => {
                    setSelectedCategory(null);
                    setCategoryProducts([]);
                });
            } else {
                window.Telegram.WebApp.onEvent('backButtonClicked', onClose);
            }

            return () => {
                if (selectedCategory) {
                    window.Telegram.WebApp.offEvent('backButtonClicked', () => {
                        setSelectedCategory(null);
                        setCategoryProducts([]);
                    });
                } else {
                    window.Telegram.WebApp.offEvent('backButtonClicked', onClose);
                }
            };
        }
    }, [onClose, selectedCategory]);

    const toggleFilterMenu = () => {
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

    const handleProductSelect = (product) => {
        if (onSelectProduct) {
            onSelectProduct(product);
        }
        onClose();
    };

    const handleCategorySelect = async (categoryName, index) => {
        setSelectedCategory(categoryName);
        setLoading(true);
        setError(null);

        try {
            // Get category ID (1-12 based on index)
            const categoryId = index + 1;

            // Get Telegram user ID or use a default for development
            const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

            const response = await fetch(`/categories/${categoryId}/products/${telegramId}`);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            setCategoryProducts(data.products || []);
        } catch (err) {
            console.error(`Error fetching products for category ${categoryName}:`, err);
            setError(`Failed to load products for ${categoryName}. Please try again later.`);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
        setCategoryProducts([]);
    };

    const handleMyProductsClick = async () => {
        setSelectedCategory("Мои продукты");
        setLoading(true);
        setError(null);

        try {
            // Get Telegram user ID or use a default for development
            const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

            const response = await fetch(`/products/my-products/${telegramId}`);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            setCategoryProducts(data.products || []);
        } catch (err) {
            console.error(`Error fetching my products:`, err);
            setError(`Failed to load your products. Please try again later.`);
        } finally {
            setLoading(false);
        }
    };

    const handleRecipesClick = async () => {
        setSelectedCategory("Low-FODMAP рецепты");
        setLoading(true);
        setError(null);

        try {
            // Get Telegram user ID or use a default for development
            const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

            const response = await fetch(`/products/recipes/${telegramId}`);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            setCategoryProducts(data.recipes || data.products || []);
        } catch (err) {
            console.error(`Error fetching recipes:`, err);
            setError(`Failed to load recipes. Please try again later.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-selection-overlay">
            <div className="overlay-header">
                <button
                    className="back-button"
                    onClick={selectedCategory ? handleBackToCategories : onClose}
                >
                    <img src="/icons/back-arrow.svg" alt="Back" />
                </button>
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

            <div className="overlay-content">
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
                                onClick={() => handleProductSelect(product)}
                            />
                        ))}
                    </div>
                ) : isSearchActive ? (
                    <div className="empty-search-message">Ничего не найдено</div>
                ) : selectedCategory ? (
                    <div className="category-products">
                        <h2 className="category-title">{selectedCategory}</h2>
                        {categoryProducts.length > 0 ? (
                            <div className="product-list">
                                {categoryProducts.map(product => (
                                    <ProductItem
                                        key={product.product_id}
                                        name={product.name}
                                        type={determineFodmapLevel(product)}
                                        onClick={() => handleProductSelect(product)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-category-message">Нет продуктов в этой категории</div>
                        )}
                    </div>
                ) : (
                    <div className="categories-container-overlay">
                        {/* Use div with onClick instead of CategoryCard to prevent navigation */}
                        <div
                            className="custom-category-card"
                            onClick={handleMyProductsClick}
                        >
                            <div className="category-card-content">
                                <div
                                    className="category-card-bg"
                                    style={{ backgroundImage: `url(/images/my-foods-bg.svg)` }}
                                ></div>
                                <div className="category-card-title">Мои продукты</div>
                            </div>
                        </div>


                        {CATEGORIES.map((category, index) => (
                            <div
                                key={index}
                                className="custom-category-card"
                                onClick={() => handleCategorySelect(category.name, index)}
                            >
                                <div className="category-card-content">
                                    <div
                                        className="category-card-bg"
                                        style={{ backgroundImage: `url(/images/categories/${category.image_name}.png)` }}
                                    ></div>
                                    <div className="category-card-title">{category.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <FilterMenu isOpen={isFilterMenuOpen} onClose={toggleFilterMenu} />
        </div>
    );
};

export default ProductSelectionOverlay; 