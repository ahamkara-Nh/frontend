import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SymptomDaysCounter.css';
import checkmarkIcon from '../../assets/icons/checkmark.svg';
import nextArrowIcon from '../../assets/icons/arrow-next.svg';
import axios from 'axios';

const SymptomDaysCounter = ({ completedDays }) => {
    const totalDays = 7;
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserPhase = async () => {
            try {
                // Get telegramId from localStorage
                const telegramId = localStorage.getItem('telegramId') ||
                    window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

                console.log('SymptomDaysCounter - Telegram ID:', telegramId);

                if (!telegramId) {
                    console.error('SymptomDaysCounter - Telegram ID not found');
                    setError('Telegram ID not found');
                    setLoading(false);
                    return;
                }

                console.log(`SymptomDaysCounter - Fetching phase data for user ${telegramId}`);
                const response = await axios.get(`/users/${telegramId}/phase-tracking`);
                console.log('SymptomDaysCounter - Phase tracking response:', response.data);

                if (response.data && response.data.current_phase !== undefined) {
                    console.log(`SymptomDaysCounter - Setting current phase to: ${response.data.current_phase}`);
                    setCurrentPhase(response.data.current_phase);
                } else {
                    console.warn('SymptomDaysCounter - No current_phase in response data:', response.data);
                    setError('No phase data found');
                }
            } catch (error) {
                console.error('SymptomDaysCounter - Error fetching user phase:', error);
                setError(`Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPhase();
    }, []);

    const showIntermediateSuccessMessage = completedDays >= 3 && completedDays < totalDays;
    const showFinalSuccessMessage = completedDays === totalDays;

    const handleNextPhase = () => {
        console.log('Navigating to phase selection screen...');
        navigate('/phase-selection');
    };

    const handleChooseCategory = () => {
        console.log('Navigating to category selection screen...');
        navigate('/category-selection');
    };

    if (loading) {
        return <div className="symptom-days-counter-container">Loading phase data...</div>;
    }

    if (error) {
        console.warn('SymptomDaysCounter - Rendering error state:', error);
        return <div className="symptom-days-counter-container">Error: {error}</div>;
    }

    console.log('SymptomDaysCounter - Rendering for phase:', currentPhase);

    if (currentPhase === 2) {
        console.log('SymptomDaysCounter - Rendering Phase 2 UI');
        return (
            <div className="phase2-counter-container">
                <p className="phase2-counter-title">
                    Выберите FODMAP категорию для повторного введения в рацион
                </p>
                <button className="phase2-choose-category-button" onClick={handleChooseCategory}>
                    <span>Выбрать категорию</span>
                    <img src={nextArrowIcon} alt="Choose category" className="phase2-arrow-icon" />
                </button>
            </div>
        );
    }

    console.log('SymptomDaysCounter - Rendering Phase 1 UI');
    return (
        <div className="symptom-days-counter-container">
            <p className="symptom-days-title">Дней с улучшением симптомов:</p>
            <div className="days-row">
                {[...Array(totalDays)].map((_, index) => (
                    <div
                        key={index}
                        className={`day-box ${index < completedDays ? 'completed' : 'pending'}`}
                    >
                        {index < completedDays && (
                            <img src={checkmarkIcon} alt="Completed" className="checkmark-icon" />
                        )}
                    </div>
                ))}
            </div>
            {showIntermediateSuccessMessage && (
                <p className="symptom-days-success-message">
                    Отлично! {completedDays} дня с улучшением симптомов! Уже можно переходить ко 2 этапу, но для лучшего результата лучше получить 7 дней без симптомов перед следующим этапом
                </p>
            )}
            {showFinalSuccessMessage && (
                <>
                    <p className="symptom-days-success-message final-success">
                        Отлично! Можно переходить на следующий этап
                    </p>
                    <button className="next-phase-button-counter" onClick={handleNextPhase}>
                        <span>Следующий этап</span>
                        <img src={nextArrowIcon} alt="Next phase" className="next-phase-arrow" />
                    </button>
                </>
            )}
        </div>
    );
};

export default SymptomDaysCounter; 