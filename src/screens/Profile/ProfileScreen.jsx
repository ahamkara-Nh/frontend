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
    const [preferences, setPreferences] = useState({
        daily_reminders: 0,
        update_notifications: 0
    });
    const [updatingNotification, setUpdatingNotification] = useState(null);

    // Get Telegram user data
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const username = telegramUser?.username || 'default_user';
    const firstName = telegramUser?.first_name;
    const lastName = telegramUser?.last_name;
    const telegramId = telegramUser?.id;

    // Display format: @username if available, otherwise "First Last" or just "First" if no last name
    const displayName = username ? `@${username}` : firstName ? `${firstName}${lastName ? ` ${lastName}` : ''}` : 'default_user';

    const fetchUserPreferences = async () => {
        if (!telegramId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/users/${telegramId}/preferences`);

            if (!response.ok) {
                throw new Error('Failed to fetch preferences');
            }

            const data = await response.json();
            const userPreferences = data.preferences;

            // Convert preferences back to allergy names
            const allergies = Object.entries(ALLERGY_MAP)
                .filter(([_, key]) => userPreferences[key])
                .map(([name]) => name);

            setCurrentAllergies(allergies);
            setPreferences({
                daily_reminders: userPreferences.daily_reminders,
                update_notifications: userPreferences.update_notifications
            });
        } catch (err) {
            console.error('Error fetching preferences:', err);
            setError('Failed to load preferences');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user preferences
    useEffect(() => {
        fetchUserPreferences();
    }, [telegramId]);

    const handleEditAllergies = () => {
        setIsAllergyMenuOpen(true);
    };

    const handleCloseAllergyMenu = () => {
        setIsAllergyMenuOpen(false);
        // Refresh allergies when menu closes
        fetchUserPreferences();
    };

    const toggleNotification = async (type) => {
        if (!telegramId) return;

        try {
            setUpdatingNotification(type);

            // Create updated preferences object with the toggled value
            const updatedPreferences = { ...preferences };
            updatedPreferences[type] = preferences[type] === 1 ? 0 : 1;

            const response = await fetch(`/users/${telegramId}/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPreferences)
            });

            if (!response.ok) {
                throw new Error(`Failed to update ${type}`);
            }

            // Update local state with the new values
            setPreferences(updatedPreferences);
        } catch (err) {
            console.error(`Error updating ${type}:`, err);
            // Revert to previous state if there's an error
            fetchUserPreferences();
        } finally {
            setUpdatingNotification(null);
        }
    };

    const handleDownload = (type) => {
        // Show Telegram popup notification
        if (window.Telegram?.WebApp?.showPopup) {
            window.Telegram.WebApp.showPopup({
                title: 'Информация',
                message: 'Функция скоро будет добавлена',
                buttons: [{ type: 'ok' }]
            });
        } else {
            // Fallback for when Telegram is not available (e.g., in browser)
            alert('Функция скоро будет добавлена');
        }
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
                        <div
                            className={`notification-toggle ${preferences.daily_reminders === 1 ? 'checked' : ''} ${updatingNotification === 'daily_reminders' ? 'updating' : ''}`}
                            onClick={() => updatingNotification === null && toggleNotification('daily_reminders')}
                        >
                            {preferences.daily_reminders === 1 && (
                                <img src="/icons/check-icon.svg" alt="Включено" className="check-icon" />
                            )}
                        </div>
                    </div>
                    <div className="notification-row">
                        <span className="notification-text">Обновления приложения</span>
                        <div
                            className={`notification-toggle ${preferences.update_notifications === 1 ? 'checked' : ''} ${updatingNotification === 'update_notifications' ? 'updating' : ''}`}
                            onClick={() => updatingNotification === null && toggleNotification('update_notifications')}
                        >
                            {preferences.update_notifications === 1 && (
                                <img src="/icons/check-icon.svg" alt="Включено" className="check-icon" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="download-section">
                    <span className="heading">Скачать дневник:</span>
                    <div className="download-buttons">
                        <button className="download-button" onClick={() => handleDownload('pdf')}>PDF</button>
                        <button className="download-button" onClick={() => handleDownload('excel')}>Excel</button>
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