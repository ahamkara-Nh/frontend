import React, { useEffect } from 'react';
import './Onboarding.css';
import { useAuth } from '../../context/AuthContext';
import { authenticateTelegram } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const { user, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const telegramUserFromHookScope = window.Telegram?.WebApp?.initDataUnsafe?.user; // For logging

    console.log('[Onboarding Render] Component rendering. isAuthenticated:', isAuthenticated, 'loading:', loading, 'error:', error, 'telegramUser?.id (from render scope):', telegramUserFromHookScope?.id);

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
        console.log('[Telegram Init Effect] Running.');
        // Initialize Telegram WebApp if available
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            // Expand the WebApp to fullscreen mode
            window.Telegram.WebApp.expand();

            // Log Telegram user data
            if (window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
                console.log('[Telegram Init Effect] Telegram User Data (Onboarding.jsx):', window.Telegram.WebApp.initDataUnsafe.user);
            } else {
                console.log('[Telegram Init Effect] Telegram User Data not found (Onboarding.jsx).');
            }
        } else {
            console.log('[Telegram Init Effect] Telegram WebApp not available (Onboarding.jsx).');
        }
    }, []);

    // Effect to check onboarding status after authentication
    useEffect(() => {
        const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        console.log('[Onboarding Status Effect] Running. isAuthenticated:', isAuthenticated, 'telegramUser?.id:', telegramUser?.id);

        if (isAuthenticated && telegramUser?.id) {
            console.log('[Onboarding Status Effect] Condition MET. isAuthenticated:', isAuthenticated, 'telegramUser?.id:', telegramUser?.id);
            const telegramId = telegramUser.id;
            console.log(`Authenticated with Telegram ID: ${telegramId}. Fetching onboarding status.`);

            const fetchOnboardingStatus = async () => {
                try {
                    // Adjust the URL if your API is hosted elsewhere or needs a prefix (e.g., /api)
                    const response = await fetch(`/users/${telegramId}/onboarding_status`);

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Failed to fetch onboarding status. Status: ${response.status} ${response.statusText}. Body: ${errorText}`);
                    }

                    const data = await response.json();
                    console.log('Onboarding status data received:', data);

                    if (data.onboarding_completed === 1) {
                        console.log('Onboarding completed. Checking current_phase.');
                        if (data.current_phase === 0) {
                            console.log('Navigating to /home/phase0');
                            navigate('/home/phase0', { replace: true });
                        } else if (data.current_phase === 1) {
                            console.log('Navigating to /home/phase1');
                            navigate('/home/phase1', { replace: true });
                        } // Add more 'else if' for other phases as needed
                        else {
                            console.warn(`Unknown current_phase: ${data.current_phase}. Defaulting to /home/phase0.`);
                            navigate('/home/phase0', { replace: true }); // Fallback navigation
                        }
                    } else {
                        // onboarding_completed is 0 or not 1
                        console.log('Onboarding not completed (or status indicates continuation). User remains in onboarding flow.');
                        // User stays on the current Onboarding.jsx page,
                        // can proceed with the "Далее" button to /onboarding/2 or other steps.
                    }
                } catch (err) {
                    console.error('Error fetching or processing onboarding status:', err);
                    // Optionally, you could set an error state here to display a message to the user.
                    // For now, the user remains on the Onboarding.jsx screen.
                }
            };

            fetchOnboardingStatus();
        } else {
            console.log('[Onboarding Status Effect] Condition NOT MET. isAuthenticated:', isAuthenticated, 'telegramUser?.id:', telegramUser?.id);
            if (isAuthenticated && !telegramUser?.id) {
                console.warn('[Onboarding Status Effect] User is authenticated, but Telegram user ID is not yet available. Onboarding status check deferred.');
            } else if (!isAuthenticated) {
                console.log('[Onboarding Status Effect] User is not authenticated. Onboarding status check deferred.');
            } else {
                console.log('[Onboarding Status Effect] Telegram user ID not available for other reasons. Onboarding status check deferred.');
            }
        }
    }, [isAuthenticated, navigate]); // Rerun if isAuthenticated or navigate changes

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