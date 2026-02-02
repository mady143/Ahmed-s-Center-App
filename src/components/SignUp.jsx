import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, LogIn, UserPlus, Key, AlertCircle, Eye, EyeOff, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';

const Auth = () => {
    const { signup, login, emergencyReset } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        role: ROLES.BILLER
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name.trim() || !formData.password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            if (isLogin) {
                await login(formData.name, formData.password);
            } else {
                await signup(formData);
                setSuccess('User created Successfully');
                setFormData({ name: '', password: '', role: ROLES.BILLER });
                setTimeout(() => {
                    setIsLogin(true);
                    setSuccess('');
                }, 2000);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="signup-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass signup-card"
            >
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem' }}>
                        Ahmed's <span style={{ color: 'var(--primary)' }}>Center</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? 'Welcome back! Please login' : 'Create your account to continue'}
                    </p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        background: 'rgba(0,0,0,0.2)',
                        padding: '0.25rem',
                        borderRadius: '0.75rem',
                        marginBottom: '2rem',
                        border: '1px solid var(--glass-border)'
                    }}
                >
                    <button
                        onClick={() => { setIsLogin(true); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '0.6rem',
                            borderRadius: '0.5rem',
                            background: isLogin ? 'var(--primary)' : 'transparent',
                            color: isLogin ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '0.6rem',
                            borderRadius: '0.5rem',
                            background: !isLogin ? 'var(--primary)' : 'transparent',
                            color: !isLogin ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <User size={16} /> Username
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="form-group" style={{ textAlign: 'left' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <Key size={16} /> Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter password"
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'left' }}>Select Role</p>
                            <div className="role-cards" style={{ margin: 0 }}>
                                {[
                                    { id: ROLES.ADMIN, label: 'Admin', icon: <Shield size={20} /> },
                                    { id: ROLES.BILLER, label: 'Biller', icon: <User size={20} /> }
                                ].map((role) => (
                                    <div
                                        key={role.id}
                                        className={`role-card ${formData.role === role.id ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, role: role.id })}
                                        style={{ padding: '0.75rem' }}
                                    >
                                        {role.icon}
                                        <span>{role.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    color: '#f87171',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.85rem',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <AlertCircle size={16} /> {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                    color: '#34d399',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.85rem',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <CheckCircle size={16} /> {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                        {isLogin ? <><LogIn size={20} /> Login</> : <><UserPlus size={20} /> Create Account</>}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Having trouble with credentials?</p>
                    <button
                        onClick={() => {
                            if (window.confirm('This will delete all users and data. Are you sure?')) {
                                emergencyReset();
                            }
                        }}
                        style={{
                            background: 'none',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            margin: '0 auto',
                            cursor: 'pointer'
                        }}
                        className="hover-glass"
                    >
                        <RefreshCw size={14} /> Reset System Data
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
