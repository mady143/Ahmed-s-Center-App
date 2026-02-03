import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 3000 }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="glass modal-content"
                        style={{
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center',
                            padding: '2.5rem 2rem',
                            border: '1px solid var(--glass-border)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{
                            width: '70px',
                            height: '70px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            border: '1px solid var(--accent)',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)'
                        }}>
                            <LogOut color="var(--accent)" size={32} />
                        </div>

                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontWeight: '900', color: 'var(--text-main)' }}>Confirm Logout</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: '1.5' }}>
                            Are you sure you want to logout from <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Ahmed's Center</span>?
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                            <button
                                onClick={onClose}
                                className="btn btn-secondary"
                                style={{
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    padding: '0.8rem'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="btn btn-primary"
                                style={{
                                    background: 'linear-gradient(135deg, var(--accent), #b91c1c)',
                                    boxShadow: '0 8px 16px 0 rgba(239, 68, 68, 0.4)',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    padding: '0.8rem'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LogoutModal;
