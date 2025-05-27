import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import FilterMenu from '../../components/FilterMenu/FilterMenu';
import ProductItemOverlay from '../../components/ProductItemOverlay/ProductItemOverlay';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ProductDetailOverlay from './ProductDetailOverlay';
import ServingInfo from '../../components/ServingInfo/ServingInfo';
import './ProductSelectionOverlay.css';
// Import icons for My Products section
import list1Icon from '../../assets/icons/list-1-icon.svg';
import list2Icon from '../../assets/icons/list-2-icon.svg';
import list3Icon from '../../assets/icons/list-3-icon.svg';
import favoritesIcon from '../../assets/icons/favorites-icon.svg';
import myProductsIcon from '../../assets/icons/my-products-icon.svg';
import plusIcon from '../../assets/icons/plus_icon.svg';

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

// Categories for My Products section
const MY_PRODUCTS_CATEGORIES = [
    { id: 1, name: 'Список - 1 этап', icon: list1Icon, type: 'phase1' },
    { id: 2, name: 'Список - 2 этап', icon: list2Icon, type: 'phase2' },
    { id: 3, name: 'Список - 3 этап', icon: list3Icon, type: 'phase3' },
    { id: 4, name: 'Избранное', icon: favoritesIcon, type: 'favourites' },
    { id: 5, name: 'Мои продукты', icon: myProductsIcon, type: 'user_created' },
];

