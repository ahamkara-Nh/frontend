import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProductScreen.css';

const AddProductScreen = () => {
    const navigate = useNavigate();
    const [productName, setProductName] = useState('');
    const [servingSize, setServingSize] = useState('');
    const [fodmapLevels, setFodmapLevels] = useState({
        fructose: 0,
        lactose: 0,
        mannitol: 0,
        sorbitol: 0,
        gos: 0,
        fructans: 0
    });

    const handleBack = () => {
        navigate(-1);
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving product:', { productName, servingSize, fodmapLevels });
        navigate(-1);
    };

    const handleFodmapLevelChange = (fodmap, level) => {
        setFodmapLevels(prev => ({
            ...prev,
            [fodmap]: level
        }));
    };

    const handleAISearch = () => {
        // TODO: Implement AI search functionality
        console.log('AI search clicked');
    };

    const handleAddServing = () => {
        // TODO: Implement add serving functionality
        console.log('Add serving clicked');
    };

    // Add Telegram WebApp back button functionality
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.onEvent('backButtonClicked', handleBack);

            return () => {
                window.Telegram.WebApp.BackButton.hide();
                window.Telegram.WebApp.offEvent('backButtonClicked', handleBack);
            };
        }
    }, [navigate]);

    const fodmapTypes = [
        { id: 'fructose', name: 'Фруктоза' },
        { id: 'lactose', name: 'Лактоза' },
        { id: 'mannitol', name: 'Маннитол' },
        { id: 'sorbitol', name: 'Сорбитол' },
        { id: 'gos', name: 'ГОС' },
        { id: 'fructans', name: 'Фруктаны' }
    ];

    return (
        <div className="add-product-screen">
            <div className="add-product-content">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Введите название продукта ...."
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="product-input"
                    />
                </div>
                <div className="divider3" />

                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Порция ..."
                        value={servingSize}
                        onChange={(e) => setServingSize(e.target.value)}
                        className="serving-input"
                    />
                </div>

                <div className="divider3" />

                <div className="fodmap-section">
                    <div className="fodmap-header">
                        <h2>FODMAP</h2>
                        <button className="ai-button" onClick={handleAISearch}>
                            Найти с помощью ИИ
                        </button>
                    </div>

                    <div className="fodmap-grid">
                        {fodmapTypes.map((fodmap) => (
                            <div key={fodmap.id} className="fodmap-row">
                                <span className="fodmap-name">{fodmap.name}</span>
                                <div className="level-picker">
                                    {[0, 1, 2].map((level) => (
                                        <button
                                            key={level}
                                            className={`level-button ${level === fodmapLevels[fodmap.id] ? 'active' : ''} level-${level}`}
                                            onClick={() => handleFodmapLevelChange(fodmap.id, level)}
                                        >
                                            {level === fodmapLevels[fodmap.id] && <span className="checkmark">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="add-serving-button" onClick={handleAddServing}>
                    <span>Добавить порцию</span>
                    <span className="plus-icon">+</span>
                </button>

                <div className="button-group">
                    <button className="cancel-button" onClick={handleBack}>
                        Отмена
                    </button>
                    <button className="save-button2" onClick={handleSave}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductScreen; 