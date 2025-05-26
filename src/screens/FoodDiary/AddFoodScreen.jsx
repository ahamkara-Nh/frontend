import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddFoodScreen.css';

const AddFoodScreen = () => {
    const navigate = useNavigate();
    const [foodName, setFoodName] = useState('');
    const [servingSize, setServingSize] = useState('');
    const [recipe, setRecipe] = useState('');

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSave = () => {
        // Logic to save food entry would go here
        console.log('Saving food entry:', { foodName, servingSize, recipe });
        navigate(-1);
    };

    const handleAddFromList = () => {
        // Navigate to product list
        console.log('Add from product list clicked');
    };

    const handleCreateProduct = () => {
        // Navigate to create product screen
        console.log('Create product clicked');
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
        </div>
    );
};

export default AddFoodScreen; 