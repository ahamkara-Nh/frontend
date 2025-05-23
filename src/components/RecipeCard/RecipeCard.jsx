import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './RecipeCard.css';

const RecipeCard = ({ id, title, image, duration, difficulty }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/products/recipes/${id}`);
    };

    return (
        <div className="recipe-card" onClick={handleClick}>
            <div className="recipe-image-container">
                <img src={image} alt={title} className="recipe-image" />
            </div>
            <div className="recipe-info">
                <h2 className="recipe-title">{title}</h2>
            </div>
        </div>
    );
};

RecipeCard.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired
};

export default RecipeCard; 