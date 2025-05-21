import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';

const HomePhase1 = () => {
    const navigate = useNavigate();

    const handleRandomAction = () => {
        // Placeholder for a random action
        console.log('Phase 1: Random button clicked!');
        // Example: navigate('/some-feature');
    };

    return (
        <div className="home-container">
            <h1>Home - Phase 1 (Placeholder)</h1>
            <p>This is a placeholder screen for users starting Phase 1 of the diet.</p>
            <button onClick={handleRandomAction} className="home-button">
                Do Something in Phase 1
            </button>
            <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%" }}>
                <BottomNavBar />
            </div>
        </div>
    );
};

export default HomePhase1; 