import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePhase0 = () => {
    const navigate = useNavigate();

    const handleRandomAction = () => {
        // Placeholder for a random action
        console.log('Phase 0: Random button clicked!');
        // Example: navigate('/');
    };

    return (
        <div className="home-container">
            <h1>Home - Phase 0 (Placeholder)</h1>
            <p>This is a placeholder screen for users who chose "Мне только посмотреть".</p>
            <button onClick={handleRandomAction} className="home-button">
                Random Action
            </button>
        </div>
    );
};

export default HomePhase0; 