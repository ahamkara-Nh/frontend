import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SymptomDaysCounter.css';
import checkmarkIcon from '../../assets/icons/checkmark.svg';
import checkmarkWhiteIcon from '../../assets/icons/check-icon.svg';
import nextArrowIcon from '../../assets/icons/arrow-next.svg';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from 'axios';

// FODMAP category mapping from English to Russian
const fodmapCategoryNames = {
    'fructan': 'Фруктаны',
    'gos': 'ГОС',
    'lactose': 'Лактоза',
    'fructose': 'Фруктоза',
    'mannitol': 'Маннитол',
    'sorbitol': 'Сорбитол'
};

const SymptomDaysCounter = ({ completedDays }) => {
    const totalDays = 7;
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [phase2TrackingData, setPhase2TrackingData] = useState(null);
    const [reintroductionDays, setReintroductionDays] = useState(0);
    const [breakDays, setBreakDays] = useState(0);

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

                    // If phase is 2, fetch both phase2 tracking data and the reintroduction/break days
                    if (response.data.current_phase === 2) {
                        try {
                            console.log(`SymptomDaysCounter - Fetching phase 2 tracking data for user ${telegramId}`);
                            const phase2Response = await axios.get(`/users/${telegramId}/phase2-tracking`);
                            console.log('SymptomDaysCounter - Phase 2 tracking response:', phase2Response.data);
                            setPhase2TrackingData(phase2Response.data);

                            // Update phase2 streak with timezone information
                            try {
                                console.log(`SymptomDaysCounter - Updating phase2 streak for user ${telegramId}`);
                                const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                                await axios.put(`/users/${telegramId}/phase-tracking/update-phase2-streak`, {
                                    timezone: userTimezone
                                });
                                console.log('SymptomDaysCounter - Phase2 streak updated with timezone:', userTimezone);
                            } catch (updateError) {
                                console.error('SymptomDaysCounter - Error updating phase2 streak:', updateError);
                            }

                            // Fetch reintroduction and break days from the specified endpoint
                            try {
                                console.log(`SymptomDaysCounter - Fetching reintroduction and break days for user ${telegramId}`);
                                const daysResponse = await axios.get(`/users/${telegramId}/phase-tracking`);
                                console.log('SymptomDaysCounter - Reintroduction and break days response:', daysResponse.data);

                                if (daysResponse.data) {
                                    setReintroductionDays(daysResponse.data.phase2_reintroduction_days || 0);
                                    setBreakDays(daysResponse.data.phase2_break_days || 0);
                                }
                            } catch (daysError) {
                                console.error('SymptomDaysCounter - Error fetching reintroduction and break days:', daysError);
                            }
                        } catch (phase2Error) {
                            if (phase2Error.response && phase2Error.response.status === 404) {
                                console.log('SymptomDaysCounter - No phase 2 tracking data found (404)');
                                setPhase2TrackingData(null);
                            } else {
                                console.error('SymptomDaysCounter - Error fetching phase 2 tracking data:', phase2Error);
                            }
                        }
                    }
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
        return (
            <div className="symptom-days-counter-container">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        console.warn('SymptomDaysCounter - Rendering error state:', error);
        return <div className="symptom-days-counter-container">Error: {error}</div>;
    }

    console.log('SymptomDaysCounter - Rendering for phase:', currentPhase);

    if (currentPhase === 2) {
        console.log('SymptomDaysCounter - Rendering Phase 2 UI');

        // Check if we have phase 2 tracking data AND a current_group
        if (phase2TrackingData && phase2TrackingData.current_group) {
            console.log('SymptomDaysCounter - Rendering Phase 2 tracking UI with data:', phase2TrackingData);

            // Get the current group from the API response and convert to Russian name
            const currentGroup = phase2TrackingData.current_group;
            const currentFodmapCategory = fodmapCategoryNames[currentGroup] || 'Нет данных';

            // Use the state values from the dedicated endpoint
            console.log('SymptomDaysCounter - Using reintroduction days:', reintroductionDays, 'and break days:', breakDays);

            return (
                <div className="phase2-counters-container">
                    <button className="phase2-category-button" onClick={handleChooseCategory}>
                        {currentFodmapCategory}
                    </button>
                    <div className="fodmap-group-counter">
                        <p className="counter-title">Повторное введение:</p>
                        <div className="days-row">
                            {[...Array(3)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`day-box-phase2 ${index < reintroductionDays ? 'completed-phase2' : 'pending-phase2'}`}
                                >
                                    {index < reintroductionDays && (
                                        <img src={checkmarkWhiteIcon} alt="Completed" className="checkmark-icon-phase2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="break-counter">
                        <p className="counter-title">Перерыв перед следующей группой:</p>
                        <div className="days-row">
                            {[...Array(3)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`day-box-phase2 ${index < breakDays ? 'completed-phase2' : 'pending-phase2'}`}
                                >
                                    {index < breakDays && (
                                        <img src={checkmarkWhiteIcon} alt="Completed" className="checkmark-icon-phase2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            );
        }

        // If no current_group in phase 2 tracking data, show the choose category UI
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