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

                // First, update the streak with the user's timezone
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                console.log('Updating streak with timezone:', timezone);

                const updateResponse = await fetch(`/users/${telegramId}/phase-tracking/update-streak`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ timezone }),
                });

                if (!updateResponse.ok) {
                    console.warn('Failed to update streak, but continuing to fetch data');
                } else {
                    console.log('Streak updated successfully');
                }

                // Then fetch the phase tracking data
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