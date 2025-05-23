import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ServingInfo from '../../components/ServingInfo/ServingInfo';
import ReplacementMenu from '../../components/ReplacementMenu/ReplacementMenu';
import './ProductDetailScreen.css';

const ProductListTypes = {
    FAVORITES: 'favourites',
    PHASE1: 'phase1',
    PHASE2: 'phase2',
    PHASE3: 'phase3'
};

// Helper function to convert FODMAP levels for user-created products
const convertUserCreatedFodmapLevels = (product) => {
    if (!product) return product;

    // Convert each FODMAP level: 0 -> 3 (high), 1 -> 2 (medium), 2 -> 1 (low)
    const convertLevel = (level) => {
        switch (level) {
            case 0: return 3; // high
            case 1: return 2; // medium
            case 2: return 1; // low
            default: return level;
        }
    };

    return {
        ...product,
        fructose_level: convertLevel(product.fructose_level),
        lactose_level: convertLevel(product.lactose_level),
        fructan_level: convertLevel(product.fructan_level),
        mannitol_level: convertLevel(product.mannitol_level),
        sorbitol_level: convertLevel(product.sorbitol_level),
        gos_level: convertLevel(product.gos_level),
        servings: product.servings?.map(serving => ({
            ...serving,
            fructose_level: convertLevel(serving.fructose_level),
            lactose_level: convertLevel(serving.lactose_level),
            fructan_level: convertLevel(serving.fructan_level),
            mannitol_level: convertLevel(serving.mannitol_level),
            sorbitol_level: convertLevel(serving.sorbitol_level),
            gos_level: convertLevel(serving.gos_level)
        }))
    };
};

