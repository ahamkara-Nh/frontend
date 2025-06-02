import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CategorySelectionScreen.css';
import radioDot from '../../assets/icons/radio-dot.svg';

const CategorySelectionScreen = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [disabledCategories, setDisabledCategories] = useState({});
    const [dataLoading, setDataLoading] = useState(true);

    // FODMAP categories for reintroduction
    const categories = [
        { id: 'lactose', name: 'Лактоза' },
        { id: 'fructose', name: 'Фруктоза' },
        { id: 'mannitol', name: 'Маннитол' },
        { id: 'sorbitol', name: 'Сорбитол' },
        { id: 'gos', name: 'ГОС' },
        { id: 'fructan', name: 'Фруктаны' },
    ];

    useEffect(() => {
        // Setup Telegram back button if in Telegram WebApp
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.BackButton.show();
            const handleBackButtonClick = () => {
                navigate(-1);
            };
            tg.onEvent('backButtonClicked', handleBackButtonClick);

            return () => {
                tg.offEvent('backButtonClicked', handleBackButtonClick);
                tg.BackButton.hide();
            };
        }
    }, [navigate]);

    useEffect(() => {
        const fetchPhase2TrackingData = async () => {
            setDataLoading(true);
            try {
                const telegramId = localStorage.getItem('telegramId') ||
                    window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

                if (!telegramId) {
                    console.error('Telegram ID not found');
                    setDataLoading(false);
                    return;
                }

                const response = await axios.get(`/users/${telegramId}/phase2-tracking`);
                const data = response.data;

                // Process disabled categories
                const disabled = {};
                categories.forEach(category => {
                    if (data[category.id] === 1) {
                        disabled[category.id] = true;
                    }
                });
                setDisabledCategories(disabled);

                // Set current group if exists
                if (data.current_group) {
                    setSelectedCategory(data.current_group);
                }
            } catch (err) {
                // If 404, just continue with default screen
                if (err.response && err.response.status === 404) {
                    console.log('No phase2 tracking data found, using default screen');
                } else {
                    console.error('Error fetching phase2 tracking data:', err);
                }
            } finally {
                setDataLoading(false);
            }
        };

        fetchPhase2TrackingData();
    }, []);

    const handleCategorySelect = (categoryId) => {
        // Don't allow selecting disabled categories
        if (disabledCategories[categoryId]) {
            return;
        }
        setSelectedCategory(categoryId);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSave = async () => {
        if (!selectedCategory) {
            return;
        }

        // Check if we're changing from an existing current_group
        const telegramId = localStorage.getItem('telegramId') ||
            window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

        try {
            // If we have Telegram SDK and we're changing the current group
            const tg = window.Telegram?.WebApp;
            const hasCurrentGroup = await checkCurrentGroup(telegramId);

            if (hasCurrentGroup && tg && selectedCategory !== hasCurrentGroup) {
                // Show confirmation dialog
                tg.showConfirm(
                    'Вы уверены, что хотите изменить группу до завершения текущей?',
                    (confirmed) => {
                        if (confirmed) {
                            saveCategory(telegramId);
                        }
                    }
                );
            } else {
                // No current group or same group, proceed with save
                saveCategory(telegramId);
            }
        } catch (err) {
            console.error('Error checking current group:', err);
            // Fall back to direct save if there's an error checking
            saveCategory(telegramId);
        }
    };

    // Helper function to check if there's a current group
    const checkCurrentGroup = async (telegramId) => {
        if (!telegramId) {
            return null;
        }

        try {
            const response = await axios.get(`/users/${telegramId}/phase2-tracking`);
            return response.data.current_group || null;
        } catch (err) {
            return null;
        }
    };

    // Helper function to save the category
    const saveCategory = async (telegramId) => {
        if (!telegramId) {
            setError('Telegram ID not found');
            return;
        }

        setLoading(true);
        try {
            // Save the selected category to the backend
            await axios.put(`/users/${telegramId}/phase2-tracking`, {
                current_group: selectedCategory
            });

            // Navigate back or to the next screen
            navigate(-1);
        } catch (err) {
            console.error('Error saving category:', err);
            setError('Failed to save category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="category-selection-screen">
            <h1 className="category-selection-header">
                Категории для повторного введения в рацион:
            </h1>
            {dataLoading ? (
                <div className="loading-indicator">Загрузка...</div>
            ) : (
                <div className="category-selection-list">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={`category-selection-item ${selectedCategory === category.id ? 'active' : ''} ${disabledCategories[category.id] ? 'disabled' : ''}`}
                            onClick={() => handleCategorySelect(category.id)}
                        >
                            <div className={`category-selection-radio ${selectedCategory === category.id ? 'active' : ''} ${disabledCategories[category.id] ? 'disabled' : ''}`}>
                                {selectedCategory === category.id && (
                                    <img src={radioDot} alt="Selected" className="category-selection-radio-dot" />
                                )}
                            </div>
                            <div className="category-selection-name">
                                <span>{category.name}</span>
                                {disabledCategories[category.id] && <span className="category-completed"> (завершено)</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {error && <p className="category-selection-error">{error}</p>}
            <div className="category-selection-buttons">
                <button
                    className="category-selection-button cancel"
                    onClick={handleCancel}
                    disabled={loading}
                >
                    Отмена
                </button>
                <button
                    className="category-selection-button save"
                    onClick={handleSave}
                    disabled={!selectedCategory || loading || selectedCategory === dataLoading?.current_group}
                >
                    Сохранить
                </button>
            </div>
        </div>
    );
};

export default CategorySelectionScreen; 