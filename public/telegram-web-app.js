/**
 * Telegram WebApp initialization script
 * This script ensures the Telegram WebApp SDK is properly loaded
 */

// Check if Telegram WebApp is already available
if (!window.Telegram || !window.Telegram.WebApp) {
    // Create a script element to load the Telegram WebApp SDK
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;

    // Add the script to the document
    document.head.appendChild(script);

    // Log when the script is loaded
    script.onload = () => {
        console.log('Telegram WebApp SDK loaded successfully');

        // Initialize the WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
        }
    };

    // Log if there's an error loading the script
    script.onerror = () => {
        console.error('Failed to load Telegram WebApp SDK');
    };
} else {
    console.log('Telegram WebApp SDK already loaded');

    // Initialize the WebApp
    window.Telegram.WebApp.ready();
}