const ProductDetailScreen = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const productName = location.state?.productName;
    const isUserCreated = location.state?.isUserCreated;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedServing, setSelectedServing] = useState(null);
    const [addingToList, setAddingToList] = useState(false);
    const [productLists, setProductLists] = useState([]);

    // Check which lists contain the product
    const checkProductLists = async (productData) => {
        try {
            const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';
            const productIdToUse = productData.id || productData.product_id || productId;

            const response = await fetch(`/users/${telegramId}/lists/check-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productIdToUse
                })
            });

            if (!response.ok) {
                throw new Error('Failed to check product lists');
            }

            const data = await response.json();
            setProductLists(data.exists_in_lists || []);
        } catch (err) {
            console.error('Error checking product lists:', err);
        }
    };

    // Fetch product data
    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);

            try {
                // Get Telegram user ID or use a default for development
                const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

                let response;

                if (isUserCreated) {
                    // Use the user-created products endpoint
                    response = await fetch(`/users/${telegramId}/products`);
                } else if (productName) {
                    // If we have the product name, use the POST /products/get-by-name endpoint
                    response = await fetch('/products/get-by-name', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: productName,
                            telegramId: telegramId
                        }),
                    });
                } else {
                    // Fallback to fetch by ID if name is not available
                    response = await fetch(`/products/${productId}/${telegramId}`);
                }

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                console.log('API Response:', data);

                if (isUserCreated) {
                    // Find the specific user-created product by ID
                    const userProduct = data.products.find(p => p.user_product_id.toString() === productId);
                    if (userProduct) {
                        const productData = {
                            id: userProduct.user_product_id,
                            name: userProduct.name,
                            fructose_level: userProduct.fructose_level,
                            lactose_level: userProduct.lactose_level,
                            fructan_level: userProduct.fructan_level,
                            mannitol_level: userProduct.mannitol_level,
                            sorbitol_level: userProduct.sorbitol_level,
                            gos_level: userProduct.gos_level,
                            servings: [{
                                serving_id: 1,
                                serving_size: userProduct.serving_title || "1 порция",
                                serving_amount_grams: 0,
                                fructose_level: userProduct.fructose_level,
                                lactose_level: userProduct.lactose_level,
                                fructan_level: userProduct.fructan_level,
                                mannitol_level: userProduct.mannitol_level,
                                sorbitol_level: userProduct.sorbitol_level,
                                gos_level: userProduct.gos_level
                            }]
                        };
                        // Convert FODMAP levels for user-created products
                        const convertedProductData = convertUserCreatedFodmapLevels(productData);
                        setProduct(convertedProductData);
                        setSelectedServing(convertedProductData.servings[0]);
                    } else {
                        setError('User-created product not found');
                    }
                } else if (data.products && Array.isArray(data.products)) {
                    if (data.products.length > 0) {
                        const productData = data.products[0];
                        setProduct(productData);
                        await checkProductLists(productData);

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

                        // Set favorite status (if available in the API)
                        setIsFavorite(productData.is_favorite || false);
                    } else {
                        setError('No products found');
                    }
                } else if (data.product) {
                    const productData = data.product;
                    setProduct(productData);
                    await checkProductLists(productData);

                    // Set the first serving as the selected serving if available
                    if (productData.servings && productData.servings.length > 0) {
                        // Filter out duplicate servings
                        const uniqueServingTitles = new Set();
                        const uniqueServings = productData.servings
                            .filter(serving => {
                                const servingSize = serving.serving_size || "1 порция";
                                if (uniqueServingTitles.has(servingSize)) {
                                    return false; // Skip duplicates
                                }
                                uniqueServingTitles.add(servingSize);
                                return true;
                            })
                            .sort((a, b) => (a.serving_amount_grams || 0) - (b.serving_amount_grams || 0));

                        productData.servings = uniqueServings;
                        setSelectedServing(uniqueServings[0]);
                    } else {
                        // Create a serving from the product data if servings array doesn't exist
                        const serving = {
                            serving_id: 1,
                            serving_size: productData.serving_title || "1 порция",
                            serving_amount_grams: productData.serving_amount_grams,
                            fructose_level: productData.fructose_level,
                            lactose_level: productData.lactose_level,
                            fructan_level: productData.fructan_level,
                            mannitol_level: productData.mannitol_level,
                            sorbitol_level: productData.sorbitol_level,
                            gos_level: productData.gos_level
                        };

                        productData.servings = [serving];
                        setSelectedServing(serving);
                    }

                    setIsFavorite(productData.is_favorite || false);
                } else {
                    const productData = data;
                    setProduct(productData);
                    await checkProductLists(productData);

                    // Set the first serving as the selected serving if available
                    if (productData.servings && productData.servings.length > 0) {
                        // Filter out duplicate servings
                        const uniqueServingTitles = new Set();
                        const uniqueServings = productData.servings
                            .filter(serving => {
                                const servingSize = serving.serving_size || "1 порция";
                                if (uniqueServingTitles.has(servingSize)) {
                                    return false; // Skip duplicates
                                }
                                uniqueServingTitles.add(servingSize);
                                return true;
                            })
                            .sort((a, b) => (a.serving_amount_grams || 0) - (b.serving_amount_grams || 0));

                        productData.servings = uniqueServings;
                        setSelectedServing(uniqueServings[0]);
                    } else {
                        // Create a serving from the product data if servings array doesn't exist
                        const serving = {
                            serving_id: 1,
                            serving_size: productData.serving_title || "1 порция",
                            serving_amount_grams: productData.serving_amount_grams,
                            fructose_level: productData.fructose_level,
                            lactose_level: productData.lactose_level,
                            fructan_level: productData.fructan_level,
                            mannitol_level: productData.mannitol_level,
                            sorbitol_level: productData.sorbitol_level,
                            gos_level: productData.gos_level
                        };

                        productData.servings = [serving];
                        setSelectedServing(serving);
                    }

                    setIsFavorite(productData.is_favorite || false);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to load product details. Please try again later.');
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId, productName]);

    // Handle serving selection
    const handleSelectServing = (serving) => {
        setSelectedServing(serving);
    };

    // Handle going back
    const handleGoBack = () => {
        navigate(-1);
    };

    // Add or remove product from a specific list
    const addProductToList = async (listType) => {
        if (!product || addingToList) return;

        try {
            setAddingToList(true);
            const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
            if (!telegramId) {
                throw new Error('Telegram user ID not found');
            }

            const productIdToUse = product.id || product.product_id || productId;
            const isInList = productLists.includes(listType);

            const endpoint = isInList ? 'remove-product' : 'add-product';
            const method = isInList ? 'DELETE' : 'POST';

            const response = await fetch(`/users/${telegramId}/lists/${endpoint}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productIdToUse,
                    list_type: listType
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isInList ? 'remove from' : 'add to'} ${listType} list`);
            }

            // Refresh product lists after successful operation
            await checkProductLists(product);

        } catch (err) {
            console.error('Error modifying product list:', err);
            if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.showPopup({
                    title: 'Ошибка',
                    message: 'Не удалось изменить список',
                    buttons: [{ type: 'ok' }]
                });
            }
        } finally {
            setAddingToList(false);
        }
    };

    // Button handlers for each list type
    const handleFavorites = () => addProductToList(ProductListTypes.FAVORITES);
    const handlePhase1 = () => addProductToList(ProductListTypes.PHASE1);
    const handlePhase2 = () => addProductToList(ProductListTypes.PHASE2);
    const handlePhase3 = () => addProductToList(ProductListTypes.PHASE3);

    // Handle sharing
    const handleShare = () => {
        if (!product) return;

        if (window.Telegram && window.Telegram.WebApp) {
            // Use Telegram's native sharing if available
            window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=Check out this low-FODMAP food: ${product.name}`);
        } else {
            // Fallback to Web Share API if available
            if (navigator.share) {
                navigator.share({
                    title: product.name,
                    text: `Check out this low-FODMAP food: ${product.name}`,
                    url: window.location.href,
                });
            } else {
                // Copy to clipboard as last resort
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert('Link copied to clipboard!'))
                    .catch(err => console.error('Could not copy text: ', err));
            }
        }
    };

    // Handle info button click
    const handleInfoClick = () => {
        // This could open a modal with more information about FODMAP ratings
        alert('This shows detailed FODMAP information for the product');
    };

    // Add Telegram WebApp back button functionality
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.onEvent('backButtonClicked', handleGoBack);

            return () => {
                window.Telegram.WebApp.BackButton.hide();
                window.Telegram.WebApp.offEvent('backButtonClicked', handleGoBack);
            };
        }
    }, []);

    return (
        <div className="product-detail-container">
            {!isUserCreated && (
                <div className="buttons-row">
                    <button className="icon-button" onClick={handleFavorites} disabled={addingToList}>
                        <img
                            src="/icons/back-button.svg"
                            alt="Add to Favorites"
                            style={{ filter: productLists.includes(ProductListTypes.FAVORITES) ? 'invert(42%) sepia(93%) saturate(437%) hue-rotate(101deg) brightness(92%) contrast(92%)' : 'none' }}
                        />
                    </button>
                    <button className="icon-button" onClick={handlePhase1} disabled={addingToList}>
                        <img
                            src="/icons/favorite-button.svg"
                            alt="Add to Phase 1"
                            style={{ filter: productLists.includes(ProductListTypes.PHASE1) ? 'invert(42%) sepia(93%) saturate(437%) hue-rotate(101deg) brightness(92%) contrast(92%)' : 'none' }}
                        />
                    </button>
                    <button className="icon-button" onClick={handlePhase2} disabled={addingToList}>
                        <img
                            src="/icons/share-button.svg"
                            alt="Add to Phase 2"
                            style={{ filter: productLists.includes(ProductListTypes.PHASE2) ? 'invert(42%) sepia(93%) saturate(437%) hue-rotate(101deg) brightness(92%) contrast(92%)' : 'none' }}
                        />
                    </button>
                    <button className="icon-button" onClick={handlePhase3} disabled={addingToList}>
                        <img
                            src="/icons/info-button.svg"
                            alt="Add to Phase 3"
                            style={{ filter: productLists.includes(ProductListTypes.PHASE3) ? 'invert(42%) sepia(93%) saturate(437%) hue-rotate(101deg) brightness(92%) contrast(92%)' : 'none' }}
                        />
                    </button>
                </div>
            )}

            <div className="product-detail-content">
                {loading ? (
                    <LoadingSpinner size="large" />
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : product ? (
                    <div>
                        <h1 className="product-name-heading">{product.name}</h1>

                        {/* Display serving information */}
                        {product.servings && product.servings.length > 0 && selectedServing && (
                            <ServingInfo
                                servings={product.servings}
                                selectedServing={selectedServing}
                                onSelectServing={handleSelectServing}
                            />
                        )}
                        <div className="divider2"></div>

                        {/* Display replacement menu if replacement_name exists and not a user-created product */}
                        {!isUserCreated && product.replacement_name && (
                            <ReplacementMenu replacementName={product.replacement_name} />
                        )}

                        {/* More product details will be added later */}
                    </div>
                ) : (
                    <div className="error-message">Product not found</div>
                )}
            </div>

            <div className="nav-spacer"></div>

            <div className="bottom-nav-container">
                <BottomNavBar />
            </div>
        </div>
    );
};

export default ProductDetailScreen; 