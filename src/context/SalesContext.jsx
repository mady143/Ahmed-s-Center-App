import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSales = async () => {
        try {
            // Fetch sales from the last 30 days by default or something manageable
            // For now, let's just fetch all since it's a new system
            const { data, error } = await supabase
                .from('sales')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;
            setSales(data || []);
        } catch (error) {
            console.error('Error fetching sales:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const recordSale = async (items, total) => {
        const saleItems = items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        const newSale = {
            timestamp: new Date().toISOString(),
            items: saleItems,
            total
        };

        try {
            const { data, error } = await supabase
                .from('sales')
                .insert([newSale])
                .select()
                .single();

            if (error) throw error;
            setSales(prev => [data, ...prev]);
        } catch (error) {
            console.error('Error recording sale:', error);
            alert('Failed to record sale');
        }
    };

    const getSalesSummary = (period, customRange = null) => {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date(now.getTime() + 86400000); // Default to tomorrow to include today's sales

        if (period === 'daily') {
            startDate.setHours(0, 0, 0, 0);
        } else if (period === 'weekly') {
            startDate.setDate(now.getDate() - 7);
        } else if (period === 'monthly') {
            startDate.setMonth(now.getMonth() - 1);
        } else if (period === 'custom' && customRange) {
            startDate = new Date(customRange.start);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(customRange.end);
            endDate.setHours(23, 59, 59, 999);
        }

        const filteredSales = sales.filter(sale => {
            const saleDate = new Date(sale.timestamp);
            return saleDate >= startDate && saleDate <= endDate;
        });

        const summary = filteredSales.reduce((acc, sale) => {
            // Ensure sale.total is a number
            acc.totalRevenue += Number(sale.total);

            // Handle items stored as JSONB
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

        return {
            ...summary,
            saleCount: filteredSales.length,
            period,
            startDate,
            endDate: period === 'custom' ? endDate : now
        };
    };

    return (
        <SalesContext.Provider value={{ sales, loading, recordSale, getSalesSummary }}>
            {children}
        </SalesContext.Provider>
    );
};

export const useSales = () => useContext(SalesContext);
