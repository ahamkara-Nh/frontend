import React, { useEffect, useState } from 'react';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './RecipesScreen.css';
import { useNavigate } from 'react-router-dom';

const RecipesScreen = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.BackButton.show();
            const handleBackButtonClick = () => {
                navigate(-1); // Go back to the previous page
            };
            tg.onEvent('backButtonClicked', handleBackButtonClick);

            return () => {
                tg.offEvent('backButtonClicked', handleBackButtonClick);
            };
        }
    }, [navigate]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const response = await fetch('/recipes');

                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }

                const data = await response.json();
                setRecipes(data.recipes || []);
            } catch (err) {
                console.error('Error fetching recipes:', err);
                setError('Failed to load recipes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    if (loading) {
        return (
            <div className="recipes-container">
                <div className="loading-container">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recipes-container">
                <div className="error-container">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recipes-container">
            <div className="recipes-header">
                <h1>Low-FODMAP рецепты</h1>
                <p className="recipes-subtitle">Вкусные и полезные рецепты для здорового питания</p>
            </div>

            <div className="recipes-content">
                {recipes.map(recipe => (
                    <RecipeCard
                        key={recipe.recipe_id}
                        id={recipe.recipe_id}
                        title={recipe.name}
                        image={`/src/assets/recipe_images/${recipe.image_name}.png`}
                        duration="15 мин" // TODO: Add duration to API response
                        difficulty="Легко" // TODO: Add difficulty to API response
                    />
                ))}
            </div>

            <div className="nav-spacer"></div>

            <div className="bottom-nav-container">
                <BottomNavBar />
            </div>
        </div>
    );
};

export default RecipesScreen; 