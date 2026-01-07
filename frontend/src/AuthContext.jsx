import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);

    useEffect(() => {  
        const savedToken = localStorage.getItem('token');
        const savedEmail = localStorage.getItem('email');
        if (savedToken) {
            setToken(savedToken);
        }
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const login = (newToken, userEmail) => {
        setToken(newToken);
        setEmail(userEmail);
        localStorage.setItem('token', newToken);
        localStorage.setItem('email', userEmail);
    };

    const logout = () => {
        setToken(null);
        setEmail(null);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
    };

    return (
        <AuthContext.Provider value={{ token, email,isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}