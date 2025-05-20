import React, { useState } from 'react';
import './Onboarding.css'; // Assuming common styles are here
import { useNavigate } from 'react-router-dom';

const ALLERGY_OPTIONS = [
    'орехи', 'арахис', 'глютен', 'яйца', 'рыба', 'соя'
];

const ALLERGY_MAP = {
    'орехи': 'allergy_nuts',
    'арахис': 'allergy_peanut',
    'глютен': 'allergy_gluten',
    'яйца': 'allergy_eggs',
    'рыба': 'allergy_fish',
    'соя': 'allergy_soy'
};

const OnboardingAllergies = () => {
    const navigate = useNavigate();
    const [selectedAllergies, setSelectedAllergies] = useState([]);

    const toggleAllergy = (allergy) => {
        setSelectedAllergies(prev =>
            prev.includes(allergy)
                ? prev.filter(item => item !== allergy)
                : [...prev, allergy]
        );
    };

    const isNextButtonDisabled = selectedAllergies.length === 0;

    const nextButtonStyle = {
        fontSize: '20px',
        fontWeight: 600,
        padding: '11px 30px', // Consistent padding, adjust if needed based on Onboarding.css
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        ...(isNextButtonDisabled
            ? {
                background: '#4E4E4E',
                color: '#C4C4C4',
                cursor: 'not-allowed',
            }
            : {
                background: '#323E5D', // Default active background, assuming from previous Figma/styles
                color: '#fff',
            })
    };

    const skipButtonStyle = {
        background: '#323E5D', // Default active background
        color: '#fff',
        fontSize: '20px',
        fontWeight: 600,
        padding: '11px 30px', // Consistent padding
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
    };

    const handleNext = async () => {
        if (isNextButtonDisabled) return;

        let telegram_id = null;
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
            telegram_id = window.Telegram.WebApp.initDataUnsafe.user.id;
        }

        if (!telegram_id) {
            console.error('Telegram user ID not found. Cannot proceed.');
            // Optionally, show an error message to the user
            return;
        }

        const preferences = ALLERGY_OPTIONS.reduce((acc, option) => {
            acc[ALLERGY_MAP[option]] = selectedAllergies.includes(option);
            return acc;
        }, {});

        const preferencesRequestUrl = `/users/${telegram_id}/preferences`;
        const phaseTrackingRequestUrl = `/users/${telegram_id}/phase-tracking`;
        const completeOnboardingRequestUrl = `/users/${telegram_id}/complete_onboarding`;

        try {
            // First, update preferences
            const prefResponse = await fetch(preferencesRequestUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            if (!prefResponse.ok) {
                const errorText = await prefResponse.text();
                console.error('Failed to update preferences. Status:', prefResponse.status, 'Response:', errorText);
                // Optionally, show an error message
                return;
            }
            console.log('Preferences updated successfully.');

            // Then, update phase tracking
            const phaseResponse = await fetch(phaseTrackingRequestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ current_phase: 1 }),
            });

            if (!phaseResponse.ok) {
                const errorText = await phaseResponse.text();
                console.error('Failed to update phase tracking. Status:', phaseResponse.status, 'Response:', errorText);
                // Optionally, show an error message
                return;
            }
            console.log('Phase tracking updated successfully to phase 1.');

            // Then, complete onboarding
            const completeOnboardingResponse = await fetch(completeOnboardingRequestUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers like Authorization if needed
                },
                // body: JSON.stringify({}), // Add body if your endpoint expects one
            });

            if (!completeOnboardingResponse.ok) {
                const errorText = await completeOnboardingResponse.text();
                console.error('Failed to complete onboarding. Status:', completeOnboardingResponse.status, 'Response:', errorText);
                // Optionally, show an error message
                return;
            }
            console.log('Onboarding completed successfully.');

            navigate('/home/phase1'); // Navigate after all calls succeed

        } catch (error) {
            console.error('Error during API calls:', error);
            // Handle network errors or other issues
        }
    };

    const handleSkip = async () => {
        let telegram_id = null;
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
            telegram_id = window.Telegram.WebApp.initDataUnsafe.user.id;
        }

        if (!telegram_id) {
            console.error('Telegram user ID not found. Cannot proceed.');
            // Optionally, show an error message to the user
            return;
        }

        const phaseTrackingRequestUrl = `/users/${telegram_id}/phase-tracking`;
        const completeOnboardingRequestUrl = `/users/${telegram_id}/complete_onboarding`;

        try {
            // First, update phase tracking
            const phaseResponse = await fetch(phaseTrackingRequestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ current_phase: 1 }),
            });

            if (!phaseResponse.ok) {
                const errorText = await phaseResponse.text();
                console.error('Failed to update phase tracking. Status:', phaseResponse.status, 'Response:', errorText);
                // Optionally, show an error message
                return;
            }
            console.log('Phase tracking updated successfully to phase 1 (skipped allergies).');

            // Then, complete onboarding
            const completeOnboardingResponse = await fetch(completeOnboardingRequestUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify({}), // Add body if your endpoint expects one
            });

            if (!completeOnboardingResponse.ok) {
                const errorText = await completeOnboardingResponse.text();
                console.error('Failed to complete onboarding. Status:', completeOnboardingResponse.status, 'Response:', errorText);
                // Optionally, show an error message
                return;
            }
            console.log('Onboarding completed successfully (skipped allergies).');

            navigate('/home/phase1'); // Navigate after both calls succeed

        } catch (error) {
            console.error('Error updating phase tracking:', error);
            // Handle network errors or other issues
        }
    };

    return (
        <div className="onboarding-container" style={{
            padding: '7vh 6vw', // Adjusted padding based on Figma (50px top, 30px sides)
            background: '#222222',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '3vh' // Approx 30px from Figma
            }}>
                {/* Header Text */}
                <div style={{ marginBottom: '2vh' }}>
                    <div style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        fontSize: '32px',
                        color: '#fff',
                        lineHeight: '1.5em',
                        letterSpacing: '-0.04em'
                    }}>
                        Персонализация
                    </div>
                    <div style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '17px',
                        color: '#C4C4C4',
                        lineHeight: '1.5em',
                        letterSpacing: '-0.04em',
                        marginTop: '1vh'
                    }}>
                        Есть ли у вас какие-либо индивидуальные непереносимости ?
                    </div>
                </div>

                {/* Allergies Section */}
                <div style={{ width: '100%', marginBottom: '3vh' }}>
                    <div style={{ width: 'fit-content' }}> {/* Wrapper to constrain width of title and hr */}
                        <div style={{
                            fontFamily: 'Manrope, sans-serif',
                            fontWeight: 600,
                            fontSize: '20px',
                            color: '#fff',
                            lineHeight: '1.5em',
                            letterSpacing: '-0.04em'
                        }}>
                            Аллергии
                        </div>
                        <hr style={{
                            border: 'none',
                            height: '3px',
                            backgroundColor: '#325D45',
                            margin: '0.5vh 0 0 0' // Margin top from text, no bottom margin here
                        }} />
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '10px',
                        marginTop: '2vh'
                    }}>
                        {ALLERGY_OPTIONS.map(allergy => (
                            <button
                                key={allergy}
                                onClick={() => toggleAllergy(allergy)}
                                style={{
                                    fontFamily: 'Manrope, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '19px',
                                    color: '#fff',
                                    background: selectedAllergies.includes(allergy) ? '#325D45' : '#323E5D',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px 5px',
                                    cursor: 'pointer',
                                    boxShadow: '0px 3px 7px 0px rgba(0,0,0,0.1)',
                                    textAlign: 'center'
                                }}
                            >
                                {allergy}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Note */}
                <div style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 400,
                    fontSize: '17px',
                    color: '#C4C4C4',
                    lineHeight: '1.5em',
                    letterSpacing: '-0.04em',
                    textAlign: 'left',
                    width: '100%',
                    marginTop: 'auto' // Pushes note towards buttons if space allows
                }}>
                    Вы можете изменить предпочтения в профиле
                </div>
            </div>

            {/* Buttons - Placed at the bottom of the screen content */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'row', // Changed to row for side-by-side buttons
                justifyContent: 'space-between', // Space them out
                gap: '15px',
                marginTop: '5vh'
            }}>
                <button
                    className="onboarding-button"
                    style={skipButtonStyle} // Applied new skip button style
                    onClick={handleSkip}
                >
                    Пропустить
                </button>
                <button
                    className="onboarding-button"
                    style={nextButtonStyle} // Applied new next button style
                    onClick={handleNext}
                    disabled={isNextButtonDisabled}
                >
                    Далее
                </button>
            </div>
        </div>
    );
};

export default OnboardingAllergies; 