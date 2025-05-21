import React from 'react';
import './CurrentPhaseBar.css';
// We'll need an arrow icon, let's import it if you have it or use a placeholder
import arrowIcon from '../../assets/icons/arrow.svg'; 

const CurrentPhaseBar = ({ phaseName, week, day }) => {
    return (
        <div className="current-phase-bar">
            <div className="phase-info">
                <p className="phase-name">{phaseName}</p>
                <p className="phase-date">{`Неделя ${week}. День ${day}`}</p>
            </div>
            { <img src={arrowIcon} alt="arrow icon" className="arrow-icon" /> }
        </div>
    );
};

export default CurrentPhaseBar; 