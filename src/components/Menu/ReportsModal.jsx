import React, { useState, forwardRef } from 'react';
import { useSales } from '../../context/SalesContext';
import { BarChart3, TrendingUp, Package, IndianRupee, Printer, Calendar, X, FileSpreadsheet, List, Edit, Trash2, Save, Trash, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Receipt from '../Print/Receipt';
import StatusModal from '../UI/StatusModal';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportPrint = forwardRef(({ summary }, ref) => (
    <div ref={ref} style={{
        padding: '40px',
        color: '#000',
        background: '#fff',
        fontFamily: 'monospace',
        position: 'relative',
        overflow: 'hidden'
    }}>
        {/* Watermarks */}
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%) rotate(-25deg)', fontSize: '32px', opacity: 0.08, fontWeight: '900', color: '#000', whiteSpace: 'nowrap', pointerEvents: 'none', width: '100%', textAlign: 'center' }}>AHMED'S CENTER</div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-25deg)', fontSize: '32px', opacity: 0.08, fontWeight: '900', color: '#000', whiteSpace: 'nowrap', pointerEvents: 'none', width: '100%', textAlign: 'center' }}>AHMED'S CENTER</div>
        <div style={{ position: 'absolute', top: '85%', left: '50%', transform: 'translate(-50%, -50%) rotate(-25deg)', fontSize: '32px', opacity: 0.08, fontWeight: '900', color: '#000', whiteSpace: 'nowrap', pointerEvents: 'none', width: '100%', textAlign: 'center' }}>AHMED'S CENTER</div>

        <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ textAlign: 'center', textTransform: 'uppercase', marginBottom: '5px' }}>Ahmed's Center - Sales Report</h2>
            <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>
                <p>Period: {summary.period.toUpperCase()}</p>
                <p>Range: {summary.startDate.toLocaleDateString()} - {summary.endDate.toLocaleDateString()}</p>
                <p>Generated: {new Date().toLocaleString()}</p>
            </div>
            <p>------------------------------------------</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold' }}>
                <span>Total Revenue:</span>
                <span>₹{summary.totalRevenue.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Total Plates Sold:</span>
                <span>{summary.totalPlates}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Total Orders:</span>
                <span>{summary.saleCount}</span>
            </div>
            <p>------------------------------------------</p>
            <h3 style={{ margin: '15px 0 10px 0' }}>Item-wise Sales:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', fontWeight: 'bold' }}>
                <span>Item</span>
                <span style={{ textAlign: 'center' }}>Qty</span>
                <span style={{ textAlign: 'right' }}>Revenue</span>
            </div>
            <p>------------------------------------------</p>
            {Object.entries(summary.items).map(([name, data]) => (
                <div key={name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '5px', marginBottom: '5px' }}>
                    <span>{name}</span>
                    <span style={{ textAlign: 'center' }}>{data.quantity}</span>
                    <span style={{ textAlign: 'right' }}>₹{data.revenue.toFixed(2)}</span>
                </div>
            ))}
            <p style={{ textAlign: 'center', marginTop: '20px' }}>End of Report</p>
        </div>
    </div>
));

