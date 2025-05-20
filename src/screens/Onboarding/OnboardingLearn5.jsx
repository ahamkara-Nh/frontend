import React from 'react';
import './Onboarding.css';
import { useNavigate } from 'react-router-dom';
import arrowSvg from '../../assets/arrow.svg';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import stage2Image from '../../assets/images/onboarding_learn_5_stage2.png'; // Import the new image

const OnboardingLearn5 = () => {
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
                <ProgressBar current={5} total={6} />
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
                        2 этап
                    </div>
                    <div style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#C4C4C4',
                        lineHeight: '1.5em',
                        letterSpacing: '-0.04em'
                    }}>
                        Постепенно возвращаем продукты по одному, чтобы понять, какие вызывают симптомы.
                    </div>
                </div>
                <img
                    src={stage2Image}
                    alt="Этап 2 Low-FODMAP"
                    style={{
                        width: 'auto',
                        maxWidth: 'min(350px, 80vw)',
                        maxHeight: '35vh',
                        objectFit: 'contain',
                        borderRadius: '25px',
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
                    onClick={() => navigate('/onboarding/learn/4')} // Navigate back to Learn 4
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
                    onClick={() => navigate('/onboarding/learn/6')} // Navigate to next learn screen (Learn 6)
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

export default OnboardingLearn5; 