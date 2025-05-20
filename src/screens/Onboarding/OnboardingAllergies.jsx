import React, { useState } from 'react';
import './Onboarding.css'; // Assuming common styles are here
import { useNavigate } from 'react-router-dom';

const ALLERGY_OPTIONS = [
    'орехи', 'арахис', 'глютен', 'яйца', 'рыба', 'соя'
];

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

    const handleNext = () => {
        if (isNextButtonDisabled) return;
        // TODO: Save selectedAllergies (e.g., to context or backend)
        console.log('Selected allergies:', selectedAllergies);
        navigate('/home'); // Navigate to the main app/home screen
    };

    const handleSkip = () => {
        navigate('/home'); // Navigate to the main app/home screen
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