import React, { useState, useEffect } from 'react';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import AllergyPickerMenu from '../../components/AllergyPickerMenu/AllergyPickerMenu';
import './ProfileScreen.css';

const ALLERGY_MAP = {
    'орехи': 'allergy_nuts',
    'арахис': 'allergy_peanut',
    'глютен': 'allergy_gluten',
    'яйца': 'allergy_eggs',
    'рыба': 'allergy_fish',
    'соя': 'allergy_soy'
};

const ProfileScreen = () => {
    const [isAllergyMenuOpen, setIsAllergyMenuOpen] = useState(false);
    const [currentAllergies, setCurrentAllergies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get Telegram user data
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const username = telegramUser?.username || 'default_user';
    const firstName = telegramUser?.first_name;
    const lastName = telegramUser?.last_name;
    const telegramId = telegramUser?.id;

    // Display format: @username if available, otherwise "First Last" or just "First" if no last name
    const displayName = username ? `@${username}` : firstName ? `${firstName}${lastName ? ` ${lastName}` : ''}` : 'default_user';

    const fetchAllergies = async () => {
        if (!telegramId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/users/${telegramId}/preferences`);

            if (!response.ok) {
                throw new Error('Failed to fetch allergies');
            }

            const data = await response.json();
            const preferences = data.preferences;

            // Convert preferences back to allergy names
            const allergies = Object.entries(ALLERGY_MAP)
                .filter(([_, key]) => preferences[key])
                .map(([name]) => name);

            setCurrentAllergies(allergies);
        } catch (err) {
            console.error('Error fetching allergies:', err);
            setError('Failed to load allergies');
        } finally {
            setLoading(false);
        }
    };

    // Fetch current allergies
    useEffect(() => {
        fetchAllergies();
    }, [telegramId]);

    const handleEditAllergies = () => {
        setIsAllergyMenuOpen(true);
    };

    const handleCloseAllergyMenu = () => {
        setIsAllergyMenuOpen(false);
        // Refresh allergies when menu closes
        fetchAllergies();
    };

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-row">
                    <span className="heading">Профиль:</span>
                    <span className="value">{displayName}</span>
                </div>

                <div className="profile-row">
                    <span className="heading">Аллергии:</span>
                    <span className="value">
                        {loading ? 'Загрузка...' :
                            error ? 'Ошибка загрузки' :
                                currentAllergies.length > 0 ? currentAllergies.join(', ') : 'Нет'}
                    </span>
                    <button className="edit-button" onClick={handleEditAllergies}>
                        Изменить
                    </button>
                </div>

                <div className="notifications-section">
                    <span className="heading">Уведомления:</span>
                    <div className="notification-row">
                        <span className="notification-text">Ежедневные напоминания о заполнении дневника</span>
                        <div className="notification-toggle checked">
                            <img src="/icons/check-icon.svg" alt="Включено" className="check-icon" />
                        </div>
                    </div>
                    <div className="notification-row">
                        <span className="notification-text">Обновления приложения</span>
                        <div className="notification-toggle checked">
                            <img src="/icons/check-icon.svg" alt="Включено" className="check-icon" />
                        </div>
                    </div>
                </div>

                <div className="download-section">
                    <span className="heading">Скачать дневник:</span>
                    <div className="download-buttons">
                        <button className="download-button">PDF</button>
                        <button className="download-button">Excel</button>
                    </div>
                </div>
            </div>

            <div className="nav-spacer"></div>
            <div className="bottom-nav-container">
                <BottomNavBar />
            </div>

            <AllergyPickerMenu
                isOpen={isAllergyMenuOpen}
                onClose={handleCloseAllergyMenu}
            />
        </div>
    );
};

export default ProfileScreen; 