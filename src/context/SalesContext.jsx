import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
    const [sales, setSales] = useState([]);
    const [wastage, setWastage] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSales = async () => {
        try {
            const { data, error } = await supabase
                .from('sales')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;
            setSales(data || []);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const fetchWastage = async () => {
        try {
            const { data, error } = await supabase
                .from('wastage')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;
            setWastage(data || []);
        } catch (error) {
            console.error('Error fetching wastage:', error);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchSales(), fetchWastage()]);
            setLoading(false);
        };
        init();
    }, []);

    const recordSale = async (items, total, paymentMethod = 'Cash', orderNo = null) => {
        const saleItems = items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        const newSale = {
            timestamp: new Date().toISOString(),
            items: saleItems,
            total,
            payment_method: paymentMethod,
            order_no: orderNo
        };

        try {
            const { data, error } = await supabase
                .from('sales')
                .insert([newSale])
                .select()
                .single();

            if (error) throw error;
            setSales(prev => [data, ...prev]);
            return { success: true, data };
        } catch (error) {
            console.error('Error recording sale:', error);
            throw error;
        }
    };

    const addWastage = async (itemName, quantity, costPerUnit, reason = '', timestamp = null) => {
        const newWastage = {
            timestamp: timestamp || new Date().toISOString(),
            item_name: itemName,
            quantity: parseInt(quantity),
            cost_per_unit: parseFloat(costPerUnit),
            reason
        };

        try {
            const { data, error } = await supabase
                .from('wastage')
                .insert([newWastage])
                .select()
                .single();

            if (error) throw error;
            setWastage(prev => [data, ...prev]);
            return { success: true };
        } catch (error) {
            console.error('Error adding wastage:', error);
            return { success: false, error };
        }
    };

    const addBatchWastage = async (items) => {
        const newWastageRecords = items.map(item => ({
            timestamp: item.timestamp || new Date().toISOString(),
            item_name: item.name,
            quantity: parseInt(item.quantity),
            cost_per_unit: parseFloat(item.cost),
            reason: item.reason || ''
        }));

        try {
            const { data, error } = await supabase
                .from('wastage')
                .insert(newWastageRecords)
                .select();

            if (error) throw error;
            setWastage(prev => [...(data || []), ...prev]);
            return { success: true };
        } catch (error) {
            console.error('Error adding batch wastage:', error);
            return { success: false, error };
        }
    };

    const deleteWastage = async (id) => {
        try {
            const { error } = await supabase
                .from('wastage')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setWastage(prev => prev.filter(w => w.id !== id));
            return { success: true };
        } catch (error) {
            console.error('Error deleting wastage:', error);
            return { success: false, error };
        }
    };

    const updateSale = async (saleId, updatedItems, newTotal) => {
        try {
            const { data, error } = await supabase
                .from('sales')
                .update({
                    items: updatedItems,
                    total: newTotal
                })
                .eq('id', saleId)
                .select()
                .single();

            if (error) throw error;

            setSales(prev => prev.map(sale => sale.id === saleId ? data : sale));
            return { success: true };
        } catch (error) {
            console.error('Error updating sale:', error);
            return { success: false, error };
        }
    };

    const getSalesSummary = (period, customRange = null) => {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date(now.getTime() + 86400000); // Default to tomorrow

        if (period === 'daily') {
            if (customRange?.start) {
                const [y, m, d] = customRange.start.split('-').map(Number);
                startDate = new Date(y, m - 1, d);
            }
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate.getTime());
            endDate.setHours(23, 59, 59, 999);
        } else if (period === 'weekly') {
            if (customRange?.start) {
                const [y, m, d] = customRange.start.split('-').map(Number);
                startDate = new Date(y, m - 1, d);
            } else {
                startDate.setDate(now.getDate() - 7);
            }
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate.getTime());
            endDate.setDate(startDate.getDate() + 7);
            endDate.setHours(23, 59, 59, 999);
        } else if (period === 'monthly') {
            if (customRange?.start) {
                const parts = customRange.start.split('-'); // YYYY-MM
                if (parts.length === 2) {
                    startDate = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
                } else {
                    const [y, m, d] = customRange.start.split('-').map(Number);
                    startDate = new Date(y, m - 1, d);
                    startDate.setDate(1);
                }
            } else {
                startDate.setMonth(now.getMonth() - 1);
                startDate.setDate(1);
            }
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            endDate.setHours(23, 59, 59, 999);
        } else if (period === 'custom' && customRange) {
            const [y1, m1, d1] = customRange.start.split('-').map(Number);
            startDate = new Date(y1, m1 - 1, d1);
            startDate.setHours(0, 0, 0, 0);
            const [y2, m2, d2] = customRange.end.split('-').map(Number);
            endDate = new Date(y2, m2 - 1, d2);
            endDate.setHours(23, 59, 59, 999);
        }

        const filteredSales = sales.filter(sale => {
            const saleDate = new Date(sale.timestamp);
            return saleDate >= startDate && saleDate <= endDate;
        });

        const filteredWastage = wastage.filter(w => {
            const wDate = new Date(w.timestamp);
            return wDate >= startDate && wDate <= endDate;
        });

        const summary = filteredSales.reduce((acc, sale) => {
            acc.totalRevenue += Number(sale.total);
            const items = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;

            items.forEach(item => {
                if (!acc.items[item.name]) {
                    acc.items[item.name] = { quantity: 0, revenue: 0, price: item.price };
                }
                acc.items[item.name].quantity += item.quantity;
                acc.items[item.name].revenue += item.price * item.quantity;
                acc.totalPlates += item.quantity;
            });
            return acc;
        }, { totalRevenue: 0, totalPlates: 0, items: {} });

        const totalWasteCost = filteredWastage.reduce((sum, w) => sum + (Number(w.quantity) * Number(w.cost_per_unit)), 0);

        return {
            ...summary,
            totalWasteCost,
            saleCount: filteredSales.length,
            period,
            startDate,
            endDate,
            filteredSales,
            filteredWastage
        };
    };

    return (
        <SalesContext.Provider value={{
            sales,
            wastage,
            loading,
            recordSale,
            updateSale,
            getSalesSummary,
            addWastage,
            addBatchWastage,
            deleteWastage
        }}>
            {children}
        </SalesContext.Provider>
    );
};

export const useSales = () => useContext(SalesContext);
