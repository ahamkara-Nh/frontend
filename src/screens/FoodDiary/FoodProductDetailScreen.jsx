import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ServingInfo from '../../components/ServingInfo/ServingInfo';
import './FoodProductDetailScreen.css';

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

const FoodProductDetailScreen = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const productName = location.state?.productName;
    const isUserCreated = location.state?.isUserCreated;
    const onAddProduct = location.state?.onAddProduct;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedServing, setSelectedServing] = useState(null);

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
                        setError('No products found');
                    }
                } else if (data.product) {
                    const productData = data.product;
                    setProduct(productData);

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
                } else {
                    const productData = data;
                    setProduct(productData);

                    // Set the first serving as the selected serving if available
                    if (productData.servings && productData.servings.length > 0) {
                        setSelectedServing(productData.servings[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching product details:', err);
                setError('Failed to load product details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId, productName, isUserCreated]);

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

    const handleSelectServing = (serving) => {
        setSelectedServing(serving);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleAddProduct = () => {
        if (onAddProduct && product) {
            // Add the selected serving information to the product
            const productWithServing = {
                ...product,
                selectedServing: selectedServing
            };
            onAddProduct(productWithServing);
            navigate(-1);
        } else {
            // If no callback provided, just go back
            navigate(-1);
        }
    };

    if (loading) {
        return (
            <div className="food-product-detail-container">
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="food-product-detail-container">
                <div className="error-message">{error}</div>
                <button onClick={handleGoBack} className="back-button">Назад</button>
            </div>
        );
    }

    return (
        <div className="food-product-detail-container">
            <div className="add-product-button-container">
                <button className="add-product-button" onClick={handleAddProduct}>
                    Добавить продукт
                </button>
            </div>

            <div className="food-product-detail-content">
                {product && (
                    <>
                        <h1 className="product-name-heading">{product.name}</h1>

                        {product.servings && product.servings.length > 0 && (
                            <ServingInfo
                                servings={product.servings}
                                selectedServing={selectedServing}
                                onSelectServing={handleSelectServing}
                            />
                        )}

                        <div className="divider2"></div>

                        <div className="fodmap-levels">
                            <h2 className="section-title">FODMAP уровни</h2>
                            <div className="fodmap-grid">
                                <div className="fodmap-item">
                                    <span className="fodmap-name">Фруктоза</span>
                                    <div className={`fodmap-level level-${selectedServing?.fructose_level || product.fructose_level}`}></div>
                                </div>
                                <div className="fodmap-item">
                                    <span className="fodmap-name">Лактоза</span>
                                    <div className={`fodmap-level level-${selectedServing?.lactose_level || product.lactose_level}`}></div>
                                </div>
                                <div className="fodmap-item">
                                    <span className="fodmap-name">Фруктаны</span>
                                    <div className={`fodmap-level level-${selectedServing?.fructan_level || product.fructan_level}`}></div>
                                </div>
                                <div className="fodmap-item">
                                    <span className="fodmap-name">Маннитол</span>
                                    <div className={`fodmap-level level-${selectedServing?.mannitol_level || product.mannitol_level}`}></div>
                                </div>
                                <div className="fodmap-item">
                                    <span className="fodmap-name">Сорбитол</span>
                                    <div className={`fodmap-level level-${selectedServing?.sorbitol_level || product.sorbitol_level}`}></div>
                                </div>
                                <div className="fodmap-item">
                                    <span className="fodmap-name">ГОС</span>
                                    <div className={`fodmap-level level-${selectedServing?.gos_level || product.gos_level}`}></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="nav-spacer"></div>
            <div className="bottom-nav-container">
                <BottomNavBar />
            </div>
        </div>
    );
};

export default FoodProductDetailScreen; 