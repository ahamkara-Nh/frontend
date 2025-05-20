import React from 'react';
import './Onboarding.css';
import { useNavigate } from 'react-router-dom';
import fodmapPic from '../../assets/images/onboarding_learn_2_fodmap_pic.png'; // Keep if moved to assets
import arrowSvg from '../../assets/arrow.svg';
import ProgressBar from '../../components/ProgressBar/ProgressBar'; // Import ProgressBar

const OnboardingLearn2 = () => {
    const navigate = useNavigate();
    // const fodmapPic = process.env.PUBLIC_URL + '/images/onboarding/onboarding_learn_2_fodmap_pic.png';

    return (
        <div className="onboarding-container" style={{
            padding: '7vh 6vw 12vh',
            background: '#222222',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Progress Bar Wrapper - handles margins and max-width */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                marginBottom: '5vh',
                marginTop: '2vh'
            }}>
                <ProgressBar current={2} total={6} />
            </div>

            {/* Content */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center' // Center align text and image
            }}>
                <div style={{ width: '100%', textAlign: 'left' }}>
                    <div style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 600,
                        fontSize: '33px',
                        color: '#fff',
                        lineHeight: '1.5em',
                        letterSpacing: '-0.04em'
                    }}>
                        Что такое FODMAP
                    </div>
                    <div style={{
                        fontFamily: 'Manrope, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#C4C4C4',
                        lineHeight: '1.5em',
                        letterSpacing: '-0.04em',
                        marginTop: '1vh' // Adjusted from Figma's 9px gap
                    }}>
                        Название расшифровывается как:
                    </div>
                </div>
                <img
                    src={fodmapPic}
                    alt="FODMAP Acronym"
                    style={{
                        width: 'auto', // Adjust width automatically based on constrained height
                        maxWidth: 'min(350px, 80vw)', // Keep max width for very wide images or large screens
                        maxHeight: '48vh',         // Limit the maximum height of the image
                        objectFit: 'contain',      // Ensure the image scales to fit without cropping, maintaining aspect ratio
                        borderRadius: '10px',
                        margin: '3vh 0'
                    }}
                />
            </div>

            {/* Navigation Buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between', // Place buttons on opposite ends
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
                        background: '#323E5D' // From Figma
                    }}
                    onClick={() => navigate('/onboarding/learn/1')} // Navigate back
                >
                    <img src={arrowSvg} alt="Back" style={{
                        width: '20px',
                        height: '20px',
                        display: 'block',
                        transform: 'rotate(180deg)' // Rotate arrow for back
                    }} />
                </button>
                <button
                    className="onboarding-button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '11px 24px',
                        background: '#323E5D' // From Figma
                    }}
                    onClick={() => navigate('/onboarding/learn/3')} // Navigate to next learn screen
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

export default OnboardingLearn2; 