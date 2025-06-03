import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BottomNavBar.css';

// Import SVG icons as React components
import DiaryIcon from '../../assets/icons/diary_icon.svg?react';
import FoodIcon from '../../assets/icons/food_icon.svg?react';
import InfoIcon from '../../assets/icons/info_icon.svg?react';
import ProfileIcon from '../../assets/icons/profile_icon.svg?react';

const navItems = [
    { path: '/diary', label: 'Дневник', icon: DiaryIcon, requiresPhaseCheck: true },
    { path: '/products', label: 'Продукты', icon: FoodIcon },
    { path: '/info', label: 'Информация', icon: InfoIcon },
    { path: '/profile', label: 'Профиль', icon: ProfileIcon },
];

const BottomNavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleNavClick = async (item, e) => {
        if (item.requiresPhaseCheck) {
            e.preventDefault();
            setIsLoading(true);

            try {
                // Get telegram ID from local storage or Telegram WebApp
                const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

                if (!telegramId) {
                    console.error('Telegram ID not available');
                    navigate('/diary'); // Default fallback
                    return;
                }

                // Check the user's current phase
                const response = await axios.get(`/users/${telegramId}/phase-tracking`);
                const { current_phase } = response.data;

                // Navigate based on current phase
                if (current_phase === 1) {
                    navigate('/home/phase1');
                } else {
                    navigate('/home/phase0');
                }
            } catch (error) {
                console.error('Error checking phase:', error);
                navigate('/diary'); // Default fallback on error
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <nav className="bottom-nav-bar">
            {navItems.map((item) => {
                // Special case for diary - consider both /diary and /home/phase1 as active states
                const isActive = item.path === '/diary'
                    ? (location.pathname === '/diary' || location.pathname.startsWith('/home/phase'))
                    : location.pathname.startsWith(item.path);

                return (
                    <Link
                        to={item.requiresPhaseCheck ? '#' : item.path}
                        key={item.path}
                        className={`nav-item ${isActive ? 'active' : ''} ${isLoading && item.requiresPhaseCheck ? 'loading' : ''}`}
                        onClick={(e) => handleNavClick(item, e)}
                    >
                        <item.icon className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNavBar; 