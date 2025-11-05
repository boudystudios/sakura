import React, { useState, useMemo } from 'react';
import { useAppStore } from '../state/store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Order } from '../types';

const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#A4DE6C'];

const HistoryPanel: React.FC = () => {
    // FIX: Changed data source from `getGlobalOrderHistory` (which returns OrderItem[]) to a direct derivation 
    // from `tables` to get the full `Order[]` history, which is what this component expects.
    const tables = useAppStore(state => state.tables);
    const allOrders: Order[] = useMemo(() => 
        tables.flatMap(t => t.orderHistory)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), 
        [tables]
    );
    
    const [filter, setFilter] = useState({ date: '', status: 'all' });
    
    const filteredOrders = useMemo(() => {
        return allOrders.filter(order => {
            const dateMatch = !filter.date || new Date(order.createdAt).toISOString().startsWith(filter.date);
            const statusMatch = filter.status === 'all' || order.status === filter.status;
            return dateMatch && statusMatch;
        });
    }, [allOrders, filter]);

    const dailyRevenueData = useMemo(() => {
        const dailyData: { [key: string]: number } = {};
        filteredOrders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString('it-IT');
            dailyData[date] = (dailyData[date] || 0) + order.total;
        });
        return Object.entries(dailyData).map(([name, revenue]) => ({ name, revenue })).reverse();
    }, [filteredOrders]);
    
    const topDishesData = useMemo(() => {
        const dishCount: { [key: string]: number } = {};
        filteredOrders.flatMap(o => o.items).forEach(item => {
            dishCount[item.dish.name] = (dishCount[item.dish.name] || 0) + item.quantity;
        });
        return Object.entries(dishCount)
            .map(([name, value]) => ({ name, value }))
            .sort((a,b) => b.value - a.value)
            .slice(0, 5);
    }, [filteredOrders]);
    
    const exportToCSV = () => {
        const headers = "OrderID,Date,TableID,Total,Status,Items\n";
        const rows = filteredOrders.map(o => {
            const items = o.items.map(i => `${i.quantity}x ${i.dish.name.replace(',', '')}`).join('; ');
            return `${o._id},${new Date(o.createdAt).toLocaleString()},${o.tableId || 'N/A'},${o.total.toFixed(2)},${o.status},"${items}"`;
        }).join('\n');

        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `sakura_history_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
             {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900/50 p-6 border border-gray-800 rounded-lg">
                    <h3 className="text-xl font-bold text-amber-400 mb-4">Ricavi Giornalieri</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyRevenueData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                            <YAxis stroke="#888888" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}/>
                            <Legend />
                            <Bar dataKey="revenue" fill="#caa45a" name="Ricavo (€)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-gray-900/50 p-6 border border-gray-800 rounded-lg">
                    <h3 className="text-xl font-bold text-amber-400 mb-4">Piatti più Ordinati</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={topDishesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {topDishesData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            {/* Filters and Table */}
            <div className="bg-gray-900/50 p-6 border border-gray-800 rounded-lg">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="text-xl font-bold text-amber-400">Storico Ordini Completo</h3>
                    <div className="flex gap-4">
                        <input type="date" value={filter.date} onChange={e => setFilter(f => ({ ...f, date: e.target.value }))} className="bg-gray-800 border-2 border-gray-700 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500" />
                        <button onClick={exportToCSV} className="px-4 py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-600 transition-colors text-sm">
                            Esporta CSV
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                     <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-700 text-gray-400">
                            <tr>
                                <th className="p-2">Data</th>
                                <th className="p-2">Tavolo</th>
                                <th className="p-2">Totale</th>
                                <th className="p-2">Stato</th>
                                <th className="p-2">Articoli</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-2">{new Date(order.createdAt).toLocaleString('it-IT')}</td>
                                    <td className="p-2">{order.tableId?.replace('t', 'Tavolo ')}</td>
                                    <td className="p-2 font-semibold text-amber-400">€{order.total.toFixed(2)}</td>
                                    <td className="p-2"><span className="text-xs bg-green-800 text-green-300 px-2 py-1 rounded-full">{order.status}</span></td>
                                    <td className="p-2 text-gray-300">{order.items.map(i => `${i.quantity}x ${i.dish.name}`).join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {filteredOrders.length === 0 && <p className="text-center text-gray-500 py-8">Nessun ordine trovato con i filtri correnti.</p>}
            </div>
        </div>
    );
};

export default HistoryPanel;