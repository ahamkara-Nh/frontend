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

    const handleSave = () => {
        // Logic to save food entry would go here
        console.log('Saving food entry:', { foodName, servingSize, recipe, selectedProducts });
        navigate(-1);
    };

    const handleAddFromList = () => {
        setShowProductSelection(true);
    };

    const handleCloseProductSelection = () => {
        setShowProductSelection(false);
    };

    const handleSelectProduct = (product) => {
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
            <div className="food-input">
                <input
                    type="text"
                    placeholder="Введите название блюда ...."
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                />
            </div>

            <div className="dividing-line"></div>

            <div className="serving-size-input">
                <input
                    type="text"
                    placeholder="Порция ..."
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                />
            </div>

            <div className="dividing-line"></div>

            <div className="food-section">
                <h2 className="section-header">Состоит из:</h2>

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
                <h2 className="section-header">Рецепт (по желанию):</h2>

                <div className="note-input">
                    <textarea
                        placeholder="Ваш текст ..."
                        value={recipe}
                        onChange={(e) => setRecipe(e.target.value)}
                    />
                </div>
            </div>

            <div className="buttons">
                <button className="cancel-food-button" onClick={handleCancel}>
                    Отмена
                </button>
                <button className="save-button" onClick={handleSave}>
                    Сохранить
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