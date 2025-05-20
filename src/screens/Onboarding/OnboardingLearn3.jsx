import React from 'react';
import './Onboarding.css';
import { useNavigate } from 'react-router-dom';
import arrowSvg from '../../assets/arrow.svg';
import ProgressBar from '../../components/ProgressBar/ProgressBar';

const OnboardingLearn3 = () => {
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
                <ProgressBar current={3} total={6} />
            </div>

            {/* Content */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                // alignItems: 'center', // Align text to left as per Figma
                gap: '3vh',
                flexGrow: 1 // Allow content to take available space
            }}>
                <div style={{ width: '100%', textAlign: 'left' }}>
                    <div style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        fontSize: '33px',
                        color: '#fff',
                        lineHeight: '1.5em',
                        letterSpacing: '-0.04em',
                        marginBottom: '1vh' // Based on Figma's 9px gap
                    }}>
                        Что такое Low-FODMAP диета
                    </div>
                    <div style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#C4C4C4',
                        lineHeight: '1.5em',
                        letterSpacing: '-0.04em'
                    }}>
                        Это диета с пониженным содержанием FODMAP — углеводов, которые могут вызывать дискомфорт в кишечнике.
                        <br /><br />
                        Она помогает выявить, какие продукты именно у вас вызывают неприятные симптомы, и подобрать питание, которое будет комфортным и безопасным.
                        <br /><br />
                        Диета проходит в несколько этапов.
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '600px',
                marginTop: 'auto' // Push to bottom
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
                    onClick={() => navigate('/onboarding/learn/2')} // Navigate back to Learn 2
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
                    onClick={() => navigate('/onboarding/learn/4')} // Navigate to next learn screen (Learn 4)
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

export default OnboardingLearn3; 