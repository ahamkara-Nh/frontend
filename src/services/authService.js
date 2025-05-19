/**
 * Authentication service for Telegram Mini App
 */

// Base API URL - Using Vite's proxy
const API_URL = '';  // Empty string to use the proxy configured in vite.config.js

/**
 * Authenticates a user with Telegram WebApp data
 * @returns {Promise<Object>} The authentication result
 */
export const authenticateTelegram = async () => {
    try {
        // Get Telegram WebApp data
        if (!window.Telegram || !window.Telegram.WebApp) {
            throw new Error('Telegram WebApp is not available');
        }

        const webAppData = window.Telegram.WebApp.initData;

        if (!webAppData) {
            throw new Error('Telegram WebApp initData is not available');
        }

        // Send authentication request to backend through proxy
        const response = await fetch(`/auth/telegram`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ initData: webAppData }),
            credentials: 'include' // Include cookies if needed
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Authentication failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Authentication error:', error);
        throw error;
    }
};

/**
 * Checks if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
    // For Telegram Mini Apps, we can check if we have valid initData
    return window.Telegram &&
        window.Telegram.WebApp &&
        window.Telegram.WebApp.initData &&
        window.Telegram.WebApp.initData.length > 0;
};