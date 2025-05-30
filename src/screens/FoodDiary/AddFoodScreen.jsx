import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductSelectionOverlay from './ProductSelectionOverlay';
import './AddFoodScreen.css';

const AddFoodScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [foodName, setFoodName] = useState('');
    const [servingSize, setServingSize] = useState('');
    const [recipe, setRecipe] = useState('');
    const [showProductSelection, setShowProductSelection] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCancel = () => {
        navigate(-1);
    };

    // Manage Telegram WebApp back button
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;

            // Create a handler that checks if there's an overlay open first
            const handleBackButton = () => {
                if (showProductSelection) {
                    // If product selection overlay is open, close it instead of going back
                    setShowProductSelection(false);
                } else {
                    // Otherwise navigate back
                    navigate(-1);
                }
            };

            // Show the back button
            tg.BackButton.show();

            // Set up event listener for back button
            tg.BackButton.onClick(handleBackButton);

            // Cleanup function
            return () => {
                tg.BackButton.hide();
                tg.BackButton.offClick(handleBackButton);
            };
        }
    }, [navigate, showProductSelection]);

    const handleSave = async () => {
        // Get Telegram user ID
        const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

        try {
            setLoading(true);
            setError(null);

            // Format products for the API request
            const foods = selectedProducts.map(product => {
                console.log('Processing product:', product);
                return {
                    id: product.id || product.product_id,
                    is_user_product: !!product.user_created
                };
            });

            const requestPayload = {
                memo: recipe.trim(),
                foods: foods
            };

            // Log the complete request payload
            console.log('Sending food-notes request:', {
                url: `/users/${telegramId}/food-notes`,
                body: requestPayload,
                selectedProducts
            });

            // Make API request
            const response = await fetch(`/users/${telegramId}/food-notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestPayload),
            });

            // Log response status
            console.log('Response status:', response.status);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                    console.log('Error response:', errorData);
                } catch (e) {
                    console.log('Could not parse error response as JSON');
                }
                throw new Error(errorData?.message || `Failed to save food entry (status ${response.status})`);
            }

            // Navigate back after successful save
            navigate(-1);
        } catch (err) {
            console.error('Error saving food entry:', err);
            setError(err.message || 'Failed to save food entry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddFromList = () => {
        setShowProductSelection(true);
    };

    const handleCloseProductSelection = () => {
        setShowProductSelection(false);
    };

    const handleSelectProduct = (product) => {
        console.log('Selected product:', {
            id: product.id,
            product_id: product.product_id,
            user_created: product.user_created,
            user_product_id: product.user_product_id,
            fullProduct: product
        });
        setSelectedProducts([...selectedProducts, product]);
        setShowProductSelection(false);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts.splice(index, 1);
        setSelectedProducts(updatedProducts);
    };

    const handleCreateProduct = () => {
        // Navigate to create product screen
        navigate('/products/add', { state: { returnTo: '/food-diary/add' } });
    };

    return (
        <div className="add-food-container">

            <div className="food-section">
                <h2 className="section-header">Питание:</h2>

                {selectedProducts.length > 0 && (
                    <div className="selected-products">
                        {selectedProducts.map((product, index) => (
                            <div key={index} className="selected-product-item">
                                <span>{product.name || 'Выбранный продукт'}</span>
                                <button
                                    className="remove-product-button"
                                    onClick={() => handleRemoveProduct(index)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button className="add-food-button" onClick={handleAddFromList}>
                    <span>Добавить из списка продуктов</span>
                    <div className="plus-icon">+</div>
                </button>

            </div>

            <div className="note-section">
                <h2 className="section-header">Заметка:</h2>

                <div className="note-input">
                    <textarea
                        placeholder="Ваш текст ..."
                        value={recipe}
                        onChange={(e) => setRecipe(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="buttons">
                <button className="cancel-food-button" onClick={handleCancel}>
                    Отмена
                </button>
                <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
            </div>

            {showProductSelection && (
                <ProductSelectionOverlay
                    onClose={handleCloseProductSelection}
                    onSelectProduct={handleSelectProduct}
                />
            )}
        </div>
    );
};

export default AddFoodScreen; 