import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavBar.css';

// Import SVG icons as React components
import DiaryIcon from '../../assets/icons/diary_icon.svg?react';
import FoodIcon from '../../assets/icons/food_icon.svg?react';
import InfoIcon from '../../assets/icons/info_icon.svg?react';
import ProfileIcon from '../../assets/icons/profile_icon.svg?react';

const navItems = [
    { path: '/diary', label: 'Дневник', icon: DiaryIcon },
    { path: '/products', label: 'Продукты', icon: FoodIcon },
    { path: '/info', label: 'Информация', icon: InfoIcon },
    { path: '/profile', label: 'Профиль', icon: ProfileIcon },
];

const BottomNavBar = () => {
    const location = useLocation();

    return (
        <nav className="bottom-nav-bar">
            {navItems.map((item) => {
                // Special case for diary - consider both /diary and /home/phase1 as active states
                const isActive = item.path === '/diary'
                    ? (location.pathname === '/diary' || location.pathname === '/home/phase1')
                    : location.pathname.startsWith(item.path);

                return (
                    <Link to={item.path} key={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                        <item.icon className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNavBar; 