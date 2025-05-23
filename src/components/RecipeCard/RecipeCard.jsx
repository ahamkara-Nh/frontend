import React from 'react';
import PropTypes from 'prop-types';
import './RecipeCard.css';

const RecipeCard = ({ title, image, duration, difficulty }) => {
    return (
        <div className="recipe-card">
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
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired
};

export default RecipeCard; 