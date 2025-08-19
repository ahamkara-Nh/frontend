import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './RecipeDetailScreen.css';
import { getBaseUrl } from '../../utils/api';

const baseUrl = getBaseUrl();

const RecipeDetailScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reset scroll position when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.BackButton.show();
            const handleBackButtonClick = () => {
                navigate(-1);
            };
            tg.onEvent('backButtonClicked', handleBackButtonClick);

            return () => {
                tg.offEvent('backButtonClicked', handleBackButtonClick);
            };
        }
    }, [navigate]);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${baseUrl}/recipes`);

                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }

                const data = await response.json();
                const foundRecipe = data.recipes.find(r => r.recipe_id === parseInt(id));

                if (!foundRecipe) {
                    throw new Error('Recipe not found');
                }

                setRecipe(foundRecipe);
            } catch (err) {
                console.error('Error fetching recipe:', err);
                setError('Failed to load recipe. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRecipe();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="recipe-detail-container">
                <div className="loading-container">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="recipe-detail-container">
                <div className="error-container">
                    <p>{error || 'Recipe not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recipe-detail-container">
            <div className="recipe-content">
                <div className="recipe-header">
                    <h1>{recipe.name}</h1>
                    <div className="recipe-image">
                        <img
                            src={`/src/assets/recipe_images/${recipe.image_name}.png`}
                            alt={recipe.name}
                        />
                    </div>
                </div>

                <div className="recipe-ingredients">
                    <h2>Ингредиенты:</h2>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div className="recipe-instructions">
                    <h2>Способ приготовления:</h2>
                    <ol>
                        {recipe.preparation.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="nav-spacer"></div>

            <div className="bottom-nav-container">
                <BottomNavBar />
            </div>
        </div>
    );
};

export default RecipeDetailScreen; 