import React, { useState, forwardRef } from 'react';
import { useSales } from '../../context/SalesContext';
import { BarChart3, TrendingUp, Package, IndianRupee, Printer, Calendar, X, FileSpreadsheet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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
            <p>------------------------------------------</p>
            <p style={{ textAlign: 'center', marginTop: '20px' }}>End of Report</p>
        </div>
    </div>
));

const ReportsModal = ({ isOpen, onClose }) => {
    const { getSalesSummary } = useSales();
    const [period, setPeriod] = useState('daily');
    const [customRange, setCustomRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const printRef = React.useRef();

    const summary = getSalesSummary(period, customRange);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Ahmeds_Center_Report_${period}_${new Date().toISOString().split('T')[0]}`
    });

    const handleExportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Details');

        // Restore default views
        worksheet.views = [{ showGridLines: true }];

        // Define Columns 
        worksheet.columns = [
            { key: 'date', width: 18 },
            { key: 'customer', width: 25 },
            { key: 'phone', width: 18 },
            { key: 'orderNo', width: 12 },
            { key: 'amount', width: 15 },
            { key: 'payment', width: 18 },
            { key: 'service', width: 20 }
        ];

        // Format Header Text: Ahmed's Center Sales Report Generated on [Date] at [Time]
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const titleText = `Ahmed's Center Sales Report Generated on ${dateStr} at ${timeStr}`;

        // Define border styles
        const thinBorder = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };

        // Add the styled top title row
        worksheet.mergeCells('A1:G1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = titleText;
        titleCell.font = { bold: true, size: 14, color: { argb: '000000' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.border = thinBorder;
        worksheet.getRow(1).height = 30;

        // Add an empty row for spacing
        worksheet.addRow([]);

        // Add the table header row
        const tableHeaders = ['Date', 'Customer Name', 'Phone No.', 'Order No.', 'Total Amount', 'Payment Type', 'Service Charge'];
        const headerRow = worksheet.addRow(tableHeaders);
        headerRow.font = { bold: true };
        headerRow.height = 20;

        // Apply borders (keep defaults for alignment)
        headerRow.eachCell((cell) => {
            cell.border = thinBorder;
        });

        // Add Data Rows from filtered sales
        summary.filteredSales.forEach((sale, index) => {
            const saleDate = new Date(sale.timestamp);
            const dataRow = worksheet.addRow({
                date: saleDate.toLocaleDateString('en-GB'),
                customer: 'Cash Sale',
                phone: '',
                orderNo: index + 1,
                amount: Number(sale.total),
                payment: sale.payment_method || 'Cash',
                service: '0.00 (0.0%)'
            });

            // Set number format for amount
            dataRow.getCell('amount').numFmt = '#,##0.00';

            // Apply borders (keep defaults for alignment)
            dataRow.eachCell((cell) => {
                cell.border = thinBorder;
            });
        });

        // Generate and save file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Ahmeds_Center_Sales_Report_${period}_${now.toISOString().split('T')[0]}.xlsx`);
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

                            {period === 'custom' && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--glass-bg)', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}
                                >
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
                                </motion.div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}><IndianRupee size={32} /></div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Revenue</p>
                                <h3 style={{ fontSize: '1.5rem' }}>₹{summary.totalRevenue.toFixed(2)}</h3>
                            </div>
                            <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                <div style={{ color: '#10b981', marginBottom: '0.5rem' }}><Package size={32} /></div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Plates Sold</p>
                                <h3 style={{ fontSize: '1.5rem' }}>{summary.totalPlates}</h3>
                            </div>
                            <div className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                                <div style={{ color: '#3b82f6', marginBottom: '0.5rem' }}><TrendingUp size={32} /></div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Orders</p>
                                <h3 style={{ fontSize: '1.5rem' }}>{summary.saleCount}</h3>
                            </div>
                        </div>

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
                                onClick={handlePrint}
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

                        <div style={{ display: 'none' }}>
                            <ReportPrint ref={printRef} summary={summary} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReportsModal;
