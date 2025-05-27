import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ title, backgroundImage, path }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (path) {
            navigate(path);
        }
    };

    const cardStyle = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.56)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div
            className="category-card"
            style={cardStyle}
            onClick={handleClick}
        >
            <h3 className="category-title-component">{title}</h3>
        </div>
    );
};

export default CategoryCard; 