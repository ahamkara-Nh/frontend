import React, { useState, useEffect } from 'react';
import './AllergyPickerMenu.css';
import { getBaseUrl } from '../../utils/api';

const ALLERGY_OPTIONS = [
    'орехи', 'арахис', 'глютен', 'яйца', 'рыба', 'соя'
];

const ALLERGY_MAP = {
    'орехи': 'allergy_nuts',
    'арахис': 'allergy_peanut',
    'глютен': 'allergy_gluten',
    'яйца': 'allergy_eggs',
    'рыба': 'allergy_fish',
    'соя': 'allergy_soy'
};

const AllergyPickerMenu = ({ isOpen, onClose }) => {
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get Telegram user ID
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

    // Handle back button
    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        if (isOpen) {
            // Enable back button when menu is open
            tg?.BackButton?.show();
            // Add event listener for back button
            const handleBackClick = () => {
                onClose();
            };
            tg?.BackButton?.onClick(handleBackClick);

            // Cleanup
            return () => {
                tg?.BackButton?.offClick(handleBackClick);
                if (!isOpen) {
                    tg?.BackButton?.hide();
                }
            };
        } else {
            tg?.BackButton?.hide();
        }
    }, [isOpen, onClose]);

    // Fetch current allergies when menu opens
    useEffect(() => {
        const fetchAllergies = async () => {
            if (!isOpen || !telegramId) return;

            try {
                setLoading(true);
                setError(null);
                const baseUrl = getBaseUrl();
                const response = await fetch(`${baseUrl}/users/${telegramId}/preferences`);

                if (!response.ok) {
                    throw new Error('Failed to fetch allergies');
                }

                const data = await response.json();
                const preferences = data.preferences;

                // Convert preferences back to allergy names
                const currentAllergies = Object.entries(ALLERGY_MAP)
                    .filter(([_, key]) => preferences[key])
                    .map(([name]) => name);

                setSelectedAllergies(currentAllergies);
            } catch (err) {
                console.error('Error fetching allergies:', err);
                setError('Failed to load allergies');
            } finally {
                setLoading(false);
            }
        };

        fetchAllergies();
    }, [isOpen, telegramId]);

    const toggleAllergy = (allergy) => {
        setSelectedAllergies(prev =>
            prev.includes(allergy)
                ? prev.filter(item => item !== allergy)
                : [...prev, allergy]
        );
    };

    const handleSave = async () => {
        if (!telegramId) {
            setError('User ID not available');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const preferences = ALLERGY_OPTIONS.reduce((acc, option) => {
                acc[ALLERGY_MAP[option]] = selectedAllergies.includes(option);
                return acc;
            }, {});

            const baseUrl = getBaseUrl();
            const response = await fetch(`${baseUrl}/users/${telegramId}/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            if (!response.ok) {
                throw new Error('Failed to update allergies');
            }

            onClose();
        } catch (err) {
            console.error('Error updating allergies:', err);
            setError('Failed to update allergies');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`allergy-picker-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className={`allergy-picker-container ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="allergy-picker-header">
                    <h2>Аллергии</h2>
                    {error && <div className="error-message">{error}</div>}
                </div>

                <div className="allergy-options">
                    {ALLERGY_OPTIONS.map(allergy => (
                        <button
                            key={allergy}
                            onClick={() => toggleAllergy(allergy)}
                            className={`allergy-option ${selectedAllergies.includes(allergy) ? 'selected' : ''}`}
                            disabled={loading}
                        >
                            {allergy}
                        </button>
                    ))}
                </div>

                <div className="allergy-picker-actions">
                    <button
                        className="save-button"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AllergyPickerMenu; 