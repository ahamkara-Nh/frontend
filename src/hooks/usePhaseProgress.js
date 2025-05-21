import { useState, useEffect } from 'react';
import { calculateWeekAndDay } from '../utils/dateUtils';

export const usePhaseProgress = (telegramId) => {
    const [progress, setProgress] = useState({ week: 1, day: 1 });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCreatedAt = async () => {
            try {
                console.log('Fetching created_at for telegramId:', telegramId);
                const response = await fetch(`/users/${telegramId}/preferences/created-at`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user preferences');
                }
                const data = await response.json();
                console.log('API Response:', data);

                const { week, day } = calculateWeekAndDay(data.created_at);
                console.log('Calculated progress:', { week, day });
                setProgress({ week, day });
            } catch (err) {
                console.error('Error in usePhaseProgress:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (telegramId) {
            fetchCreatedAt();
        } else {
            console.warn('No telegramId provided to usePhaseProgress');
            setLoading(false);
        }
    }, [telegramId]);

    return { ...progress, loading, error };
}; 