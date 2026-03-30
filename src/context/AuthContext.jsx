import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

const STORAGE_KEY = 'classyfitters_auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser]     = useState(null);
    const [token, setToken]   = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Require a token — old sessions without one are cleared
                if (parsed?.token && parsed?.user) {
                    setUser(parsed.user);
                    setToken(parsed.token);
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setLoading(false);
    }, []);

    /** Returns the Authorization header object for authenticated requests. */
    const getAuthHeaders = useCallback(() => {
        if (!token) return {};
        return { Authorization: `Bearer ${token}` };
    }, [token]);

    /**
     * fetch() wrapper that attaches the auth header automatically
     * and auto-logs out on 401 (expired/invalid token).
     */
    const authFetch = useCallback(async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...(options.headers || {}),
        };
        const response = await fetch(url, { ...options, headers });
        return response;
    }, [getAuthHeaders]);

    const login = async (usernameOrEmail, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameOrEmail, password }),
            });
            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                setToken(data.token);
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: data.user, token: data.token }));
                return { success: true, role: data.user.role };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            console.error('Login error:', err);
            return { success: false, error: 'Connection failed. Please check your internet.' };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/register.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();

            if (data.success) {
                return { success: true };
            } else {
                return { success: false, error: data.error };
            }
        } catch (err) {
            console.error('Registration error:', err);
            return { success: false, error: 'Connection failed. Please check your internet.' };
        }
    };

    const logout = async () => {
        // Invalidate the token server-side first
        if (token) {
            try {
                await fetch(`${API_BASE_URL}/logout.php`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch {
                // Ignore — we still clear local state
            }
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            getAuthHeaders,
            authFetch,
            isAdmin: user?.role === 'admin',
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
