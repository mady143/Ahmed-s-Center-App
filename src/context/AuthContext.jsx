import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLES } from '../constants';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const THEMES = {
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
        // Check active sessions and sets the user
        const session = supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

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
        const email = `${formattedName.replace(/\s+/g, '')}@ahmedcenter.com`;

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: userData.password,
            options: {
                data: {
                    name: formattedName,
                    role: userData.role || ROLES.BILLER,
                    avatar: userData.avatar || null
                }
            }
        });

        if (error) throw error;
        return data;
    };

    const login = async (name, password) => {
        const formattedName = capitalize(name);
        const email = `${formattedName.replace(/\s+/g, '')}@ahmedcenter.com`;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;
        return data.user;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    const updateProfile = async (updates) => {
        const { error } = await supabase.auth.updateUser({
            data: updates
        });
        if (error) throw error;
    };

    const changeTheme = (themeKey) => {
        setCurrentTheme(themeKey);
    };

    const emergencyReset = async () => {
        localStorage.clear();
        await supabase.auth.signOut();
        window.location.reload();
    };

    // Derived state for easier access in components
    const role = user?.user_metadata?.role;

    const value = {
        user: user ? { ...user, ...user.user_metadata, role } : null,
        loading,
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
