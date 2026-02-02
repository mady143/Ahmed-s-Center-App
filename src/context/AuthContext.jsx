import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ROLES } from '../constants';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const THEMES = {
    // ... keep THEMES as they are ...
    GOLD: {
        name: 'Royal Gold',
        primary: '#ff8c00',
        primaryDark: '#cc7000',
        bgMain: '#0a0807',
        accent: '#ef4444',
        glassBorder: 'rgba(255, 140, 0, 0.2)',
        glassBg: 'rgba(26, 15, 10, 0.6)',
        textMain: '#ffffff',
        textMuted: '#a1a1a1'
    },
    BLUE: {
        name: 'Midnight Blue',
        primary: '#3b82f6',
        primaryDark: '#1d4ed8',
        bgMain: '#020617',
        accent: '#f43f5e',
        glassBorder: 'rgba(59, 130, 246, 0.2)',
        glassBg: 'rgba(2, 6, 23, 0.6)',
        textMain: '#ffffff',
        textMuted: '#94a3b8'
    },
    EMERALD: {
        name: 'Emerald Forest',
        primary: '#10b981',
        primaryDark: '#047857',
        bgMain: '#064e3b',
        accent: '#fbbf24',
        glassBorder: 'rgba(16, 185, 129, 0.2)',
        glassBg: 'rgba(6, 78, 59, 0.6)',
        textMain: '#ffffff',
        textMuted: '#a7f3d0'
    },
    NOIR: {
        name: 'Classic Noir',
        primary: '#ffffff',
        primaryDark: '#a1a1a1',
        bgMain: '#000000',
        accent: '#ffffff',
        glassBorder: 'rgba(255, 255, 255, 0.2)',
        glassBg: 'rgba(30, 30, 30, 0.8)',
        textMain: '#ffffff',
        textMuted: '#888888'
    },
    VIOLET: {
        name: 'Violet Night',
        primary: '#8b5cf6',
        primaryDark: '#6d28d9',
        bgMain: '#1e1b4b',
        accent: '#ec4899',
        glassBorder: 'rgba(139, 92, 246, 0.2)',
        glassBg: 'rgba(30, 27, 75, 0.6)',
        textMain: '#ffffff',
        textMuted: '#c4b5fd'
    },
    ROSE: {
        name: 'Rose Quartz',
        primary: '#fb7185',
        primaryDark: '#e11d48',
        bgMain: '#4c0519',
        accent: '#f43f5e',
        glassBorder: 'rgba(251, 113, 133, 0.2)',
        glassBg: 'rgba(76, 5, 25, 0.6)',
        textMain: '#ffffff',
        textMuted: '#fecdd3'
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('ahmed_theme') || 'GOLD';
    });

    useEffect(() => {
        localStorage.setItem('ahmed_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('ahmed_session', JSON.stringify(user));
        } else {
            localStorage.removeItem('ahmed_session');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('ahmed_theme', currentTheme);
        const root = document.documentElement;
        const theme = THEMES[currentTheme] || THEMES.GOLD;

        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--primary-dark', theme.primaryDark);
        root.style.setProperty('--bg-main', theme.bgMain);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--glass-border', theme.glassBorder);
        root.style.setProperty('--glass-bg', theme.glassBg);
        root.style.setProperty('--text-main', theme.textMain);
        root.style.setProperty('--text-muted', theme.textMuted);
    }, [currentTheme]);

    const capitalize = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const signup = async (userData) => {
        const formattedName = capitalize(userData.name);
        const exists = users.find(u => u.name === formattedName);
        if (exists) {
            throw new Error('User already exists');
        }
        const newUser = {
            ...userData,
            name: formattedName,
            id: Date.now(),
            avatar: userData.avatar || null
        };
        setUsers(prev => [...prev, newUser]);
        return newUser;
    };

    const login = (name, password) => {
        const formattedName = capitalize(name);
        const foundUser = users.find(u => u.name === formattedName && u.password === password);
        if (!foundUser) {
            throw new Error('Invalid username or password');
        }
        setUser(foundUser);
        return foundUser;
    };

    const logout = () => {
        setUser(null);
    };

    const updateProfile = (updates) => {
        const formattedUpdates = { ...updates };
        if (updates.name) formattedUpdates.name = capitalize(updates.name);

        const updatedUser = { ...user, ...formattedUpdates };
        setUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    };

    const changeTheme = (themeKey) => {
        setCurrentTheme(themeKey);
    };

    const emergencyReset = () => {
        localStorage.clear();
        await supabase.auth.signOut();
        window.location.reload();
    };

    // Derived state for easier access in components
    const role = user?.user_metadata?.role;

    const value = {
        user,
        users,
        signup,
        login,
        logout,
        updateProfile,
        emergencyReset,
        changeTheme,
        currentTheme,
        isAdmin: role === ROLES.ADMIN,
        isBiller: role === ROLES.BILLER,
        isGuest: role === ROLES.GUEST
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
