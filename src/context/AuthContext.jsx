import React, { createContext, useState, useEffect, useContext } from 'react';
import { authenticateTelegram, isAuthenticated } from '../services/authService';

// Create the authentication context
const AuthContext = createContext(null);

/**
 * Provider component for authentication context
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize authentication on component mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if we're in Telegram environment and have valid initData
                if (isAuthenticated()) {
                    const authResult = await authenticateTelegram();
                    console.log('[AuthContext] authResult from authenticateTelegram:', authResult);
                    setUser(authResult);
                }
            } catch (err) {
                console.error('Authentication initialization error:', err);
                setError(err.message || 'Failed to authenticate');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Authentication context value
    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the authentication context
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;