const EditSaleView = ({ sale, onSave, onCancel }) => {
    const [items, setItems] = useState(typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items);

    // Recalculate total whenever items change
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    return (
        <div className="glass" style={{ padding: '1.5rem', marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit size={20} /> Edit Sale - {new Date(sale.timestamp).toLocaleString()}
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.5rem' }}>Item</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Qty</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Price</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Total</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '0.5rem' }}>{item.name}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{item.price}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                <button
                                    onClick={() => handleRemoveItem(index)}
                                    className="btn btn-danger"
                                    style={{ padding: '0.25rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '1rem', color: '#ef4444' }}>
                                Warning: Saving with no items will result in a 0 amount sale.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <div style={{ marginRight: 'auto', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    New Total: ₹{total.toFixed(2)}
                </div>
                <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
                <button
                    onClick={() => onSave(items, total)}
                    className="btn btn-primary"
                    style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                    <Save size={18} /> Save Changes
                </button>
            </div>
        </div>
    );
};

const WastageView = ({ summary, onAdd, onDelete, products = [], setStatusModal }) => {
    const [newItem, setNewItem] = useState({
        name: '',
        quantity: '1',
        cost: '',
        date: new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
    });
    const [showConfirm, setShowConfirm] = useState(false);

    const handleItemSelect = (e) => {
        const selectedProductName = e.target.value;
        const product = products.find(p => p.name === selectedProductName);

        if (product) {
            setNewItem({
                ...newItem,
                name: product.name,
                cost: product.price
            });
        } else {
            setNewItem({
                ...newItem,
                name: '',
                cost: ''
            });
        }
    };

    const handleSaveClick = (e) => {
        if (e) e.preventDefault();

        if (!newItem.name) {
            setStatusModal({ isOpen: true, message: 'Please select an item from the menu.', title: 'Missing Item', type: 'error' });
            return;
        }
        if (!newItem.quantity || parseInt(newItem.quantity) <= 0) {
            setStatusModal({ isOpen: true, message: 'Please enter a valid quantity greater than 0.', title: 'Invalid Quantity', type: 'error' });
            return;
        }
        if (!newItem.cost) {
            setStatusModal({ isOpen: true, message: 'Product cost missing. Please re-select the item.', title: 'Missing Price', type: 'error' });
            return;
        }

        setShowConfirm(true);
    };

    const handleConfirmSave = async () => {
        const [y, m, d] = newItem.date.split('-').map(Number);
        const selectedDate = new Date(y, m - 1, d);
        const now = new Date();
        selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

        const result = await onAdd(newItem.name, newItem.quantity, newItem.cost, '', selectedDate.toISOString());

        setShowConfirm(false);

        if (result.success) {
            setNewItem({
                ...newItem,
                name: '',
                cost: ''
            });
            setStatusModal({ isOpen: true, message: 'Wastage record has been saved successfully.', title: 'Wastage Recorded', type: 'success' });
        } else {
            setStatusModal({ isOpen: true, message: 'Failed to record wastage. Please try again.', title: 'Wastage Error', type: 'error' });
        }
    };

    const handleClear = () => {
        setNewItem({
            name: '',
            quantity: '1',
            cost: '',
            date: new Date().toLocaleDateString('en-CA')
        });
    };

    return (
        <div className="glass" style={{ padding: '1.5rem', marginTop: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trash2 size={20} /> Manage Wastage (Losses)
                </h3>
                <button
                    onClick={handleSaveClick}
                    className="btn btn-primary"
                    style={{ background: '#10b981', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                    <Save size={18} /> Save to Table
                </button>
            </div>

            <form onSubmit={handleSaveClick} style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2.5rem',
                alignItems: 'flex-end',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '1.2rem',
                borderRadius: '1rem',
                border: '1px solid var(--glass-border)'
            }}>
                <div style={{ flex: '1 1 120px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>Date</label>
                    <input
                        type="date"
                        className="form-input"
                        value={newItem.date}
                        onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ flex: '2 1 200px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>Item Name</label>
                    <select
                        className="form-input"
                        value={newItem.name}
                        onChange={handleItemSelect}
                        style={{ width: '100%', cursor: 'pointer' }}
                    >
                        <option value="">Select Item...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: '0.8 1 80px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>Qty</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Qty"
                        required
                        min="1"
                        step="1"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ flex: '1 1 100px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'block' }}>Cost/Unit</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="₹"
                        value={newItem.cost}
                        readOnly
                        style={{ opacity: 0.8, cursor: 'not-allowed', background: 'rgba(255, 255, 255, 0.05)', width: '100%' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="btn btn-danger"
                        title="Clear Form"
                        style={{
                            padding: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '0.75rem',
                            height: 'fit-content'
                        }}
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        title="Add Record"
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#10b981',
                            borderRadius: '0.75rem',
                            height: 'fit-content',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Plus size={20} /> Add
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 2000, padding: '1rem'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass"
                            style={{
                                padding: '2rem', maxWidth: '400px', width: '100%',
                                textAlign: 'center', border: '1px solid var(--primary)'
                            }}
                        >
                            <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Trash2 size={48} /></div>
                            <h3 style={{ marginBottom: '1rem' }}>Confirm Wastage</h3>
                            <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Item:</span>
                                    <span style={{ fontWeight: 'bold' }}>{newItem.name}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Quantity:</span>
                                    <span style={{ fontWeight: 'bold' }}>{newItem.quantity}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Total Loss:</span>
                                    <span style={{ fontWeight: 'bold', color: '#ef4444' }}>₹{(newItem.quantity * newItem.cost).toFixed(2)}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={handleConfirmSave} className="btn btn-primary" style={{ flex: 1, background: '#10b981' }}>Save</button>
                                <button onClick={() => setShowConfirm(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ marginTop: '2rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <List size={18} /> Saved Records
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '1rem' }}>Time</th>
                            <th style={{ padding: '1rem' }}>Item</th>
                            <th style={{ padding: '1rem' }}>Qty</th>
                            <th style={{ padding: '1rem' }}>Loss Amount</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.filteredWastage.map((waste) => (
                            <tr key={waste.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    {new Date(waste.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(waste.timestamp).toLocaleDateString()}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{waste.item_name}</td>
                                <td style={{ padding: '1rem' }}>{waste.quantity}</td>
                                <td style={{ padding: '1rem', color: '#ef4444' }}>₹{(waste.quantity * waste.cost_per_unit).toFixed(2)}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <button
                                        onClick={() => onDelete(waste.id)}
                                        className="btn btn-danger"
                                        style={{ padding: '0.4rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                                    >
                                        <Trash size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {summary.filteredWastage.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No wastage recorded for this period.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ReportsModal = ({ isOpen, onClose, products = [] }) => {
    const { getSalesSummary, addWastage, addBatchWastage, deleteWastage, updateSale } = useSales();
    const [period, setPeriod] = useState('daily');
    const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'transactions'
    const [editingSale, setEditingSale] = useState(null);
    const [customRange, setCustomRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [statusModal, setStatusModal] = useState({ isOpen: false, message: '', type: 'success', title: '' });
    const printRef = React.useRef();

    const [reprintSale, setReprintSale] = useState(null);
    const reprintRef = React.useRef();

    const handleReprint = useReactToPrint({
        contentRef: reprintRef,
        documentTitle: reprintSale ? `Ahmeds_Center_Receipt_${reprintSale.order_no || reprintSale.id}` : "Receipt"
    });

    const triggerReprint = (sale) => {
        setReprintSale(sale);
        // Wait for state update to render the Receipt before printing
        setTimeout(() => {
            handleReprint();
        }, 100);
    };

    const summary = getSalesSummary(period, customRange);

    const handlePrintDaily = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Ahmeds_Center_Report_${period}_${new Date().toISOString().split('T')[0]}`
    });

    const handleExportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');
        const now = new Date();

        worksheet.views = [{ showGridLines: true }];

        const thinBorder = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        // Title Row
        worksheet.mergeCells('A1:K1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = `Ahmed's Center Sales Report - ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.border = thinBorder;
        worksheet.getRow(1).height = 30;

        worksheet.addRow([]);

        // === DETAILED TRANSACTIONS TABLE ===
        const headers = ['Date', 'Time', 'Order No', 'Customer Name', 'Phone', 'Item Name', 'Quantity', 'Unit Price', 'Line Total', 'Payment Method', 'Sale Total'];
        const headerRow = worksheet.getRow(3);
        headerRow.values = headers;
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.height = 25;
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = thinBorder;
        });

        // Add transaction data (one row per item)
        summary.filteredSales.forEach((sale) => {
            const saleItems = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;
            const saleDate = new Date(sale.timestamp);

            saleItems.forEach((item) => {
                const row = worksheet.addRow([
                    saleDate.toLocaleDateString('en-GB'),
                    saleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sale.order_no || '-',
                    sale.customer_name || 'Cash Sale',
                    sale.phone_no || '8801788115',
                    item.name,
                    item.quantity,
                    item.price,
                    item.price * item.quantity,
                    sale.payment_method || 'Cash',
                    Number(sale.total)
                ]);

                row.eachCell((cell, colNumber) => {
                    cell.border = thinBorder;
                    if (colNumber >= 7 && colNumber <= 9) {
                        cell.alignment = { horizontal: 'right' };
                    }
                    if (colNumber === 8 || colNumber === 9 || colNumber === 11) {
                        cell.numFmt = '₹#,##0.00';
                    }
                });
            });
        });

        // Column widths for transactions
        worksheet.getColumn(1).width = 12;
        worksheet.getColumn(2).width = 10;
        worksheet.getColumn(3).width = 15;
        worksheet.getColumn(4).width = 20;
        worksheet.getColumn(5).width = 15;
        worksheet.getColumn(6).width = 25;
        worksheet.getColumn(7).width = 10;
        worksheet.getColumn(8).width = 12;
        worksheet.getColumn(9).width = 12;
        worksheet.getColumn(10).width = 15;
        worksheet.getColumn(11).width = 12;

        // === SUMMARY TABLES (to the right) ===
        const summaryStartCol = 13; // Column M

        // Calculate week number for each sale based on start date
        const startDate = summary.startDate;
        const getWeekNumber = (date) => {
            const diffTime = date - startDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return Math.floor(diffDays / 7) + 1;
        };

        // Group sales by week and item
        const weekItemData = {};
        summary.filteredSales.forEach(sale => {
            const saleDate = new Date(sale.timestamp);
            const week = getWeekNumber(saleDate);
            const weekLabel = `Week ${week}`;
            const items = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;

            items.forEach(item => {
                const key = `${weekLabel}|${item.name}`;
                if (!weekItemData[key]) {
                    weekItemData[key] = {
                        week: weekLabel,
                        item: item.name,
                        quantity: 0,
                        revenue: 0,
                        wastage: 0
                    };
                }
                weekItemData[key].quantity += item.quantity;
                weekItemData[key].revenue += item.price * item.quantity;
            });
        });

        // Group wastage by week and item
        summary.filteredWastage.forEach(w => {
            const wDate = new Date(w.timestamp);
            const week = getWeekNumber(wDate);
            const weekLabel = `Week ${week}`;
            const key = `${weekLabel}|${w.item_name}`;

            if (!weekItemData[key]) {
                weekItemData[key] = {
                    week: weekLabel,
                    item: w.item_name,
                    quantity: 0,
                    revenue: 0,
                    wastage: 0
                };
            }
            weekItemData[key].wastage += Number(w.quantity) * Number(w.cost_per_unit);
        });

        // Sort by week then by item name
        const sortedKeys = Object.keys(weekItemData).sort((a, b) => {
            const [weekA, itemA] = a.split('|');
            const [weekB, itemB] = b.split('|');
            const weekNumA = parseInt(weekA.replace('Week ', ''));
            const weekNumB = parseInt(weekB.replace('Week ', ''));
            if (weekNumA !== weekNumB) return weekNumA - weekNumB;
            return itemA.localeCompare(itemB);
        });

        // SALES SUMMARY BY ITEM
        const salesStartRow = 3;
        worksheet.mergeCells(salesStartRow, summaryStartCol, salesStartRow, summaryStartCol + 3);
        const salesTitleCell = worksheet.getCell(salesStartRow, summaryStartCol);
        salesTitleCell.value = 'SALES SUMMARY BY ITEM';
        salesTitleCell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        salesTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
        salesTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        salesTitleCell.border = thinBorder;

        const salesHeaderRow = salesStartRow + 1;
        ['Week', 'Item Name', 'Quantity Sold', 'Total Revenue'].forEach((h, i) => {
            const cell = worksheet.getCell(salesHeaderRow, summaryStartCol + i);
            cell.value = h;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
            cell.border = thinBorder;
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        let totalQty = 0, totalRevenue = 0;
        sortedKeys.forEach((key, i) => {
            const rowNum = salesHeaderRow + 1 + i;
            const data = weekItemData[key];
            totalQty += data.quantity;
            totalRevenue += data.revenue;

            const cells = [
                worksheet.getCell(rowNum, summaryStartCol),
                worksheet.getCell(rowNum, summaryStartCol + 1),
                worksheet.getCell(rowNum, summaryStartCol + 2),
                worksheet.getCell(rowNum, summaryStartCol + 3)
            ];

            cells[0].value = data.week;
            cells[1].value = data.item;
            cells[2].value = data.quantity;
            cells[3].value = data.revenue;

            cells.forEach(c => c.border = thinBorder);
            cells[0].alignment = { horizontal: 'left' };
            cells[1].alignment = { horizontal: 'left' };
            cells[2].alignment = { horizontal: 'center' };
            cells[3].alignment = { horizontal: 'right' };
            cells[3].numFmt = '₹#,##0.00';
        });

        const salesTotalRow = salesHeaderRow + sortedKeys.length + 1;
        const salesTotalCells = [
            worksheet.getCell(salesTotalRow, summaryStartCol),
            worksheet.getCell(salesTotalRow, summaryStartCol + 1),
            worksheet.getCell(salesTotalRow, summaryStartCol + 2),
            worksheet.getCell(salesTotalRow, summaryStartCol + 3)
        ];

        salesTotalCells[0].value = '';
        salesTotalCells[1].value = 'Grand Total';
        salesTotalCells[2].value = totalQty;
        salesTotalCells[3].value = totalRevenue;

        salesTotalCells.forEach(c => {
            c.font = { bold: true };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
            c.border = thinBorder;
        });
        salesTotalCells[0].alignment = { horizontal: 'left' };
        salesTotalCells[1].alignment = { horizontal: 'left' };
        salesTotalCells[2].alignment = { horizontal: 'center' };
        salesTotalCells[3].alignment = { horizontal: 'right' };
        salesTotalCells[3].numFmt = '₹#,##0.00';

        // PROFIT/LOSS SUMMARY BY ITEM
        const plStartRow = salesTotalRow + 3;
        worksheet.mergeCells(plStartRow, summaryStartCol, plStartRow, summaryStartCol + 4);
        const plTitleCell = worksheet.getCell(plStartRow, summaryStartCol);
        plTitleCell.value = 'PROFIT / LOSS SUMMARY BY ITEM';
        plTitleCell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        plTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
        plTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        plTitleCell.border = thinBorder;

        const plHeaderRow = plStartRow + 1;
        ['Week', 'Item Name', 'Revenue', 'Wastage Cost', 'Net Profit/Loss'].forEach((h, i) => {
            const cell = worksheet.getCell(plHeaderRow, summaryStartCol + i);
            cell.value = h;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002060' } };
            cell.border = thinBorder;
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        let totalPLRevenue = 0, totalWastage = 0, totalLoss = 0;
        sortedKeys.forEach((key, i) => {
            const rowNum = plHeaderRow + 1 + i;
            const data = weekItemData[key];
            const loss = data.wastage - data.revenue;

            totalPLRevenue += data.revenue;
            totalWastage += data.wastage;
            totalLoss += loss;

            const cells = [
                worksheet.getCell(rowNum, summaryStartCol),
                worksheet.getCell(rowNum, summaryStartCol + 1),
                worksheet.getCell(rowNum, summaryStartCol + 2),
                worksheet.getCell(rowNum, summaryStartCol + 3),
                worksheet.getCell(rowNum, summaryStartCol + 4)
            ];

            cells[0].value = data.week;
            cells[1].value = data.item;
            cells[2].value = data.revenue;
            cells[3].value = data.wastage;
            cells[4].value = loss;

            cells.forEach(c => c.border = thinBorder);
            cells[0].alignment = { horizontal: 'left' };
            cells[1].alignment = { horizontal: 'left' };
            cells[2].alignment = { horizontal: 'right' };
            cells[3].alignment = { horizontal: 'right' };
            cells[4].alignment = { horizontal: 'right' };

            cells[2].numFmt = '₹#,##0.00';
            cells[3].numFmt = '₹#,##0.00';
            cells[4].numFmt = '₹#,##0.00';
            cells[4].font = { color: { argb: loss > 0 ? 'FFFF0000' : 'FF008000' }, bold: true };
        });

        const plTotalRow = plHeaderRow + sortedKeys.length + 1;
        const plTotalCells = [
            worksheet.getCell(plTotalRow, summaryStartCol),
            worksheet.getCell(plTotalRow, summaryStartCol + 1),
            worksheet.getCell(plTotalRow, summaryStartCol + 2),
            worksheet.getCell(plTotalRow, summaryStartCol + 3),
            worksheet.getCell(plTotalRow, summaryStartCol + 4)
        ];

        plTotalCells[0].value = '';
        plTotalCells[1].value = 'Grand Total';
        plTotalCells[2].value = totalPLRevenue;
        plTotalCells[3].value = totalWastage;
        plTotalCells[4].value = totalLoss;

        plTotalCells.forEach(c => {
            c.font = { bold: true };
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } };
            c.border = thinBorder;
        });
        plTotalCells[0].alignment = { horizontal: 'left' };
        plTotalCells[1].alignment = { horizontal: 'left' };
        plTotalCells[2].alignment = { horizontal: 'right' };
        plTotalCells[3].alignment = { horizontal: 'right' };
        plTotalCells[4].alignment = { horizontal: 'right' };

        plTotalCells[2].numFmt = '₹#,##0.00';
        plTotalCells[3].numFmt = '₹#,##0.00';
        plTotalCells[4].numFmt = '₹#,##0.00';
        plTotalCells[4].font = { bold: true, color: { argb: totalLoss > 0 ? 'FFFF0000' : 'FF008000' } };

        // Summary columns
        worksheet.getColumn(summaryStartCol).width = 30;
        worksheet.getColumn(summaryStartCol + 1).width = 15;
        worksheet.getColumn(summaryStartCol + 2).width = 15;
        worksheet.getColumn(summaryStartCol + 3).width = 18;

        // Generate and save
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Ahmeds_Center_Report_${period}_${now.toISOString().split('T')[0]}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleSaveSale = async (items, total) => {
        if (!editingSale) return;

        const result = await updateSale(editingSale.id, items, total);
        if (result.success) {
            setEditingSale(null);
            setStatusModal({ isOpen: true, message: 'Sale has been updated successfully.', title: 'Sale Updated', type: 'success' });
        } else {
            setStatusModal({ isOpen: true, message: 'Failed to update sale. Please try again.', title: 'Update Error', type: 'error' });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-backdrop" onClick={onClose}>
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="glass modal-content"
                        style={{ maxWidth: '850px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem' }}>
                                <BarChart3 color="var(--primary)" /> Sales Reports <span style={{ fontSize: '0.8rem', opacity: 0.5, marginLeft: '0.5rem' }}>(v1.2)</span>
                            </h2>
                            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}><X size={20} /></button>
                        </div>

                        {/* Filter Selection */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                            <div className="filter-tabs" style={{ marginBottom: 0 }}>
                                {['daily', 'weekly', 'monthly', 'custom'].map(p => (
                                    <button
                                        key={p}
                                        className={`filter-tab ${period === p ? 'active' : ''}`}
                                        onClick={() => setPeriod(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}
                            >
                                {period === 'daily' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date:</span>
                                        <input
                                            type="date"
                                            className="form-input"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto' }}
                                            value={customRange.start}
                                            onChange={(e) => setCustomRange({ ...customRange, start: e.target.value, end: e.target.value })}
                                        />
                                    </div>
                                )}
                                {period === 'weekly' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Week Starting:</span>
                                        <input
                                            type="date"
                                            className="form-input"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto' }}
                                            value={customRange.start}
                                            onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                                        />
                                    </div>
                                )}
                                {period === 'monthly' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Month:</span>
                                        <input
                                            type="month"
                                            className="form-input"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto' }}
                                            value={customRange.start.substring(0, 7)}
                                            onChange={(e) => setCustomRange({ ...customRange, start: e.target.value + '-01' })}
                                        />
                                    </div>
                                )}
                                {period === 'custom' && (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From:</span>
                                            <input
                                                type="date"
                                                className="form-input"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto' }}
                                                value={customRange.start}
                                                onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>To:</span>
                                            <input
                                                type="date"
                                                className="form-input"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto' }}
                                                value={customRange.end}
                                                onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </div>

                        {/* Tab Switcher */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                            <button
                                className={`btn ${activeTab === 'summary' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => { setActiveTab('summary'); setEditingSale(null); }}
                            >
                                <BarChart3 size={18} style={{ marginRight: '0.5rem' }} /> Summary
                            </button>
                            <button
                                className={`btn ${activeTab === 'transactions' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => { setActiveTab('transactions'); setEditingSale(null); }}
                            >
                                <List size={18} style={{ marginRight: '0.5rem' }} /> Transactions
                            </button>
                            <button
                                className={`btn ${activeTab === 'wastage' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => { setActiveTab('wastage'); setEditingSale(null); }}
                            >
                                <Trash2 size={18} style={{ marginRight: '0.5rem' }} /> Wastage
                            </button>
                        </div>

                        {activeTab === 'summary' ? (
                            <>
                                <div className="glass" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.2rem' }}>Item-wise Breakdown</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {summary.startDate.toLocaleDateString()} - {summary.endDate.toLocaleDateString()}
                                        </p>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                                                <th style={{ padding: '1rem' }}>Item Name</th>
                                                <th style={{ padding: '1rem' }}>Plates Sold</th>
                                                <th style={{ padding: '1rem' }}>Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(summary.items).map(([name, data]) => (
                                                <tr key={name} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                    <td style={{ padding: '1rem' }}>
                                                        <div style={{ fontWeight: '600' }}>{name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{data.price} per plate</div>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>{data.quantity}</td>
                                                    <td style={{ padding: '1rem' }}>₹{data.revenue.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            {Object.keys(summary.items).length === 0 && (
                                                <tr>
                                                    <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No sales recorded for this period.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button
                                        onClick={handlePrintDaily}
                                        className="btn btn-secondary"
                                        style={{ flex: 1, justifyContent: 'center', padding: '1rem' }}
                                    >
                                        <Printer size={20} /> Print Report
                                    </button>
                                    <button
                                        onClick={handleExportToExcel}
                                        className="btn btn-primary"
                                        style={{ flex: 1, justifyContent: 'center', padding: '1rem' }}
                                    >
                                        <FileSpreadsheet size={20} /> Export Excel
                                    </button>
                                </div>
                            </>
                        ) : activeTab === 'transactions' ? (
                            <div>
                                {editingSale ? (
                                    <EditSaleView
                                        sale={editingSale}
                                        onSave={handleSaveSale}
                                        onCancel={() => setEditingSale(null)}
                                    />
                                ) : (
                                    <div className="glass" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Sales Transactions</h3>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                                                    <th style={{ padding: '1rem' }}>Time</th>
                                                    <th style={{ padding: '1rem' }}>Order No</th>
                                                    <th style={{ padding: '1rem' }}>Amount</th>
                                                    <th style={{ padding: '1rem' }}>Items</th>
                                                    <th style={{ padding: '1rem' }}>Payment</th>
                                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {summary.filteredSales.map((sale, index) => (
                                                    <tr key={sale.id || index} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                        <td style={{ padding: '1rem' }}>
                                                            {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                {new Date(sale.timestamp).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                                            {sale.order_no || '-'}
                                                        </td>
                                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{sale.total}</td>
                                                        <td style={{ padding: '1rem' }}>
                                                            {(typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items).length} items
                                                        </td>
                                                        <td style={{ padding: '1rem' }}>{sale.payment_method || 'Cash'}</td>
                                                        <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                            <button
                                                                onClick={() => triggerReprint(sale)}
                                                                className="btn btn-secondary"
                                                                style={{ padding: '0.5rem', borderRadius: '50%' }}
                                                                title="Reprint Receipt"
                                                            >
                                                                <Printer size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingSale(sale)}
                                                                className="btn btn-secondary"
                                                                style={{ padding: '0.5rem', borderRadius: '50%' }}
                                                                title="Edit Invoice"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {summary.filteredSales.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <WastageView
                                summary={summary}
                                onAdd={addWastage}
                                onDelete={deleteWastage}
                                products={products}
                                setStatusModal={setStatusModal}
                            />
                        )}

                        <div style={{ display: 'none' }}>
                            <ReportPrint ref={printRef} summary={summary} />
                            {reprintSale && (
                                <Receipt
                                    ref={reprintRef}
                                    cart={typeof reprintSale.items === 'string' ? JSON.parse(reprintSale.items) : reprintSale.items}
                                    total={Number(reprintSale.total)}
                                    paymentMethod={reprintSale.payment_method}
                                    orderNo={reprintSale.order_no}
                                    timestamp={reprintSale.timestamp}
                                />
                            )}
                        </div>

                        <StatusModal
                            isOpen={statusModal.isOpen}
                            onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
                            message={statusModal.message}
                            title={statusModal.title}
                            type={statusModal.type}
                        />
                    </motion.div>
                </div >
            )}
        </AnimatePresence >
    );
};

export default ReportsModal;
