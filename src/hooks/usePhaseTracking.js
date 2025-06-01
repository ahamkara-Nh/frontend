import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePhaseTracking = (telegramId) => {
    const [phaseData, setPhaseData] = useState({
        phase1_streak_days: 0,
        current_phase: 1,
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchPhaseTracking = async () => {
            try {
                if (!telegramId) {
                    console.warn('usePhaseTracking - No telegramId provided');
                    throw new Error('No telegram ID provided');
                }

                console.log('usePhaseTracking - Using telegramId:', telegramId);

                // First, update the streak with the user's timezone
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                console.log('usePhaseTracking - Updating streak with timezone:', timezone);

                try {
                    const updateResponse = await axios.put(`/users/${telegramId}/phase-tracking/update-streak`, { timezone });
                    console.log('usePhaseTracking - Streak update response:', updateResponse.data);
                } catch (updateError) {
                    console.warn('usePhaseTracking - Failed to update streak, but continuing to fetch data:', updateError);
                }

                // Then fetch the phase tracking data
                console.log('usePhaseTracking - Fetching phase tracking for telegramId:', telegramId);
                const response = await axios.get(`/users/${telegramId}/phase-tracking`);
                console.log('usePhaseTracking - Phase tracking response:', response);

                if (!response.data) {
                    throw new Error('Empty response data');
                }

                console.log('usePhaseTracking - Phase tracking data:', response.data);

                setPhaseData({
                    phase1_streak_days: response.data.phase1_streak_days || 0,
                    current_phase: response.data.current_phase || 1,
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
                loading: false,
                error: 'No telegramId provided'
            }));
        }
    }, [telegramId]);

    return phaseData;
}; 