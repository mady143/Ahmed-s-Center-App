import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, User, LogOut, Settings } from 'lucide-react';
import LogoutModal from './LogoutModal';
import SettingsModal from './SettingsModal';

const Navbar = ({ onRestoreDefaults }) => {
    const { user, logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <nav className="glass no-print" style={{
                margin: '0.5rem',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: '0.5rem',
                zIndex: 1000,
                borderBottom: '1px solid var(--glass-border)'
            }}>
                {/* Logo Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', boxShadow: '0 4px 15px rgba(255, 140, 0, 0.3)' }}>
                        <Store size={24} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.025em', lineHeight: 1 }}>
                            Ahmed's <span style={{ color: 'var(--primary)' }}>Center</span>
                        </h1>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Snacks</p>
                    </div>
                </div>

                {/* Right Side Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* User Profile info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: '800', lineHeight: 1 }}>{user?.name || 'User'}</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>{user?.role}</p>
                        </div>

                        {/* Avatar with Settings Badge */}
                        <div
                            onClick={() => setIsSettingsOpen(true)}
                            style={{
                                position: 'relative',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                background: user?.avatar ? 'transparent' : 'linear-gradient(135deg, var(--primary), var(--accent))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                border: '2px solid rgba(255,255,255,0.1)',
                                transition: 'transform 0.3s ease',
                                overflow: 'hidden'
                            }} className="hover-scale">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={22} color="white" />
                                )}
                            </div>

                            {/* Settings Badge Overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-2px',
                                right: '-2px',
                                background: 'var(--bg-main)',
                                border: '2px solid var(--glass-border)',
                                borderRadius: '50%',
                                padding: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
                            }}>
                                <Settings size={10} color="var(--primary)" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={() => {
                    setIsLogoutModalOpen(false);
                    logout();
                }}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onRestoreDefaults={onRestoreDefaults}
            />
        </>
    );
};

export default Navbar;
