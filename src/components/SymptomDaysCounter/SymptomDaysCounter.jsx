import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SymptomDaysCounter.css';
import checkmarkIcon from '../../assets/icons/checkmark.svg';
import nextArrowIcon from '../../assets/icons/arrow-next.svg';

const SymptomDaysCounter = ({ completedDays }) => {
    const totalDays = 7;
    const navigate = useNavigate();

    const showIntermediateSuccessMessage = completedDays >= 3 && completedDays < totalDays;
    const showFinalSuccessMessage = completedDays === totalDays;

    const handleNextPhase = () => {
        console.log('Navigating to next phase...');
        navigate('/home/phase2');
    };

    return (
        <div className="symptom-days-counter-container">
            <p className="symptom-days-title">Дней с улучшением симптомов:</p>
            <div className="days-row">
                {[...Array(totalDays)].map((_, index) => (
                    <div
                        key={index}
                        className={`day-box ${index < completedDays ? 'completed' : 'pending'}`}
                    >
                        {index < completedDays && (
                            <img src={checkmarkIcon} alt="Completed" className="checkmark-icon" />
                        )}
                    </div>
                ))}
            </div>
            {showIntermediateSuccessMessage && (
                <p className="symptom-days-success-message">
                    Отлично! {completedDays} дня с улучшением симптомов! Уже можно переходить ко 2 этапу, но для лучшего результата лучше получить 7 дней без симптомов перед следующим этапом
                </p>
            )}
            {showFinalSuccessMessage && (
                <>
                    <p className="symptom-days-success-message final-success">
                        Отлично! Можно переходить на следующий этап
                    </p>
                    <button className="next-phase-button-counter" onClick={handleNextPhase}>
                        <span>Следующий этап</span>
                        <img src={nextArrowIcon} alt="Next phase" className="next-phase-arrow" />
                    </button>
                </>
            )}
        </div>
    );
};

export default SymptomDaysCounter; 