import React from 'react';
import './Onboarding.css';
import { useNavigate } from 'react-router-dom';
import arrowSvg from '../../assets/arrow.svg';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import stage1Image from '../../assets/images/onboarding_learn_4_stage1.png'; // Import the new image

const OnboardingLearn4 = () => {
    const navigate = useNavigate();

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
                <ProgressBar current={4} total={6} />
            </div>

            {/* Content */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Center content for this screen with image
                gap: '3vh',
                flexGrow: 1,
                textAlign: 'center' // Center text elements
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
                        1 этап
                    </div>
                    <div style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#C4C4C4',
                        lineHeight: '1.5em',
                        letterSpacing: '-0.04em'
                    }}>
                        На этом этапе исключаем продукты с высоким содержанием FODMAP на 2–6 недель, чтобы уменьшить симптомы.
                    </div>
                </div>
                <img
                    src={stage1Image}
                    alt="Этап 1 Low-FODMAP"
                    style={{
                        width: 'auto',
                        maxWidth: 'min(350px, 80vw)',
                        maxHeight: '35vh',
                        objectFit: 'contain',
                        borderRadius: '25px', // From Figma
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
                    onClick={() => navigate('/onboarding/learn/3')} // Navigate back to Learn 3
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
                        background: '#323E5D'
                    }}
                    onClick={() => navigate('/onboarding/learn/5')} // Navigate to next learn screen (Learn 5)
                >
                    <img src={arrowSvg} alt="Next" style={{
                        width: '20px',
                        height: '20px',
                        display: 'block'
                    }} />
                </button>
            </div>
        </div>
    );
};

export default OnboardingLearn4; 