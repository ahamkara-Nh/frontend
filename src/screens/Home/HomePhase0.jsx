import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import { DiaryNote } from '../../components/DiaryNote';
import './HomePhase0.css';
import arrowIcon from '../../assets/icons/arrow_icon.svg';

const HomePhase0 = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleStartDiary = async () => {
        console.log('Starting diary');
        setLoading(true);

        try {
            // Get Telegram user ID
            const telegramId = localStorage.getItem('telegramId') ||
                window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

            if (!telegramId) {
                console.error('Telegram ID not found');
                setLoading(false);
                return;
            }

            console.log(`Updating phase tracking for user ${telegramId}`);

            // Update the user's phase to 1
            await axios.put(`/users/${telegramId}/phase-tracking`, {
                current_phase: 1
            });

            console.log('Phase tracking updated successfully to phase 1');
            navigate('/diary');
        } catch (error) {
            console.error('Error updating phase tracking:', error);
            // Navigate anyway even if the API call fails
            navigate('/diary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-phase0-container">
            <div className="start-button-wrapper">
                <button
                    onClick={handleStartDiary}
                    className="start-diary-button"
                    disabled={loading}
                >
                    <span className="button-text-0">Начать вести дневник</span>
                    <img src={arrowIcon} alt="Start" className="arrow-icon" />
                </button>
            </div>

            <div className="divider-home-phase0"></div>

            <div className="diary-section">
                <DiaryNote isEmpty={true} />
            </div>

            <div className="bottom-nav-container">
                <BottomNavBar />
            </div>
        </div>
    );
};

export default HomePhase0; 