import { useState, useEffect } from 'react';

export const usePhaseTracking = (telegramId) => {
    const [phaseData, setPhaseData] = useState({
        phase1_streak_days: 0,
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchPhaseTracking = async () => {
            try {
                if (!telegramId) {
                    throw new Error('No telegram ID provided');
                }

                console.log('Fetching phase tracking for telegramId:', telegramId);
                const response = await fetch(`/users/${telegramId}/phase-tracking`);

                if (!response.ok) {
                    throw new Error('Failed to fetch phase tracking data');
                }

                const data = await response.json();
                console.log('Phase tracking data:', data);

                setPhaseData({
                    phase1_streak_days: data.phase1_streak_days || 0,
                    loading: false,
                    error: null
                });
            } catch (err) {
                console.error('Error in usePhaseTracking:', err);
                setPhaseData(prev => ({
                    ...prev,
                    loading: false,
                    error: err.message
                }));
            }
        };

        if (telegramId) {
            fetchPhaseTracking();
        } else {
            console.warn('No telegramId provided to usePhaseTracking');
            setPhaseData(prev => ({
                ...prev,
                loading: false
            }));
        }
    }, [telegramId]);

    return phaseData;
}; 