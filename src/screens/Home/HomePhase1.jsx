import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import CurrentPhaseBar from '../../components/CurrentPhaseBar/CurrentPhaseBar';
import { usePhaseProgress } from '../../hooks/usePhaseProgress';

const HomePhase1 = () => {
    const navigate = useNavigate();

    // Get user ID from Telegram WebApp
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const { week, day, loading, error } = usePhaseProgress(telegramId);

    const handleRandomAction = () => {
        // Placeholder for a random action
        console.log('Phase 1: Random button clicked!');
        // Example: navigate('/some-feature');
    };


    if (error) {
        console.error('Error loading phase progress:', error);
        // Fallback to default values if there's an error
        return (
            <div className="home-container">
                <CurrentPhaseBar phaseName="Этап 1: Исключение" week={1} day={1} />
                <p>Error loading progress. Using default values.</p>
                {/* Rest of your component */}
            </div>
        );
    }

    return (
        <div className="home-container">
            <CurrentPhaseBar phaseName="Этап 1: Исключение" week={week} day={day} />
            <h1>Home - Phase 1 (Placeholder)</h1>
            <p>This is a placeholder screen for users starting Phase 1 of the diet.</p>
            <button onClick={handleRandomAction} className="home-button">
                Do Something in Phase 1
            </button>
            <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%" }}>
                <BottomNavBar />
            </div>
        </div>
    );
};

export default HomePhase1; 