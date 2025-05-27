import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ServingInfo from '../../components/ServingInfo/ServingInfo';
import './ProductDetailOverlay.css';

const ProductDetailOverlay = ({ product, onClose, onSelectProduct }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productData, setProductData] = useState(null);
    const [selectedServing, setSelectedServing] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);

            try {
                // Get Telegram user ID or use a default for development
                const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

                // Check if it's a user-created product
                if (product.user_created) {
                    // For user-created products, we need to fetch the full details
                    const response = await fetch(`/users/${telegramId}/products`);

                    if (!response.ok) {
                        throw new Error(`API request failed with status ${response.status}`);
                    }

                    const data = await response.json();

                    // Find the specific product by ID
                    const userProduct = data.products.find(p =>
                        p.user_product_id === product.product_id ||
                        p.user_product_id === product.id
                    );

                    if (userProduct) {
                        // Create product data with correct FODMAP values from the API
                        const productData = {
                            product_id: userProduct.user_product_id,
                            name: userProduct.name,
                            fructose_level: userProduct.fructose_level,
                            lactose_level: userProduct.lactose_level,
                            fructan_level: userProduct.fructan_level,
                            mannitol_level: userProduct.mannitol_level,
                            sorbitol_level: userProduct.sorbitol_level,
                            gos_level: userProduct.gos_level,
                            user_created: true, // Mark as user-created for FODMAP level determination
                            // Create a single serving based on the product data
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

                        console.log("User product details:", userProduct); // Debug log

                        setProductData(productData);
                        setSelectedServing(productData.servings[0]);
                    } else {
                        throw new Error('User-created product not found');
                    }

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
                        name: product.name,
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
                const response = await fetch(`/products/${product.product_id}/${telegramId}`);

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
    }, [product.product_id, product.name, product.user_created, product.id]);

    // Add Telegram WebApp back button functionality
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;

            // Show the back button
            tg.BackButton.show();

            // Set up event listener for back button
            tg.BackButton.onClick(onClose);

            // Cleanup function
            return () => {
                tg.BackButton.offClick(onClose);
            };
        }
    }, [onClose]);

    const handleSelectServing = (serving) => {
        setSelectedServing(serving);
    };

    const handleAddProduct = () => {
        if (productData && selectedServing) {
            // Create a product object with the selected serving data and preserve user_created flag
            const productToAdd = {
                ...productData,
                user_created: product.user_created || productData.user_created,
                selected_serving: selectedServing
            };

            // Call the onSelectProduct function from props
            onSelectProduct(productToAdd);

            // Close the overlay
            onClose();
        }
    };

    // Check if this is a user-created product
    const isUserCreated = product.user_created || (productData && productData.user_created);

    return (
        <div className="product-detail-overlay">
            <div className="product-detail-header">
                <button className="back-button-overlay" onClick={onClose}>
                    <img src="/icons/back-arrow.svg" alt="Back" />
                </button>
                <h1 className="product-name-heading-overlay">
                    {productData?.name || product.name}
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
                            isUserCreated={isUserCreated}
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
    );
};

export default ProductDetailOverlay; 