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
                        Привет, Nikita !
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
                        // TODO: handle next
                    }
                }}
            >
                Далее
            </button>
        </div>
    );
};

export default Onboarding2; 