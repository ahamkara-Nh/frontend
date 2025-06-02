import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StoryDetailScreen.css'; // Reusing the same CSS
import storyContentImage from '../../assets/images/story5.png';
import storyContentImage2 from '../../assets/images/story6.png';
import storyContentImage3 from '../../assets/images/story3.png';
import storyContentImage4 from '../../assets/images/story4.png';

// Placeholder for phase 2 story data
const storiesData = {
    1: {
        title: 'Этап 2: Повторное введение',
        paragraphs: [
            'После того, как мы свели все группы FODMAP к минимуму, пора выяснить какие конкретные группы вызывают негативные симптомы. В данном этапе необходимо возвращать в рацион FODMAP группы по одной. Таким образом получится выявить проблемные группы.'
        ],
        image: storyContentImage
    },
    2: {
        title: 'Как выбрать продукты?',
        paragraphs: [
            'Для 2 этапа необходимо выбирать продукты  с высоким содержанием одно из углеводов FODMAP. Можете начинать с любого. Выбрать можно на главном экране. Таким образом необходимо будет питаться в течении 3 дней, а после нужно снова полностью исключать все FODMAP углеводы также на 3 дня для проверки следующего.'
        ],
        image: storyContentImage2
    },
    3: {
        title: 'Сколько длится этап?',
        paragraphs: [
            'Длительность этапа до 6 недель. Столько времени нужно для проверки каждой группы с перерывом между ними. После выявления проблемных углеводов переходим в 3 этап, где мы исключаем их из рациона.'
        ],
        image: storyContentImage3
    },
    4: {
        title: 'Как вести дневник?',
        paragraphs: [
            'Особенно важно на этом этапе тщательно записывать все, что вы едите, и отмечать любые симптомы в дневнике питания.',
            'Приложение поможет вам отслеживать результаты тестирования каждой группы FODMAP и определить ваши индивидуальные триггеры.'
        ],
        image: storyContentImage4
    }
};

const StoryDetailScreen2 = () => {
    const { storyId } = useParams();
    const navigate = useNavigate();
    const story = storiesData[storyId];

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.onEvent('backButtonClicked', handleBack);

            return () => {
                window.Telegram.WebApp.BackButton.hide();
                window.Telegram.WebApp.offEvent('backButtonClicked', handleBack);
            };
        }
    }, [navigate]);

    if (!story) {
        return <div className="story-detail-container"><p>Story not found.</p></div>;
    }

    const handleBack = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="story-detail-container">
            <h1 className="story-detail-title">{story.title}</h1>
            <div className="story-detail-content">
                {story.paragraphs.map((paragraph, index) => (
                    <p key={index} className="story-detail-paragraph">{paragraph}</p>
                ))}
                {story.image && (
                    <img src={story.image} alt={story.title} className="story-detail-image" />
                )}
            </div>
        </div>
    );
};

export default StoryDetailScreen2; 