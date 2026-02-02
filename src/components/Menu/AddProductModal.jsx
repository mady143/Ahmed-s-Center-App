import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, ChevronDown, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

const AddProductModal = ({ isOpen, onClose, onAdd, onEdit, onDeleteCategory, existingCategories, productToEdit }) => {
    const initialFormState = {
        name: '',
        price: '',
        description: '',
        category: 'Veg',
        image: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [imageFile, setImageFile] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name || '',
                price: productToEdit.price || '',
                description: productToEdit.description || '',
                category: productToEdit.category || 'Veg',
                image: productToEdit.image || ''
            });
            setImageFile(null);
            setIsNewCategory(false);
        } else {
            setFormData(initialFormState);
            setImageFile(null);
        }
    }, [productToEdit, isOpen]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview for immediate UI feedback
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = formData.image;

        // Upload image to Supabase Storage if a new file was selected
        if (imageFile) {
            try {
                console.log('Starting image upload...', imageFile.name);
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = fileName;

                console.log('Uploading to path:', filePath);

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, imageFile);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    throw uploadError;
                }

                console.log('Upload successful:', uploadData);

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                console.log('Public URL:', publicUrl);
                imageUrl = publicUrl;
            } catch (error) {
                console.error('Error uploading image:', error);
                alert(`Failed to upload image: ${error.message}\n\nPlease check:\n1. Is your bucket named "products"?\n2. Is the bucket public?\n3. Did you run the storage policies?`);
                return;
            }
        }

        const category = isNewCategory ? newCategoryName : formData.category;

        const productData = {
            ...formData,
            image: imageUrl,
            category: category || 'Other',
            price: parseFloat(formData.price)
        };

        if (productToEdit) {
            onEdit({ ...productData, id: productToEdit.id });
        } else {
            onAdd({ ...productData, id: Date.now() });
        }

        if (!productToEdit) {
            setFormData(initialFormState);
            setImageFile(null);
        }

        setIsNewCategory(false);
        setNewCategoryName('');
        onClose();
    };

    const categories = Array.from(new Set(['VEG', 'NON-VEG', 'BEVERAGES', ...existingCategories.map(c => c.toUpperCase())]));

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="modal-backdrop" onClick={onClose}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass modal-content"
                            style={{ overflow: 'visible' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '900' }}>
                                    {productToEdit ? 'Edit Item' : 'Add New Item'}
                                </h2>
                                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Item Name</label>
                                    <input
                                        required
                                        className="form-input"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Dry Gobi Full Plate"
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                        <label>Price (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            className="form-input"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="100"
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1, marginBottom: 0, position: 'relative' }}>
                                        <label>Category</label>
                                        {!isNewCategory ? (
                                            <div style={{ position: 'relative' }}>
                                                <div
                                                    className="form-input"
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        background: 'rgba(255, 255, 255, 0.05)'
                                                    }}
                                                >
                                                    {formData.category}
                                                    <ChevronDown size={18} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
                                                </div>

                                                <AnimatePresence>
                                                    {isDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '100%',
                                                                left: 0,
                                                                right: 0,
                                                                background: '#1a1817',
                                                                borderRadius: '0.75rem',
                                                                marginTop: '0.5rem',
                                                                zIndex: 100,
                                                                border: '1px solid var(--glass-border)',
                                                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                                                maxHeight: '200px',
                                                                overflowY: 'auto'
                                                            }}
                                                        >
                                                            {categories.map(cat => (
                                                                <div
                                                                    key={cat}
                                                                    style={{
                                                                        padding: '0.75rem 1rem',
                                                                        display: 'flex',
                                                                        justifyContent: 'space-between',
                                                                        alignItems: 'center',
                                                                        cursor: 'pointer',
                                                                        borderBottom: '1px solid rgba(255,255,255,0.05)'
                                                                    }}
                                                                    className="hover-glass"
                                                                    onClick={() => {
                                                                        setFormData({ ...formData, category: cat });
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{cat}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setCategoryToDelete(cat);
                                                                        }}
                                                                        style={{
                                                                            background: 'none',
                                                                            border: 'none',
                                                                            color: 'var(--accent)',
                                                                            cursor: 'pointer',
                                                                            padding: '4px',
                                                                            borderRadius: '4px',
                                                                            display: 'flex',
                                                                            alignItems: 'center'
                                                                        }}
                                                                        className="hover-scale"
                                                                    >
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <div
                                                                style={{
                                                                    padding: '0.75rem 1rem',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.5rem',
                                                                    cursor: 'pointer',
                                                                    color: 'var(--primary)',
                                                                    fontWeight: 'bold'
                                                                }}
                                                                className="hover-glass"
                                                                onClick={() => {
                                                                    setIsNewCategory(true);
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                            >
                                                                <PlusCircle size={16} /> New Category
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                                <input
                                                    required
                                                    className="form-input"
                                                    value={newCategoryName}
                                                    onChange={e => setNewCategoryName(e.target.value)}
                                                    placeholder="Category Name"
                                                    autoFocus
                                                    style={{ flex: 1 }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setIsNewCategory(false)}
                                                    style={{ padding: '0.5rem', minWidth: 'auto', borderRadius: '0.75rem' }}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        className="form-input"
                                        style={{ minHeight: '80px' }}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Tell something about this dish..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={16} /> Product Image</label>
                                    <div
                                        onClick={() => document.getElementById('product-image-upload').click()}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: `2px dashed ${formData.image ? 'var(--primary)' : 'var(--glass-border)'}`,
                                            borderRadius: '1rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}
                                    >
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <>
                                                <Upload size={32} color="var(--text-muted)" />
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Click to upload image</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        id="product-image-upload"
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                                    {productToEdit ? 'Save Changes' : 'Add to Menu'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Deletion Confirmation Popup */}
            <AnimatePresence>
                {categoryToDelete && (
                    <div className="modal-backdrop" style={{ zIndex: 3000 }} onClick={() => setCategoryToDelete(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass modal-content"
                            style={{ maxWidth: '400px', textAlign: 'center' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid var(--accent)' }}>
                                <Trash2 size={32} color="var(--accent)" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Delete Category?</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Are you sure you want to delete <strong style={{ color: 'var(--text-main)' }}>"{categoryToDelete}"</strong>?
                                <br />
                                <span style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>Warning: All items in this category will be removed.</span>
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button className="btn btn-secondary" onClick={() => setCategoryToDelete(null)} style={{ justifyContent: 'center' }}>Cancel</button>
                                <button
                                    className="btn btn-primary"
                                    style={{ background: 'var(--accent)', boxShadow: 'none', justifyContent: 'center' }}
                                    onClick={() => {
                                        onDeleteCategory(categoryToDelete);
                                        setCategoryToDelete(null);
                                        if (formData.category === categoryToDelete) {
                                            setFormData({ ...formData, category: 'Veg' });
                                        }
                                    }}
                                >
                                    Delete All
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AddProductModal;
