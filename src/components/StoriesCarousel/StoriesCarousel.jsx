import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StoriesCarousel.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import storyBackgroundImage1 from '../../assets/images/stories_food.png'; // Import the image
import storyBackgroundImage2 from '../../assets/images/stories_food2.png'; // Import the image
import storyBackgroundImage3 from '../../assets/images/stories_food3.png'; // Import the image
import storyBackgroundImage4 from '../../assets/images/stories_food4.png'; // Import the image
import storyBackgroundImage5 from '../../assets/images/stories_food5.png'; // Import the new image
import redCircle from '../../assets/images/red_circle.svg'; // Import red circle indicator

const StoriesCarousel = () => {
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState(1);
    const [loading, setLoading] = useState(true);
    const [sensitiveGroups, setSensitiveGroups] = useState([]);

    // Map for translating group names to Russian
    const groupNameMap = {
        'fructose': 'Фруктоза',
        'lactose': 'Лактоза',
        'mannitol': 'Маннитол',
        'sorbitol': 'Сорбитол',
        'gos': 'ГОС',
        'fructan': 'Фруктаны'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get telegramId from localStorage or Telegram WebApp
                const telegramId = localStorage.getItem('telegramId') ||
                    window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

                if (telegramId) {
                    // Fetch phase tracking data
                    const phaseResponse = await axios.get(`/users/${telegramId}/phase-tracking`);
                    if (phaseResponse.data && phaseResponse.data.current_phase) {
                        setCurrentPhase(phaseResponse.data.current_phase);
                    }

                    // If we're in phase 3, fetch phase2-tracking data to get sensitive groups
                    if (phaseResponse.data?.current_phase === 3) {
                        const phase2Response = await axios.get(`/users/${telegramId}/phase2-tracking`);
                        if (phase2Response.data) {
                            // Check each group and add to sensitiveGroups if value is 3
                            const sensGroups = [];
                            const groups = ['fructose', 'lactose', 'mannitol', 'sorbitol', 'gos', 'fructan'];

                            groups.forEach(group => {
                                if (phase2Response.data[group] === 3) {
                                    sensGroups.push(group);
                                }
                            });

                            setSensitiveGroups(sensGroups);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStoryClick = (storyId) => {
        // Navigate to the appropriate story detail screen based on the current phase
        if (currentPhase === 2) {
            navigate(`/story2/${storyId}`); // Navigate to phase 2 story detail
        } else {
            navigate(`/story/${storyId}`); // Navigate to phase 1 story detail
        }
    };

    const handleProductsButtonClick = () => {
        navigate('/products');
    };

    // Phase 1 stories
    const phase1Stories = [
        { id: 1, title: 'Что значит исключение ?', image: storyBackgroundImage1 },
        { id: 2, title: 'Как выбрать продукты ?', image: storyBackgroundImage2 },
        { id: 3, title: 'Сколько длится этап ?', image: storyBackgroundImage3 },
        { id: 4, title: 'Как вести дневник ?', image: storyBackgroundImage4 },
    ];

    // Phase 2 stories
    const phase2Stories = [
        { id: 1, title: 'Что значит повторное введение ?', image: storyBackgroundImage5 },
        { id: 2, title: 'Как выбрать продукты ?', image: storyBackgroundImage2 },
        { id: 3, title: 'Сколько длится этап ?', image: storyBackgroundImage3 },
        { id: 4, title: 'Как вести дневник ?', image: storyBackgroundImage4 },
    ];

    // Select stories based on current phase
    const stories = currentPhase === 2 ? phase2Stories : phase1Stories;

    if (loading) {
        return (
            <div className="stories-carousel-container">
                <LoadingSpinner size="medium" />
            </div>
        );
    }

    // Phase 3 banner content
    if (currentPhase === 3) {
        return (
            <div className="phase3-banner">
                <h2 className="phase3-banner-header">Так держать !</h2>
                <div className="phase3-banner-content">
                    <p className="phase3-banner-text">В предыдущем этапе мы выявили чувствительность к следующим группам:</p>

                    {sensitiveGroups.length > 0 ? (
                        sensitiveGroups.map((group, index) => (
                            <div key={index} className="phase3-group-name">
                                <span className="phase3-group-text">{groupNameMap[group]}</span>
                                <img src={redCircle} alt="Red indicator" className="phase3-indicator" />
                            </div>
                        ))
                    ) : (
                        <p className="phase3-banner-text">Чувствительных групп не выявлено</p>
                    )}

                    <p className="phase3-banner-text">В дальнейшем следует избегать продуктов с высоким содержанием данных групп в рационе.</p>
                    <p className="phase3-banner-text">Посмотреть рекомендуемые продукты можно в базе продуктов:</p>

                    <button className="phase3-products-button" onClick={handleProductsButtonClick}>
                        Посмотреть продукты
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="stories-carousel-container">
            {/* <h2>Stories</h2> Removed this heading */}
            <div className="stories-carousel">
                {stories.map((story) => (
                    <div key={story.id} className="story-card" onClick={() => handleStoryClick(story.id)}>
                        <img src={story.image} alt={story.title} className="story-image" />
                        <div className="story-title">{story.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoriesCarousel;