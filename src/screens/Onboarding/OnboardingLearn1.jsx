import React from 'react';
import './Onboarding.css';
import { useNavigate } from 'react-router-dom';
import womanImg from '../../assets/images/woman.png';
import arrowSvg from '../../assets/arrow.svg';

const OnboardingLearn1 = () => {
    const navigate = useNavigate();

    return (
        <div className="onboarding-container" style={{ padding: '7vh 6vw 12vh', background: '#222222', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '1vw', width: '100%', maxWidth: '600px', marginBottom: '5vh', marginTop: '2vh' }}>
                <div style={{ flex: 1, height: '7px', borderRadius: '4px', background: '#325D45' }} />
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ flex: 1, height: '7px', borderRadius: '4px', background: '#323E5D' }} />
                ))}
            </div>
            {/* Content */}
            <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3vh' }}>
                <div style={{ width: '100%', textAlign: 'left' }}>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, fontSize: '33px', color: '#fff', lineHeight: '1.5em', letterSpacing: '-0.04em' }}>
                        Что такое FODMAP
                    </div>
                    <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: '16px', color: '#C4C4C4', lineHeight: '1.5em', letterSpacing: '-0.04em', marginTop: '2vh' }}>
                        FODMAP — это группа углеводов, которые могут вызывать дискомфорт в ЖКТ  у некоторых людей.
                    </div>
                </div>
                <img
                    src={womanImg}
                    alt="Что такое FODMAP"
                    style={{ width: '60vw', maxWidth: '340px', borderRadius: '18px', margin: '4vh 0' }}
                />
            </div>
            {/* Next Button */}
            <button
                className="onboarding-button"
                style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px 24px' }}
                onClick={() => navigate('/onboarding/learn/2')}
            >
                <img src={arrowSvg} alt="Next" style={{ width: '20px', height: '20px', display: 'block' }} />
            </button>
        </div>
    );
};

export default OnboardingLearn1; 