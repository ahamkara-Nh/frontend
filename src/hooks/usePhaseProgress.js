import { useState, useEffect } from 'react';
import { calculateWeekAndDay } from '../utils/dateUtils';

export const usePhaseProgress = (telegramId) => {
    const [progress, setProgress] = useState({ week: 1, day: 1 });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                if (!telegramId) {
                    console.warn('No telegramId provided to usePhaseProgress');
                    setLoading(false);
                    return;
                }

                // Step 1: Check current phase for the user
                const phaseResponse = await fetch(`/users/${telegramId}/phase-tracking`);
                if (!phaseResponse.ok) {
                    throw new Error('Failed to fetch user phase information');
                }
                const phaseData = await phaseResponse.json();
                const currentPhase = phaseData.current_phase;
                console.log('Current phase:', currentPhase);

                // Step 2: Try to get phases timing information
                let dateToUse;
                try {
                    const timingsResponse = await fetch(`/users/${telegramId}/phases-timings`);

                    if (timingsResponse.ok) {
                        const timingsData = await timingsResponse.json();
                        console.log('Phases timings:', timingsData);

                        // Extract phases_timings from the nested structure
                        const phasesTimings = timingsData.phases_timings || timingsData;

                        if (currentPhase === 1 && phasesTimings.phase1_date) {
                            dateToUse = phasesTimings.phase1_date;
                        } else if (currentPhase === 2 && phasesTimings.phase2_date) {
                            dateToUse = phasesTimings.phase2_date;
                        }
                    } else if (timingsResponse.status !== 404) {
                        throw new Error('Failed to fetch phases timings');
                    }
                } catch (timingsErr) {
                    console.error('Error fetching phases timings:', timingsErr);
                    // Continue with fallback logic
                }

                // Step 3: If no date from phases-timings, fall back to original logic
                if (!dateToUse) {
                    console.log('Using fallback created_at date');
                    const createdAtResponse = await fetch(`/users/${telegramId}/preferences/created-at`);
                    if (!createdAtResponse.ok) {
                        throw new Error('Failed to fetch user preferences');
                    }
                    const createdAtData = await createdAtResponse.json();
                    dateToUse = createdAtData.created_at;
                }

                console.log('Using date for calculation:', dateToUse);
                const { week, day } = calculateWeekAndDay(dateToUse);
                console.log('Calculated progress:', { week, day });
                setProgress({ week, day });
            } catch (err) {
                console.error('Error in usePhaseProgress:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [telegramId]);

    return { ...progress, loading, error };
}; 