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
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSave = async () => {
        // Get Telegram user ID
        const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

        if (!telegramId) {
            setError('User ID not available');
            return;
        }

        if (!productName.trim()) {
            setError('Please enter a product name');
            return;
        }

        if (!servingSize.trim()) {
            setError('Please enter a serving size');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/users/${telegramId}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: productName.trim(),
                    fructose_level: fodmapLevels.fructose,
                    lactose_level: fodmapLevels.lactose,
                    fructan_level: fodmapLevels.fructans,
                    mannitol_level: fodmapLevels.mannitol,
                    sorbitol_level: fodmapLevels.sorbitol,
                    gos_level: fodmapLevels.gos,
                    serving_title: servingSize.trim()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to save product');
            }

            // Navigate back after successful save
            navigate(-1);
        } catch (err) {
            console.error('Error saving product:', err);
            setError(err.message || 'Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
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
                {error && <div className="error-message">{error}</div>}
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Введите название продукта ...."
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="product-input"
                        disabled={loading}
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
                        disabled={loading}
                    />
                </div>

                <div className="divider3" />

                <div className="fodmap-section">
                    <div className="fodmap-header">
                        <h2>FODMAP</h2>
                        <button className="ai-button" onClick={handleAISearch} disabled={loading}>
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
                                            disabled={loading}
                                        >
                                            {level === fodmapLevels[fodmap.id] && <span className="checkmark">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="button-group">
                    <button className="cancel-button" onClick={handleBack} disabled={loading}>
                        Отмена
                    </button>
                    <button className="save-button2" onClick={handleSave} disabled={loading}>
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductScreen; 