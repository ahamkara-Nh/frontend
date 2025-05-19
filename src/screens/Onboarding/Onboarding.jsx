import React from 'react';
import './Onboarding.css';

const Onboarding = () => {
    return (
        <div className="onboarding-container">
            <div className="onboarding-text-blocks">
                <p className="onboarding-text main">
                    Это приложение создано, чтобы помочь вам в соблюдении диеты и сделать путь немного легче.
                </p>
                <p className="onboarding-text main">
                    Но помните: при любых вопросах о здоровье в первую очередь обращайтесь к врачу!
                </p>
                <p className="onboarding-text sub">
                    Приложение не является медицинским средством или инструментом диагностики.
                </p>
            </div>
            <button className="onboarding-button">Далее</button>
        </div>
    );
};

export default Onboarding; 