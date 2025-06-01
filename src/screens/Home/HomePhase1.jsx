import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import CurrentPhaseBar from '../../components/CurrentPhaseBar/CurrentPhaseBar';
import StoriesCarousel from '../../components/StoriesCarousel/StoriesCarousel';
import SymptomDaysCounter from '../../components/SymptomDaysCounter/SymptomDaysCounter';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { DiaryHistoryList } from '../../components/DiaryNote';
import { usePhaseProgress } from '../../hooks/usePhaseProgress';
import { usePhaseTracking } from '../../hooks/usePhaseTracking';
import './HomePhase1.css';

const HomePhase1 = () => {
    const navigate = useNavigate();

    // Get user ID from Telegram WebApp
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

    useEffect(() => {
        // Store telegramId in localStorage for other components to use
        if (telegramId) {
            console.log('HomePhase1 - Storing telegramId in localStorage:', telegramId);
            localStorage.setItem('telegramId', telegramId);
        }
    }, [telegramId]);

    const { week, day, loading: progressLoading, error: progressError } = usePhaseProgress(telegramId);
    const { phase1_streak_days, current_phase, loading: trackingLoading, error: trackingError } = usePhaseTracking(telegramId);

    // Debug logs for phase tracking
    useEffect(() => {
        console.log('HomePhase1 - Phase tracking data:', {
            phase1_streak_days,
            current_phase,
            loading: trackingLoading,
            error: trackingError
        });
    }, [phase1_streak_days, current_phase, trackingLoading, trackingError]);

    // Determine phase name based on current_phase
    const getPhaseNameByPhase = (phase) => {
        switch (phase) {
            case 1:
                return "Этап 1: Исключение";
            case 2:
                return "Этап 2: Повторное введение";
            case 3:
                return "Этап 3: Персонализация";
            default:
                return "Этап 1: Исключение"; // Default fallback
        }
    };

    const phaseName = getPhaseNameByPhase(current_phase);

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
                <CurrentPhaseBar phaseName={getPhaseNameByPhase(1)} week={1} day={1} />
                <SymptomDaysCounter completedDays={0} />
                <p>Error loading progress. Using default values.</p>
                {/* Rest of your component */}
            </div>
        );
    }

    if (progressLoading || trackingLoading) {
        return (
            <div className="home-container">
                <CurrentPhaseBar phaseName={getPhaseNameByPhase(1)} week={1} day={1} />
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    return (
        <div className="home-container">
            <CurrentPhaseBar phaseName={phaseName} week={week} day={day} />
            <StoriesCarousel />
            <SymptomDaysCounter completedDays={phase1_streak_days} />
            <ActionButtons />
            <div className="divider-home"></div>
            <div className="diary-history-section">
                <DiaryHistoryList telegramId={telegramId || "310596650"} />
            </div>
            <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%" }}>
                <BottomNavBar />
            </div>
        </div>
    );
};

export default HomePhase1; 