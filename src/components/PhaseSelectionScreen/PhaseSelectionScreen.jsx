import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhaseProgress } from '../../hooks/usePhaseProgress';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './PhaseSelectionScreen.css';

const PhaseSelectionScreen = () => {
    const navigate = useNavigate();

    // Get user ID from Telegram WebApp
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const { week, day, loading, error } = usePhaseProgress(telegramId);

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    useEffect(() => {
        // Add Telegram WebApp back button functionality
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.onEvent('backButtonClicked', handleBack);

            return () => {
                window.Telegram.WebApp.BackButton.hide();
                window.Telegram.WebApp.offEvent('backButtonClicked', handleBack);
            };
        }
    }, [navigate]);

    if (loading) {
        return (
            <div className="phase-selection-screen">
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    if (error) {
        console.error('Error loading progress data:', error);
        // Use default values if there's an error
        return renderContent(1, 1);
    }

    return renderContent(week, day);

    function renderContent(currentWeek, currentDay) {
        return (
            <div className="phase-selection-screen">
                <div className="phases-container">
                    <div className="phase-item active">
                        <div className="phase-content">
                            <h2>Этап 1: Исключение</h2>
                            <p>Неделя {currentWeek}. День {currentDay}</p>
                        </div>
                    </div>
                    <div className="phase-item disabled">
                        <div className="phase-content">
                            <h2>Этап 2: Повторное введение</h2>
                        </div>
                    </div>
                    <div className="phase-item disabled">
                        <div className="phase-content">
                            <h2>Этап 3: Персонализация</h2>
                        </div>
                    </div>
                </div>
                <button className="next-phase-button">
                    Перейти на следующий этап
                </button>
            </div>
        );
    }
};

export default PhaseSelectionScreen; 