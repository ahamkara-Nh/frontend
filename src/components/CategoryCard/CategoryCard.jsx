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
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div
            className="category-card"
            style={cardStyle}
            onClick={handleClick}
        >
            <h3 className="category-title">{title}</h3>
        </div>
    );
};

export default CategoryCard; 