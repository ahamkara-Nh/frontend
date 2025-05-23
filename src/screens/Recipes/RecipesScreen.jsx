import React, { useEffect } from 'react';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import './RecipesScreen.css';
import { useNavigate } from 'react-router-dom';

const MOCK_RECIPES = [
    {
        id: 1,
        title: 'Овсяная каша с бананом',
        image: '/images/recipes/oatmeal.jpg',
        duration: '15 мин',
        difficulty: 'Легко'
    },
    {
        id: 2,
        title: 'Куриная грудка с овощами',
        image: '/images/recipes/chicken.jpg',
        duration: '30 мин',
        difficulty: 'Средне'
    },
    {
        id: 3,
        title: 'Салат с киноа и овощами',
        image: '/images/recipes/quinoa-salad.jpg',
        duration: '20 мин',
        difficulty: 'Легко'
    },
    {
        id: 4,
        title: 'Запеченная рыба с зеленью',
        image: '/images/recipes/baked-fish.jpg',
        duration: '35 мин',
        difficulty: 'Средне'
    }
];

const RecipesScreen = () => {
    const navigate = useNavigate();

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
                // We conditionally hide the back button in ProductsScreen,
                // so we should be careful here.
                // For now, let's assume other screens will manage their own back button visibility.
                // If this screen is the only one setting it, we could hide it.
                // tg.BackButton.hide();
            };
        }
    }, [navigate]);

    return (
        <div className="recipes-container">
            <div className="recipes-header">
                <h1>Low-FODMAP рецепты</h1>
                <p className="recipes-subtitle">Вкусные и полезные рецепты для здорового питания</p>
            </div>

            <div className="recipes-content">
                {MOCK_RECIPES.map(recipe => (
                    <RecipeCard
                        key={recipe.id}
                        title={recipe.title}
                        image={recipe.image}
                        duration={recipe.duration}
                        difficulty={recipe.difficulty}
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