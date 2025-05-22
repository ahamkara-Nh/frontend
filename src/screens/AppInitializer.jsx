import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if AuthContext is elsewhere
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

const AppInitializer = () => {
    const { user, isAuthenticated, loading: authLoading, error: authError } = useAuth();
    const navigate = useNavigate();
    const [statusFetching, setStatusFetching] = useState(false);
    const [statusError, setStatusError] = useState(null);

    useEffect(() => {
        console.log('[AppInitializer] Effect triggered. authLoading:', authLoading, 'isAuthenticated:', isAuthenticated);

        // Wait for AuthContext to finish its initial loading
        if (authLoading) {
            console.log('[AppInitializer] Waiting for AuthContext to load...');
            return; // Do nothing until auth loading is complete
        }

        // AuthContext has loaded
        if (!isAuthenticated) {
            console.log('[AppInitializer] User not authenticated by AuthContext. Navigating to /onboarding.');
            navigate('/onboarding', { replace: true });
            return;
        }

        // User is authenticated by AuthContext, proceed to check onboarding status
        const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!telegramUser?.id) {
            console.warn('[AppInitializer] User authenticated, but Telegram user ID not available. Navigating to /onboarding as a fallback.');
            // This could happen if Telegram data isn't ready immediately.
            // Navigating to onboarding is a safe fallback as it can re-initiate auth if needed.
            navigate('/onboarding', { replace: true });
            return;
        }

        const telegramId = telegramUser.id;
        console.log(`[AppInitializer] User authenticated with Telegram ID: ${telegramId}. Fetching onboarding status.`);

        // Avoid re-fetching if already fetching or if already navigated due to some other condition
        if (statusFetching) return;

        setStatusFetching(true);
        setStatusError(null);

        const fetchOnboardingStatus = async () => {
            try {
                // Ensure this URL is correct for your environment
                const response = await fetch(`/users/${telegramId}/onboarding_status`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch onboarding status. Status: ${response.status} ${response.statusText}. Body: ${errorText}`);
                }
                const data = await response.json();
                console.log('[AppInitializer] Onboarding status data received:', data);

                if (data.onboarding_completed === 1) {
                    if (data.current_phase === 0) {
                        console.log('[AppInitializer] Onboarding complete, phase 0. Navigating to /home/phase0.');
                        navigate('/home/phase0', { replace: true });
                    } else if (data.current_phase === 1) {
                        console.log('[AppInitializer] Onboarding complete, phase 1. Navigating to /home/phase1.');
                        navigate('/home/phase1', { replace: true });
                    } else {
                        console.warn(`[AppInitializer] Unknown current_phase: ${data.current_phase}. Defaulting to /home/phase0.`);
                        navigate('/home/phase0', { replace: true });
                    }
                } else {
                    // onboarding_completed is 0 or not 1
                    console.log('[AppInitializer] Onboarding not completed. Navigating to /onboarding.');
                    navigate('/onboarding', { replace: true });
                }
            } catch (err) {
                console.error('[AppInitializer] Error fetching or processing onboarding status:', err);
                setStatusError(err.message || 'Failed to fetch onboarding status.');
                console.log('[AppInitializer] Error occurred during status fetch. Navigating to /onboarding as fallback.');
                navigate('/onboarding', { replace: true }); // Fallback navigation
            } finally {
                setStatusFetching(false);
            }
        };

        fetchOnboardingStatus();

    }, [authLoading, isAuthenticated, user, navigate, statusFetching]); // Added statusFetching to deps to prevent re-runs while fetching

    // Render Logic
    if (authLoading || statusFetching) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#222222' }}>
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (authError) {
        // This error comes from AuthContext's initial attempt.
        // The useEffect should navigate to /onboarding if !isAuthenticated.
        // This UI is a fallback or for brief display if navigation isn't immediate.
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red', backgroundColor: '#1a1a1a', fontFamily: 'Arial, sans-serif', padding: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.2em' }}>Authentication Error</p>
                <p>{authError}</p>
                <p style={{ marginTop: '10px', fontSize: '0.9em' }}>You will be redirected shortly.</p>
            </div>
        );
    }

    if (statusError) {
        // This error comes from fetching the onboarding status.
        // The useEffect's catch/finally block should navigate to /onboarding.
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'orange', backgroundColor: '#1a1a1a', fontFamily: 'Arial, sans-serif', padding: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.2em' }}>Could Not Load User Status</p>
                <p>{statusError}</p>
                <p style={{ marginTop: '10px', fontSize: '0.9em' }}>You will be redirected shortly.</p>
            </div>
        );
    }

    // This component primarily navigates. If it's still rendered and not loading/erroring,
    // it usually means navigation is about to happen or an edge case.
    // A null render or minimal placeholder is fine as it should quickly navigate away.
    console.log('[AppInitializer] Render: Path not covered by loading/error states. Awaiting navigation from useEffect.');
    return null;
};

export default AppInitializer; 