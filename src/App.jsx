import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import ProductCard from './components/Menu/ProductCard';
import CartDrawer from './components/Cart/CartDrawer';
import AddProductModal from './components/Menu/AddProductModal';
import ReportsModal from './components/Menu/ReportsModal';
import SignUp from './components/SignUp';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { ShoppingCart, Plus, Search, ChevronRight, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabaseClient';

function AppContent() {
  const { cart } = useCart();
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const dynamicCategories = ['ALL', ...new Set(products.map(p => p.category?.toUpperCase()).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const matchesCategory = activeCategory === 'ALL' || (p.category && p.category.toUpperCase() === activeCategory);
    return matchesSearch && matchesCategory;
  });

  const groupedProducts = filteredProducts.reduce((acc, p) => {
    const category = p.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(p);
    return acc;
  }, {});

  const handleAddProduct = async (newProduct) => {
    try {
      // Remove id if it's a temp ID or let DB handle it
      const { id, ...productData } = newProduct;
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      setProducts([...products, data]);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!window.confirm(`Are you sure you want to delete all products in ${categoryName}?`)) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .ilike('category', categoryName);

      if (error) throw error;

      setProducts(products.filter(p => p.category?.toUpperCase() !== categoryName.toUpperCase()));
      if (activeCategory === categoryName.toUpperCase()) {
        setActiveCategory('ALL');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const restoreDefaultMenu = () => {
    // This functionality might need to be rethought for a real DB
    // For now, we'll just log it or maybe re-insert default items if the DB is empty?
    alert("Restoring defaults is disabled in database mode to prevent overwriting live data.");
  };

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-main)' }}>
            Loading menu...
        </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '5rem' }}>
      <Navbar onRestoreDefaults={restoreDefaultMenu} />

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Ahmed's Center</h2>
        </header>

        <div className="search-container" style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
          <input
            type="text"
            placeholder="Search for snacks..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {dynamicCategories.map(cat => (
            <button
              key={cat}
              className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                {category} <ChevronRight size={20} color="var(--primary)" />
              </h3>
              <div className="glass" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
                {items.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              No items found matching your search.
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 1000 }} className="no-print">
        {isAdmin && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary"
              style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, justifyContent: 'center', boxShadow: '0 10px 25px rgba(255, 140, 0, 0.5)' }}
            >
              <Plus size={32} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsReportsOpen(true)}
              className="btn btn-secondary glass"
              style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}
            >
              <BarChart3 size={28} />
            </motion.button>
          </>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
          className="btn btn-secondary glass"
          style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, justifyContent: 'center', position: 'relative' }}
        >
          <ShoppingCart size={28} />
          {cart.length > 0 && (
            <span style={{
              position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary)', color: 'white',
              fontSize: '0.8rem', width: '24px', height: '24px', borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
            }}>
              {cart.length}
            </span>
          )}
        </motion.button>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
        onDeleteCategory={handleDeleteCategory}
        existingCategories={dynamicCategories.filter(c => c !== 'ALL')}
      />
      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
      />
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
      return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0807', color: 'white' }}>
            Loading...
        </div>
      );
  }

  return (
    <AnimatePresence mode="wait">
      {user ? (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AppContent />
        </motion.div>
      ) : (
        <motion.div
          key="signup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SignUp />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
