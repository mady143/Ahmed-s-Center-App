import React, { useRef, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSales } from '../../context/SalesContext';
import { Trash2, Plus, Minus, Printer, X, ShoppingBag } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Receipt from '../Print/Receipt';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const { recordSale } = useSales();
    const componentRef = useRef();
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: "Ahmed's Center",
        onAfterPrint: () => {
            recordSale(cart, totalPrice);
            clearCart();
            onClose();
        }
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1100 }}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="glass"
                        style={{
                            position: 'fixed',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: '100%',
                            maxWidth: '400px',
                            zIndex: 1200,
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
                            borderRadius: '1.5rem 0 0 1.5rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <ShoppingBag size={28} color="var(--primary)" /> Cart
                            </h2>
                            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                                    Your cart is empty
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                                        <div style={{ flexGrow: 1 }}>
                                            <h4 style={{ fontWeight: '600' }}>{item.name}</h4>
                                            <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${item.price}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button onClick={() => updateQuantity(item.id, -1)} className="btn btn-secondary" style={{ padding: '0.2rem' }}><Minus size={14} /></button>
                                            <span style={{ fontWeight: 'bold', minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="btn btn-secondary" style={{ padding: '0.2rem' }}><Plus size={14} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Payment Method Selection */}
                                <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.9rem' }}>Payment Method</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1 }}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Cash"
                                                checked={paymentMethod === 'Cash'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                style={{ cursor: 'pointer', accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                                            />
                                            <span style={{ fontSize: '0.95rem' }}>Cash</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flex: 1 }}>
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="QR Code"
                                                checked={paymentMethod === 'QR Code'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                style={{ cursor: 'pointer', accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                                            />
                                            <span style={{ fontSize: '0.95rem' }}>QR Code</span>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700' }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--primary)' }}>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        handlePrint();
                                        // Optional: clearCart() after print in real scenario
                                    }}
                                    className="btn btn-primary"
                                    style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
                                >
                                    <Printer size={20} /> Print Receipt
                                </button>
                                <button onClick={clearCart} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                                    Clear Cart
                                </button>
                            </div>
                        )}

                        {/* Hidden Receipt for Printing */}
                        <div style={{ display: 'none' }}>
                            <Receipt ref={componentRef} cart={cart} total={totalPrice} paymentMethod={paymentMethod} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
