import React from 'react';
import './StoriesCarousel.css';
import storyBackgroundImage1 from '../../assets/images/stories_food.png'; // Import the image
import storyBackgroundImage2 from '../../assets/images/stories_food2.png'; // Import the image
import storyBackgroundImage3 from '../../assets/images/stories_food3.png'; // Import the image
import storyBackgroundImage4 from '../../assets/images/stories_food4.png'; // Import the image

const StoriesCarousel = () => {
    const stories = [
        { id: 1, title: 'Что значит исключение ?', image: storyBackgroundImage1 },
        { id: 2, title: 'Как выбрать продукты ?', image: storyBackgroundImage2 },
        { id: 3, title: 'Сколько длится этап ?', image: storyBackgroundImage3 },
        { id: 4, title: 'Как вести дневник ?', image: storyBackgroundImage4 },
    ];

    return (
        <div className="stories-carousel-container">
            {/* <h2>Stories</h2> Removed this heading */}
            <div className="stories-carousel">
                {stories.map((story) => (
                    <div key={story.id} className="story-card">
                        <img src={story.image} alt={story.title} className="story-image" />
                        <div className="story-title">{story.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoriesCarousel; 