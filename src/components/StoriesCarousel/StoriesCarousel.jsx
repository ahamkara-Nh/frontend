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

const StoriesCarousel = () => {
    const navigate = useNavigate();
    const [currentPhase, setCurrentPhase] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhaseData = async () => {
            try {
                // Get telegramId from localStorage or Telegram WebApp
                const telegramId = localStorage.getItem('telegramId') ||
                    window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'default_user';

                if (telegramId) {
                    const response = await axios.get(`/users/${telegramId}/phase-tracking`);
                    if (response.data && response.data.current_phase) {
                        setCurrentPhase(response.data.current_phase);
                    }
                }
            } catch (error) {
                console.error('Error fetching phase data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhaseData();
    }, []);

    const handleStoryClick = (storyId) => {
        // Navigate to the appropriate story detail screen based on the current phase
        if (currentPhase === 2) {
            navigate(`/story2/${storyId}`); // Navigate to phase 2 story detail
        } else {
            navigate(`/story/${storyId}`); // Navigate to phase 1 story detail
        }
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