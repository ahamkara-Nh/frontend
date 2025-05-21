import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StoryDetailScreen.css';
import storyContentImage from '../../assets/images/story_content_image.png'; // The image downloaded from Figma
import storyContentImage2 from '../../assets/images/story2.png';
import storyContentImage3 from '../../assets/images/story3.png';
import storyContentImage4 from '../../assets/images/story4.png';

// Placeholder for actual story data - this would ideally come from a data source or context
const storiesData = {
    1: {
        title: 'Этап 1: Исключение',
        paragraphs: [
            'Какой-то из углеводов FODMAP (один или несколько) может вызвать появление или усиление кишечных симптомов. Чтобы доказать это, следует исключить потенциальные раздражители из рациона на некоторое время и оценить симптомы.',
            'Если боли и вздутие живота, послабление стула исчезли или значительно уменьшились, то какой-то из углеводов «виновен» в провокации симптомов. Остается только выяснить, какой именно. Выяснять будем в следующих этапах, а сейчас нужно свести все FODMAP группы к минимуму.'
        ],
        image: storyContentImage
    },
    2: {
        title: 'Как выбрать продукты?',
        paragraphs: [
            'Для 1 этапа необходимо выбирать продукты исключительно с низким содержанием FODMAP  (зеленый уровень).',
            'Можете посмотреть продукты в базе данных и добавить подходящие в избранное.'
        ],
        image: storyContentImage2
    },
    3: {
        title: 'Сколько длится этап?',
        paragraphs: [
            'Длительность этапа 2-6 недель. К следующему этапу можно переходить когда будет заметно улучшение симптомов в течении как минимум 3 дней подряд, а лучше недели.',
            ''
        ],
        image: storyContentImage3
    },
    4: {
        title: 'Как вести дневник?',
        paragraphs: [
            'Ежедневно делайте запись с вашим питанием и симптомами в дневник питания, приложение автоматически отслеживает наличие симптомов и уведомит когда можно приступить к следующему этапу.',
            'Также если вы наблюдаетесь у врача, в дальнейшем вы сможете отправить дневник одним файлом, так вы упростите жизнь и себе и врачу.'
        ],
        image: storyContentImage4
    }
};

const StoryDetailScreen = () => {
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
    }, [navigate]); // Added navigate to dependency array as handleBack uses it

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

export default StoryDetailScreen;