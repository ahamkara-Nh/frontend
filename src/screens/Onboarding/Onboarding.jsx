import React, { useEffect } from 'react';
import './Onboarding.css';
import { useAuth } from '../../context/AuthContext';
import { authenticateTelegram } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const { user, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Handle manual authentication if needed
    const handleAuthenticate = async () => {
        try {
            await authenticateTelegram();
        } catch (err) {
            console.error('Authentication failed:', err);
        }
    };

    // Initialize Telegram WebApp
    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="onboarding-container">
                <div className="onboarding-text-blocks">
                    <p className="onboarding-text main">Loading...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="onboarding-container">
                <div className="onboarding-text-blocks">
                    <p className="onboarding-text main">Authentication Error</p>
                    <p className="onboarding-text sub">{error}</p>
                    <button className="onboarding-button" onClick={handleAuthenticate}>Try Again</button>
                </div>
            </div>
        );
    }

    // Main onboarding content
    return (
        <div className="onboarding-container">
            <div className="onboarding-text-blocks">
                <p className="onboarding-text main">
                    Это приложение создано, чтобы помочь вам в соблюдении диеты и сделать путь немного легче.
                </p>
                <p className="onboarding-text main">
                    Но помните: при любых вопросах о здоровье в первую очередь обращайтесь к врачу!
                </p>
                <p className="onboarding-text sub">
                    Приложение не является медицинским средством или инструментом диагностики.
                </p>
            </div>
            <button className="onboarding-button" onClick={() => navigate('/onboarding/2')}>Далее</button>
        </div>
    );
};

export default Onboarding;