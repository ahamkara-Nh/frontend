import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import InfoCard from '../../components/InfoCard/InfoCard';
import './InfoScreen.css';

// Import placeholder images - replace these with your actual images
import infoImage1 from '../../assets/images/info_food1.png';
import infoImage2 from '../../assets/images/info_food2.png';
import infoImage3 from '../../assets/images/info_food3.png';
import infoImage4 from '../../assets/images/info_food4.png';
import infoImage5 from '../../assets/images/info_food5.png';
import infoImage6 from '../../assets/images/info_food6.png';
import infoImage7 from '../../assets/images/info_food7.png';
import infoImage8 from '../../assets/images/info_food8.png';
import infoImage9 from '../../assets/images/info_food9.png';

const InfoScreen = () => {
    const navigate = useNavigate();

    // Sample info cards data
    const infoCards = [
        { id: 1, title: 'Расшифровка FODMAP: Понимание основных компонентов', image: infoImage1 },
        { id: 2, title: 'Как работает диета low-FODMAP? Три ключевых этапа', image: infoImage2 },
        { id: 3, title: 'Кому может помочь диета low- FODMAP?', image: infoImage3 },
        { id: 4, title: 'Ориентируемся в продуктовом магазине: продукты с низким и высоким содержанием FODMAP', image: infoImage4 },
        { id: 5, title: 'Преимущества, которые вы можете ощутить на диете low-FODMAP', image: infoImage5 },
        { id: 6, title: 'Важные моменты, которые следует учитывать: предостережения и потенциальные риски', image: infoImage6 },
        { id: 7, title: 'Путь реинтродукции: выявление ваших триггерных продуктов', image: infoImage7 },
        { id: 8, title: 'Правильное питание на диете low-FODMAP: советы для сбалансированного подхода', image: infoImage8 },
        { id: 9, title: 'Взгляд в будущее: долгосрочное управление и персонализация', image: infoImage9 },
    ];

    const handleCardClick = (cardId) => {
        console.log(`Info card ${cardId} clicked`);
        navigate(`/info/${cardId}`);
    };

    return (
        <div className="info-container">
            <div className="info-header">
                <h1 className="info-title">Полезная информация</h1>
            </div>

            <div className="info-content">
                {infoCards.map((card) => (
                    <InfoCard
                        key={card.id}
                        title={card.title}
                        image={card.image}
                        onClick={() => handleCardClick(card.id)}
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

export default InfoScreen; 