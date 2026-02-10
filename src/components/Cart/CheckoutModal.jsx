import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, CheckCircle } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="glass"
                        style={{
                            maxWidth: '400px',
                            width: '100%',
                            padding: '2rem',
                            textAlign: 'center',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            border: '1px solid var(--glass-border)'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(255, 140, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: 'var(--primary)'
                        }}>
                            <Printer size={32} />
                        </div>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Print Receipt?</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Would you like to print the receipt for this transaction?
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => onConfirm(false)}
                                className="btn btn-secondary"
                                style={{ flex: 1, justifyContent: 'center', padding: '1rem' }}
                            >
                                No
                            </button>
                            <button
                                onClick={() => onConfirm(true)}
                                className="btn btn-primary"
                                style={{ flex: 1, justifyContent: 'center', padding: '1rem' }}
                            >
                                <Printer size={20} style={{ marginRight: '0.5rem' }} /> Yes, Print
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CheckoutModal;
