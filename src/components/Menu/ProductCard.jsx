import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Plus, Info, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onEdit }) => {
    const { isGuest, isAdmin } = useAuth();
    const { addToCart } = useCart();

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="product-list-item"
        >
            <div className="product-info" style={{ flexGrow: 1 }}>
                <h4 style={{ fontWeight: '600' }}>{product.name}</h4>
                <p className="product-price">₹{new Intl.NumberFormat('en-IN').format(product.price)}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', maxWidth: '80%' }}>
                    {product.description}
                </p>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {!isGuest ? (
                        <button
                            onClick={() => addToCart(product)}
                            className="btn btn-primary"
                            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                        >
                            <Plus size={16} /> Add to Cart
                        </button>
                    ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', padding: '0.2rem 0.5rem', borderRadius: '0.4rem' }}>
                            Guest View
                        </span>
                    )}

                    {isAdmin && (
                        <button
                            onClick={() => onEdit && onEdit(product)}
                            className="btn btn-secondary glass"
                            style={{ padding: '0.4rem', borderRadius: '0.5rem', height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Edit Item"
                        >
                            <Pencil size={14} />
                        </button>
                    )}
                </div>
            </div>

            <div style={{ width: '100px', height: '100px', borderRadius: '1rem', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--glass-border)', marginLeft: '1.5rem' }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
        </motion.div>
    );
};

export default ProductCard;
