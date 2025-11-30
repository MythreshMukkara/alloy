/**
 * File: client/src/context/auth.context.jsx
 * Description: React context and provider that manage authentication state,
 * token storage, and provides helper functions to components.
 */

import React, { useState, createContext, useEffect } from 'react';
import api from '../services/api.service';

const AuthContext = createContext();

function AuthProviderWrapper(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    const storeToken = (token) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
    };

    const authenticateUser = async () => {
        const storedToken = localStorage.getItem('authToken');

        if (storedToken) {
            setAuthToken(storedToken);
            setIsLoggedIn(true);
            try {
                const response = await api.get('/auth/me');
                setUser(response.data)
            } catch (error) {
                console.error("Auth error:", error);
                logOutUser();
            }
        }
        setIsLoading(false); 
    };

    const removeToken = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
    };

    const logOutUser = () => {
        removeToken();
        setIsLoggedIn(false);
        setUser(null);
    };

    useEffect(() => {
        authenticateUser();
    }, []);

    return (
        <AuthContext.Provider 
            value={{ 
                isLoggedIn, 
                isLoading, 
                user, // Provide user data to the app
                authToken,
                storeToken, 
                authenticateUser,
                logOutUser 
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

export { AuthProviderWrapper, AuthContext };