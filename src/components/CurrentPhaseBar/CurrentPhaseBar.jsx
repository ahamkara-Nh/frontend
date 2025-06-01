import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CurrentPhaseBar.css';
// We'll need an arrow icon, let's import it if you have it or use a placeholder
import arrowIcon from '../../assets/icons/arrow.svg';

const CurrentPhaseBar = ({ phaseName, week, day }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/phase-selection');
    };

    return (
        <div className="current-phase-bar" onClick={handleClick}>
            <div className="phase-info">
                <p className="phase-name">{phaseName}</p>
                <p className="phase-date">{`Неделя ${week}. День ${day}`}</p>
            </div>
            {<img src={arrowIcon} alt="arrow icon" className="arrow-icon" />}
        </div>
    );
};

export default CurrentPhaseBar; 