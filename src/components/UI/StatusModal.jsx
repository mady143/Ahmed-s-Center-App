import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const StatusModal = ({ isOpen, onClose, message, type = 'success', title }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 3000,
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
                            padding: '2.5rem 2rem',
                            textAlign: 'center',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                            position: 'relative'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '20px',
                            background: isSuccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: isSuccess ? '#10b981' : '#ef4444',
                            transform: 'rotate(-5deg)'
                        }}>
                            {isSuccess ? <CheckCircle size={40} /> : <AlertCircle size={40} />}
                        </div>

                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '800',
                            marginBottom: '0.75rem',
                            color: '#fff'
                        }}>
                            {title || (isSuccess ? 'Success!' : 'Error')}
                        </h3>

                        <p style={{
                            color: 'var(--text-muted)',
                            marginBottom: '2rem',
                            fontSize: '1.05rem',
                            lineHeight: '1.5'
                        }}>
                            {message}
                        </p>

                        <button
                            onClick={onClose}
                            className={`btn ${isSuccess ? 'btn-primary' : 'btn-danger'}`}
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                padding: '1rem',
                                background: isSuccess ? '#10b981' : '#ef4444',
                                borderRadius: '1rem',
                                fontWeight: '700',
                                fontSize: '1rem'
                            }}
                        >
                            Continue
                        </button>

                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StatusModal;
