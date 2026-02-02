import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Palette, Check, Save, Mail, Phone, MapPin, Camera, RefreshCw, LogOut } from 'lucide-react';
import { useAuth, THEMES } from '../../context/AuthContext';

const SettingsModal = ({ isOpen, onClose, onRestoreDefaults }) => {
    const { user, updateProfile, changeTheme, currentTheme, isAdmin, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        avatar: user?.avatar || null
    });
    const [showSaved, setShowSaved] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile(formData);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-backdrop" onClick={onClose}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="glass modal-content"
                        style={{ maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Account Settings</h2>
                            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', fontWeight: '800' }}>Profile Information</h3>

                            {/* Avatar Upload Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        background: 'var(--glass-bg)',
                                        border: '2px solid var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => document.getElementById('avatar-upload').click()}
                                >
                                    {formData.avatar ? (
                                        <img src={formData.avatar} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <User size={40} color="var(--primary)" />
                                    )}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'rgba(0,0,0,0.6)',
                                        padding: '4px',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <Camera size={14} color="white" />
                                    </div>
                                </div>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Click to change profile picture</p>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><User size={16} color="var(--primary)" /> Display Name</label>
                                <input
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your Name"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}><Mail size={14} color="var(--primary)" /> Email</label>
                                    <input
                                        className="form-input"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}><Phone size={14} color="var(--primary)" /> Phone</label>
                                    <input
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+91 12345 67890"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><MapPin size={16} color="var(--primary)" /> Store/Personal Address</label>
                                <textarea
                                    className="form-input"
                                    style={{ minHeight: '80px' }}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Enter full address details..."
                                />
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to logout?')) {
                                        logout();
                                        onClose();
                                    }
                                }}
                                className="btn btn-secondary"
                                style={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    marginTop: '1rem',
                                    marginBottom: '1rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid var(--accent)',
                                    color: 'var(--accent)'
                                }}
                            >
                                <LogOut size={18} /> Logout
                            </button>

                            {isAdmin && (
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Palette size={16} /> Appearance Theme</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                                        {Object.entries(THEMES).map(([key, theme]) => (
                                            <div
                                                key={key}
                                                onClick={() => changeTheme(key)}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '0.75rem',
                                                    background: currentTheme === key ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.2)',
                                                    border: `1px solid ${currentTheme === key ? 'var(--primary)' : 'var(--glass-border)'}`,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    position: 'relative'
                                                }}
                                            >
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: theme.primary, marginBottom: '0.5rem' }} />
                                                <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{theme.name}</p>
                                                {currentTheme === key && <Check size={16} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'var(--primary)' }} />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                                {showSaved ? <><Check size={20} /> Changes Saved!</> : <><Save size={20} /> Save Profile</>}
                            </button>
                        </form>

                        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                            {isAdmin && (
                                <button
                                    onClick={() => {
                                        if (window.confirm('Restore default menu items and categories?')) {
                                            onRestoreDefaults();
                                            onClose();
                                        }
                                    }}
                                    style={{
                                        background: 'rgba(255, 140, 0, 0.1)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'var(--primary)',
                                        padding: '0.6rem 1rem',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.85rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '1rem',
                                        width: '100%',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                    className="hover-glass"
                                >
                                    <RefreshCw size={16} /> Restore Default Menu
                                </button>
                            )}
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>LoggedIn as <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{user?.role}</span></p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
