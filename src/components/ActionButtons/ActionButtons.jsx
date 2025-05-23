import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActionButtons.css';
import plusIcon from '../../assets/icons/plus_icon.svg';

const ActionButtons = () => {
    const navigate = useNavigate();

    const handleFoodButtonClick = () => {
        navigate('/food-diary/add');
    };

    const handleSymptomsClick = () => {
        navigate('/symptoms');
    };

    return (
        <div className="action-buttons-container">
            <button
                className="action-button food-button"
                onClick={handleFoodButtonClick}
            >
                <span className="button-text">Питание</span>
                <img src={plusIcon} alt="Add" className="plus-icon" />
            </button>
            <button
                className="action-button symptoms-button"
                onClick={handleSymptomsClick}
            >
                <span className="button-text">Симптомы</span>
                <img src={plusIcon} alt="Add" className="plus-icon" />
            </button>
        </div>
    );
};

export default ActionButtons; 