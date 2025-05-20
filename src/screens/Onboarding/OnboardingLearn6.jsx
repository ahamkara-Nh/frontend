import React from 'react';
import './Onboarding.css';
import { useNavigate } from 'react-router-dom';
import arrowSvg from '../../assets/arrow.svg';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
// Assuming the image is the same as learn 4, or a new one named onboarding_learn_6_stage3.png
import stage3Image from '../../assets/images/onboarding_learn_6_stage3.png';

const OnboardingLearn6 = () => {
    const navigate = useNavigate();

    // TODO: Determine the correct final navigation path
    const handleFinishOnboarding = () => {
        navigate('/home'); // Placeholder: navigate to a home/main screen
    };

    return (
        <div className="onboarding-container" style={{
            padding: '7vh 6vw 12vh',
            background: '#222222',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Progress Bar Wrapper */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                marginBottom: '5vh',
                marginTop: '2vh'
            }}>
                <ProgressBar current={6} total={6} />
            </div>

            {/* Content */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3vh',
                flexGrow: 1,
                textAlign: 'center'
            }}>
                <div style={{ width: '100%', textAlign: 'left' }}>
                    <div style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        fontSize: '33px',
                        color: '#fff',
                        lineHeight: '1.5em',
                        letterSpacing: '-0.04em',
                        marginBottom: '1vh'
                    }}>
                        3 этап
                    </div>
                    <div style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#C4C4C4',
                        lineHeight: '1.5em',
                        letterSpacing: '-0.04em'
                    }}>
                        Создаем свой индивидуальный рацион, избегая только те продукты, которые вызывают реакцию.
                    </div>
                </div>
                <img
                    src={stage3Image} // Use the imported image for stage 3
                    alt="Этап 3 Low-FODMAP"
                    style={{
                        width: 'auto',
                        maxWidth: 'min(350px, 80vw)',
                        maxHeight: '35vh',
                        objectFit: 'contain',
                        borderRadius: '19px', // From Figma
                        margin: '3vh 0'
                    }}
                />
            </div>

            {/* Navigation Buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '600px',
                marginTop: 'auto'
            }}>
                <button
                    className="onboarding-button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '11px 24px',
                        background: '#323E5D'
                    }}
                    onClick={() => navigate('/onboarding/learn/5')} // Navigate back to Learn 5
                >
                    <img src={arrowSvg} alt="Back" style={{
                        width: '20px',
                        height: '20px',
                        display: 'block',
                        transform: 'rotate(180deg)'
                    }} />
                </button>
                <button
                    className="onboarding-button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '11px 24px',
                        background: '#323E5D' // Changed color to green for emphasis on completion
                    }}
                    onClick={handleFinishOnboarding}
                >
                    <img src={arrowSvg} alt="Finish" style={{
                        width: '20px',
                        height: '20px',
                        display: 'block'
                        // Consider changing icon or adding text like "Готово" if desired
                    }} />
                </button>
            </div>
        </div>
    );
};

export default OnboardingLearn6; 