import React from 'react';
import './InfoCard.css';

const InfoCard = ({ title, image, onClick }) => {
    return (
        <div className="info-card" onClick={onClick}>
            <img src={image} alt={title} className="info-card-image" />
            <div className="info-card-overlay"></div>
            <div className="info-card-title">{title}</div>
        </div>
    );
};

export default InfoCard; 