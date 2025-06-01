import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhaseProgress } from '../../hooks/usePhaseProgress';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './PhaseSelectionScreen.css';

const PhaseSelectionScreen = () => {
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState(1);
    const [phaseLoading, setPhaseLoading] = useState(true);
    const [phaseError, setPhaseError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Get user ID from Telegram WebApp
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    const { week, day, loading, error } = usePhaseProgress(telegramId);

    // Fetch the current phase
    useEffect(() => {
        const fetchCurrentPhase = async () => {
            if (!telegramId) {
                setPhaseLoading(false);
                return;
            }

            try {
                const response = await fetch(`/users/${telegramId}/phase-tracking`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user phase information');
                }
                const data = await response.json();
                setCurrentPhase(data.current_phase || 1);
            } catch (err) {
                console.error('Error fetching current phase:', err);
                setPhaseError(err.message);
            } finally {
                setPhaseLoading(false);
            }
        };

        fetchCurrentPhase();
    }, [telegramId]);

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    const updatePhase = async (newPhase) => {
        if (!telegramId || isUpdating) return;

        setIsUpdating(true);
        try {
            const response = await fetch(`/users/${telegramId}/phase-tracking`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ current_phase: newPhase }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update phase to ${newPhase}`);
            }

            // Update local state after successful API call
            setCurrentPhase(newPhase);
        } catch (err) {
            console.error('Error updating phase:', err);
            alert('Failed to update phase. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleNextPhase = () => {
        if (currentPhase < 3) {
            const nextPhase = currentPhase + 1;
            updatePhase(nextPhase);
        }
    };

    const handlePreviousPhase = () => {
        if (currentPhase > 1) {
            const prevPhase = currentPhase - 1;
            updatePhase(prevPhase);
        }
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

    if (loading || phaseLoading) {
        return (
            <div className="phase-selection-screen">
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    if (error || phaseError) {
        console.error('Error loading data:', error || phaseError);
        // Use default values if there's an error
        return renderContent(1, 1, 1);
    }

    return renderContent(week, day, currentPhase);

    function renderContent(currentWeek, currentDay, phase) {
        return (
            <div className="phase-selection-screen">
                <div className="phases-container">
                    <div className={`phase-item ${phase === 1 ? 'active' : phase > 1 ? 'completed' : 'disabled'}`}>
                        <div className="phase-content">
                            <h2>Этап 1: Исключение</h2>
                            {phase === 1 && <p>Неделя {currentWeek}. День {currentDay}</p>}
                        </div>
                    </div>
                    <div className={`phase-item ${phase === 2 ? 'active' : phase > 2 ? 'completed' : 'disabled'}`}>
                        <div className="phase-content">
                            <h2>Этап 2: Повторное введение</h2>
                            {phase === 2 && <p>Неделя {currentWeek}. День {currentDay}</p>}
                        </div>
                    </div>
                    <div className={`phase-item ${phase === 3 ? 'active' : 'disabled'}`}>
                        <div className="phase-content">
                            <h2>Этап 3: Персонализация</h2>
                            {phase === 3 && <p>Неделя {currentWeek}. День {currentDay}</p>}
                        </div>
                    </div>
                </div>
                <div className="phase-navigation-buttons">
                    {phase > 1 && (
                        <button
                            className="phase-button previous-phase-button"
                            onClick={handlePreviousPhase}
                            disabled={isUpdating || phase === 1}
                        >
                            Вернуться на предыдущий этап
                        </button>
                    )}
                    <button
                        className="phase-button next-phase-button"
                        onClick={handleNextPhase}
                        disabled={isUpdating || phase === 3}
                    >
                        {isUpdating ? 'Обновление...' : phase < 3 ? 'Перейти на следующий этап' : 'Вы на последнем этапе'}
                    </button>
                </div>
            </div>
        );
    }
};

export default PhaseSelectionScreen; 