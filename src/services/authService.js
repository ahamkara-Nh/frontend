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
    console.log('[AuthService] Attempting Telegram authentication...');
    try {
        // Get Telegram WebApp data
        if (!window.Telegram || !window.Telegram.WebApp) {
            console.error('[AuthService] Telegram WebApp is not available.');
            throw new Error('Telegram WebApp is not available');
        }

        const webAppData = window.Telegram.WebApp.initData;
        console.log('[AuthService] Telegram.WebApp.initData:', webAppData);

        if (!webAppData) {
            console.error('[AuthService] Telegram WebApp initData is not available.');
            throw new Error('Telegram WebApp initData is not available');
        }

        console.log('[AuthService] Sending authentication request to backend at /auth/telegram');
        // Send authentication request to backend through proxy
        const response = await fetch(`/auth/telegram`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ initData: webAppData }),
            credentials: 'include' // Include cookies if needed
        });

        const responseText = await response.text(); // Get raw response text
        console.log('[AuthService] Backend response status:', response.status);
        console.log('[AuthService] Backend raw response text:', responseText);

        if (!response.ok) {
            let errorData;
            try {
                errorData = JSON.parse(responseText); // Try to parse error text as JSON
                console.error('[AuthService] Authentication failed. Parsed error data:', errorData);
            } catch (e) {
                console.error('[AuthService] Authentication failed. Could not parse error response as JSON.');
                errorData = { message: responseText || 'Authentication failed' };
            }
            throw new Error(errorData.message || 'Authentication failed');
        }

        try {
            const responseData = JSON.parse(responseText); // Parse successful response text as JSON
            console.log('[AuthService] Authentication successful. Parsed response data:', responseData);
            return responseData;
        } catch (e) {
            console.error('[AuthService] Authentication successful, but failed to parse response JSON:', e);
            console.error('[AuthService] Raw response was:', responseText);
            throw new Error('Authentication succeeded but response parsing failed');
        }
    } catch (error) {
        console.error('[AuthService] Authentication error caught:', error.message);
        if (error.stack) {
            console.error('[AuthService] Error stack:', error.stack);
        }
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