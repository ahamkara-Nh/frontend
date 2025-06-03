import React, { useState } from 'react';
import './Onboarding.css';
import { useNavigate } from 'react-router-dom';

const options = [
    {
        title: 'Изучить',
        description: 'Хочу подробнее узнать об этой диете',
    },
    {
        title: 'Пропустить',
        description: 'Начать отслеживание диеты сразу',
    },
    {
        title: 'Мне только посмотреть',
        description: 'Посмотреть список продуктов без отслеживания диеты',
    },
];

const Onboarding2 = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    // Get user's first name from Telegram WebApp API, fallback to 'новый пользователь'
    let userName = 'новый пользователь';
    let userId = null; // Variable to store user ID
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        userName = user.first_name || user.username || 'новый пользователь';
        userId = user.id; // Store user ID
    }

    const isButtonDisabled = selected === null;
    const buttonStyle = isButtonDisabled
        ? {
            marginTop: '6vh',
            fontSize: '20px',
            background: '#4E4E4E',
            color: '#C4C4C4',
            cursor: 'not-allowed',
            border: 'none',
        }
        : { marginTop: '6vh', fontSize: '20px' };

    return (
        <div className="onboarding-container" style={{ padding: '7vh 6vw 12vh', background: '#222222' }}>
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '36px', alignItems: 'flex-start' }}>
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '32px', color: '#fff', lineHeight: '1.5em', letterSpacing: '-0.04em' }}>
                        {`Привет, ${userName} !`}
                    </div>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: '17px', color: '#C4C4C4', lineHeight: '1.5em', letterSpacing: '-0.04em', marginTop: '8px' }}>
                        Хотите ли вы подробнее узнать о low-FODMAP диете ?
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                    {options.map((option, idx) => (
                        <div
                            key={option.title}
                            onClick={() => setSelected(idx)}
                            style={{
                                background: selected === idx ? '#325D45' : '#323E5D',
                                borderRadius: '8.3px',
                                boxShadow: '0 3px 7px 0 rgba(0,0,0,0.1), 0 13px 13px 0 rgba(0,0,0,0.09)',
                                padding: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '3px',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                            }}
                        >
                            <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '17px', color: '#fff', lineHeight: '1.5em', letterSpacing: '-0.04em' }}>{option.title}</div>
                            <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: '16px', color: '#C4C4C4', lineHeight: '1.5em', letterSpacing: '-0.04em' }}>{option.description}</div>
                        </div>
                    ))}
                </div>
            </div>
            <button
                className="onboarding-button"
                style={buttonStyle}
                disabled={isButtonDisabled}
                onClick={() => {
                    if (!isButtonDisabled) {
                        if (selected === 0) {
                            navigate('/onboarding/learn/1'); // "Изучить"
                        } else if (selected === 1) {
                            // handle "Пропустить"
                            navigate('/onboarding/allergies');
                        } else if (selected === 2) {
                            // handle "Мне только посмотреть"
                            // Always navigate to ensure user doesn't get stuck
                            const navigateToHome = () => navigate('/products');

                            if (userId) {
                                const phaseTrackingUrl = `/users/${userId}/phase-tracking`;
                                const completeOnboardingUrl = `/users/${userId}/complete_onboarding`;

                                // First, update phase tracking
                                fetch(phaseTrackingUrl, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ current_phase: 0 }),
                                })
                                    .then(phaseResponse => {
                                        if (phaseResponse.ok) {
                                            console.log('Phase tracking updated successfully to phase 0.');
                                            // Then, complete onboarding
                                            return fetch(completeOnboardingUrl, {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                            });
                                        } else {
                                            // Log error but continue with navigation
                                            phaseResponse.text().then(text => {
                                                console.error('Failed to update phase tracking. Status:', phaseResponse.status, 'Response:', text);
                                            });
                                            return Promise.reject('Failed to update phase tracking');
                                        }
                                    })
                                    .then(onboardingResponse => {
                                        if (onboardingResponse.ok) {
                                            console.log('Onboarding completed successfully.');
                                        } else {
                                            // Log error but continue with navigation
                                            onboardingResponse.text().then(text => {
                                                console.error('Failed to complete onboarding. Status:', onboardingResponse.status, 'Response:', text);
                                            });
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error during API calls for \"Мне только посмотреть\":', error);
                                    })
                                    .finally(() => {
                                        // Always navigate regardless of API success or failure
                                        navigateToHome();
                                    });
                            } else {
                                console.error('User ID not available');
                                // Still navigate even if user ID is not available
                                navigateToHome();
                            }
                        }
                    }
                }}
            >
                Далее
            </button>
        </div>
    );
};

export default Onboarding2; 