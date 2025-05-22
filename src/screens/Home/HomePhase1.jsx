import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import CurrentPhaseBar from '../../components/CurrentPhaseBar/CurrentPhaseBar';
import StoriesCarousel from '../../components/StoriesCarousel/StoriesCarousel';
import SymptomDaysCounter from '../../components/SymptomDaysCounter/SymptomDaysCounter';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { usePhaseProgress } from '../../hooks/usePhaseProgress';
import { usePhaseTracking } from '../../hooks/usePhaseTracking';
import './HomePhase1.css';

const HomePhase1 = () => {
    const navigate = useNavigate();

    // Get user ID from Telegram WebApp
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const { week, day, loading: progressLoading, error: progressError } = usePhaseProgress(telegramId);
    const { phase1_streak_days, loading: trackingLoading, error: trackingError } = usePhaseTracking(telegramId);

    const handleRandomAction = () => {
        // Placeholder for a random action
        console.log('Phase 1: Random button clicked!');
        // Example: navigate('/some-feature');
    };

    if (progressError || trackingError) {
        console.error('Error loading data:', { progressError, trackingError });
        // Fallback to default values if there's an error
        return (
            <div className="home-container">
                <CurrentPhaseBar phaseName="Этап 1: Исключение" week={1} day={1} />
                <SymptomDaysCounter completedDays={0} />
                <p>Error loading progress. Using default values.</p>
                {/* Rest of your component */}
            </div>
        );
    }

    if (progressLoading || trackingLoading) {
        return (
            <div className="home-container">
                <CurrentPhaseBar phaseName="Этап 1: Исключение" week={1} day={1} />
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    return (
        <div className="home-container">
            <CurrentPhaseBar phaseName="Этап 1: Исключение" week={week} day={day} />
            <StoriesCarousel />
            <SymptomDaysCounter completedDays={phase1_streak_days} />
            <ActionButtons />
            <div className="divider"></div>
            <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%" }}>
                <BottomNavBar />
            </div>
        </div>
    );
};

export default HomePhase1; 