const ProductSelectionOverlay = ({ onClose, onSelectProduct }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productData, setProductData] = useState(null);
    const [selectedServing, setSelectedServing] = useState(null);
    const [viewingProductDetails, setViewingProductDetails] = useState(false);

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

    const handleProductClick = (product) => {
        // Show product detail overlay
        setSelectedProduct(product);
        setViewingProductDetails(true);
    };

    const handleBackFromProductDetails = () => {
        setViewingProductDetails(false);
        setProductData(null);
        setSelectedServing(null);
    };

    useEffect(() => {
        if (selectedProduct && viewingProductDetails) {
            const fetchProductDetails = async () => {
                setLoading(true);

                try {
                    // Get Telegram user ID or use a default for development
                    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

                    // Check if it's a user-created product
                    if (selectedProduct.user_created) {
                        // For user-created products, we already have the data we need
                        const productData = {
                            product_id: selectedProduct.product_id || selectedProduct.id,
                            name: selectedProduct.name,
                            fructose_level: selectedProduct.fructose_level,
                            lactose_level: selectedProduct.lactose_level,
                            fructan_level: selectedProduct.fructan_level,
                            mannitol_level: selectedProduct.mannitol_level,
                            sorbitol_level: selectedProduct.sorbitol_level,
                            gos_level: selectedProduct.gos_level,
                            // Create a single serving based on the product data
                            servings: [{
                                serving_id: 1,
                                serving_size: selectedProduct.serving_title || "1 порция",
                                serving_amount_grams: selectedProduct.serving_amount_grams || 0,
                                fructose_level: selectedProduct.fructose_level,
                                lactose_level: selectedProduct.lactose_level,
                                fructan_level: selectedProduct.fructan_level,
                                mannitol_level: selectedProduct.mannitol_level,
                                sorbitol_level: selectedProduct.sorbitol_level,
                                gos_level: selectedProduct.gos_level
                            }]
                        };

                        setProductData(productData);
                        setSelectedServing(productData.servings[0]);
                        setLoading(false);
                        return;
                    }

                    // Fetch product details by name to get all serving sizes
                    const response = await fetch('/products/get-by-name', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: selectedProduct.name,
                            telegramId: telegramId
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`API request failed with status ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.products && Array.isArray(data.products) && data.products.length > 0) {
                        const productData = data.products[0];
                        setProductData(productData);

                        // Create servings array from all products with the same name
                        // Filter out duplicates based on serving_title
                        const uniqueServingTitles = new Set();
                        const servings = data.products
                            .filter(prod => {
                                const servingTitle = prod.serving_title || "1 порция";
                                if (uniqueServingTitles.has(servingTitle)) {
                                    return false; // Skip duplicates
                                }
                                uniqueServingTitles.add(servingTitle);
                                return true;
                            })
                            .map((prod, index) => ({
                                serving_id: index + 1,
                                serving_size: prod.serving_title || "1 порция",
                                serving_amount_grams: prod.serving_amount_grams || 0,
                                fructose_level: prod.fructose_level,
                                lactose_level: prod.lactose_level,
                                fructan_level: prod.fructan_level,
                                mannitol_level: prod.mannitol_level,
                                sorbitol_level: prod.sorbitol_level,
                                gos_level: prod.gos_level
                            }))
                            .sort((a, b) => (a.serving_amount_grams || 0) - (b.serving_amount_grams || 0));

                        // Add servings to the product data
                        productData.servings = servings;

                        // Set the first (smallest) serving as the selected serving
                        setSelectedServing(servings[0]);
                    } else {
                        // Fallback to direct product fetch if get-by-name doesn't return results
                        await fetchProductDirectly();
                    }
                } catch (err) {
                    console.error('Error fetching product details:', err);
                    // Fallback to direct product fetch if get-by-name fails
                    await fetchProductDirectly();
                } finally {
                    setLoading(false);
                }
            };

            // Function to fetch product directly by ID
            const fetchProductDirectly = async () => {
                try {
                    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';
                    const response = await fetch(`/products/${selectedProduct.product_id}/${telegramId}`);

                    if (!response.ok) {
                        throw new Error(`API request failed with status ${response.status}`);
                    }

                    const data = await response.json();

                    if (data.product) {
                        const fetchedProductData = data.product;
                        setProductData(fetchedProductData);

                        // Set the first serving as the selected serving if available
                        if (fetchedProductData.servings && fetchedProductData.servings.length > 0) {
                            // Filter out duplicate servings
                            const uniqueServingTitles = new Set();
                            const uniqueServings = fetchedProductData.servings
                                .filter(serving => {
                                    const servingSize = serving.serving_size || "1 порция";
                                    if (uniqueServingTitles.has(servingSize)) {
                                        return false; // Skip duplicates
                                    }
                                    uniqueServingTitles.add(servingSize);
                                    return true;
                                })
                                .sort((a, b) => (a.serving_amount_grams || 0) - (b.serving_amount_grams || 0));

                            fetchedProductData.servings = uniqueServings;
                            setSelectedServing(uniqueServings[0]);
                        } else {
                            // Create a serving from the product data if servings array doesn't exist
                            const serving = {
                                serving_id: 1,
                                serving_size: fetchedProductData.serving_title || "1 порция",
                                serving_amount_grams: fetchedProductData.serving_amount_grams || 0,
                                fructose_level: fetchedProductData.fructose_level,
                                lactose_level: fetchedProductData.lactose_level,
                                fructan_level: fetchedProductData.fructan_level,
                                mannitol_level: fetchedProductData.mannitol_level,
                                sorbitol_level: fetchedProductData.sorbitol_level,
                                gos_level: fetchedProductData.gos_level
                            };

                            fetchedProductData.servings = [serving];
                            setSelectedServing(serving);
                        }
                    } else {
                        setError('No product data found');
                    }
                } catch (err) {
                    console.error('Error fetching product directly:', err);
                    setError('Failed to load product details. Please try again later.');
                }
            };

            fetchProductDetails();
        }
    }, [selectedProduct, viewingProductDetails]);

    const handleSelectServing = (serving) => {
        setSelectedServing(serving);
    };

    const handleAddProduct = () => {
        if (productData && selectedServing) {
            // Create a product object with the selected serving data
            const productToAdd = {
                ...productData,
                selected_serving: selectedServing
            };

            // Call the onSelectProduct function from props
            onSelectProduct(productToAdd);

            // Close the overlay
            onClose();
        }
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

            // Add category_id to each product in the response
            const productsWithCategory = (data.products || []).map(product => ({
                ...product,
                category_id: categoryId
            }));

            setCategoryProducts(productsWithCategory);
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

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category.name);
        setLoading(true);
        setError(null);

        try {
            // Get Telegram user ID or use a default for development
            const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

            let response;
            let data;

            if (category.type === 'user_created') {
                // Use the user-created products endpoint
                response = await fetch(`/users/${telegramId}/products`);

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                data = await response.json();

                // Format user-created products
                const formattedProducts = (data.products || []).map(product => ({
                    product_id: product.user_product_id,
                    id: product.user_product_id, // Add id property for compatibility
                    name: product.name,
                    fructose_level: product.fructose_level,
                    lactose_level: product.lactose_level,
                    fructan_level: product.fructan_level,
                    mannitol_level: product.mannitol_level,
                    sorbitol_level: product.sorbitol_level,
                    gos_level: product.gos_level,
                    serving_title: product.serving_title || "1 порция", // Add serving_title
                    user_created: true // Add flag to identify user-created products
                }));

                setCategoryProducts(formattedProducts);

                console.log("User-created products:", formattedProducts); // Debug log
            } else {
                // Use the list items endpoint for other list types
                response = await fetch(`/users/${telegramId}/lists/${category.type}/items`);

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                data = await response.json();
                // The API returns 'items' not 'products' for list items
                setCategoryProducts(data.items || []);

                console.log("List items:", data.items); // Debug log
            }
        } catch (err) {
            console.error(`Error fetching products for ${category.name}:`, err);
            setError(`Failed to load products for ${category.name}. Please try again later.`);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToAddProduct = () => {
        navigate('/products/add');
    };

    return (
        <div className="product-selection-overlay">
            {viewingProductDetails && selectedProduct ? (
                <div className="product-detail-overlay">
                    <div className="product-detail-header">
                        <button className="back-button-overlay" onClick={handleBackFromProductDetails}>
                            <img src="/icons/back-arrow.svg" alt="Back" />
                        </button>
                        <h1 className="product-name-heading-overlay">
                            {productData?.name || selectedProduct.name}
                        </h1>
                    </div>

                    <div className="product-detail-content-overlay">
                        {loading ? (
                            <LoadingSpinner size="medium" />
                        ) : error ? (
                            <div className="error-message-overlay">{error}</div>
                        ) : productData ? (
                            <>
                                <ServingInfo
                                    servings={productData.servings}
                                    selectedServing={selectedServing}
                                    onSelectServing={handleSelectServing}
                                />

                                <div className="divider-overlay"></div>

                                <button
                                    className="add-product-button-overlay"
                                    onClick={handleAddProduct}
                                >
                                    Добавить продукт
                                </button>
                            </>
                        ) : (
                            <div className="error-message-overlay">No product data available</div>
                        )}
                    </div>
                </div>
            ) : (
                <>
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
                                    <ProductItemOverlay
                                        key={product.product_id}
                                        name={product.name}
                                        type={determineFodmapLevel(product)}
                                        onClick={() => handleProductClick(product)}
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
                                            <ProductItemOverlay
                                                key={product.product_id}
                                                name={product.name}
                                                type={determineFodmapLevel(product)}
                                                onClick={() => handleProductClick(product)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-category-message">Нет продуктов в этой категории</div>
                                )}
                            </div>
                        ) : (
                            <div className="categories-container-overlay">
                                {/* My Products Section with same content as MyProductsScreen */}
                                <div className="overlay-my-products-content">

                                    <div className="overlay-category-grid">
                                        {MY_PRODUCTS_CATEGORIES.map((category) => (
                                            <div
                                                key={category.id}
                                                className="overlay-category-button"
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                <img src={category.icon} alt={category.name} className="overlay-category-icon" />
                                                <span className="overlay-category-name">{category.name}</span>
                                            </div>
                                        ))}
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
                </>
            )}
        </div>
    );
};

export default ProductSelectionOverlay; 