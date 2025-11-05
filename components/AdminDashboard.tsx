
import React, { useMemo } from 'react';
import { useAppStore } from '../state/store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';

const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#A4DE6C'];

const StatCard: React.FC<{title: string, value: string | number, color: string}> = ({title, value, color}) => (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <p className="text-sm text-gray-400">{title}</p>
        <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
);


const AdminDashboard: React.FC = () => {
    const { tables, getGlobalOrderHistory } = useAppStore();
    
    const activeTables = useMemo(() => tables.filter(t => t.status === 'Occupato' || t.status === 'Ordinazione Inviata' || t.status === 'Conto richiesto').length, [tables]);
    const totalOrdersToday = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return tables.flatMap(t => t.orderHistory).filter(o => o.createdAt.startsWith(today)).length;
    }, [tables]);
    
    const allOrders = useMemo(() => getGlobalOrderHistory(), [getGlobalOrderHistory]);
    const dailyRevenue = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return tables.flatMap(t => t.orderHistory)
            .filter(o => o.createdAt.startsWith(today))
            .reduce((sum, order) => sum + order.total, 0);
    }, [tables]);

    const topDishesData = useMemo(() => {
        const dishCount: { [key: string]: number } = {};
        allOrders.forEach(item => {
            dishCount[item.dish.name] = (dishCount[item.dish.name] || 0) + item.quantity;
        });
        return Object.entries(dishCount)
            .map(([name, value]) => ({ name, value }))
            .sort((a,b) => b.value - a.value)
            .slice(0, 5);
    }, [allOrders]);
    
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Tavoli Attivi" value={activeTables} color="text-green-400" />
                <StatCard title="Ordini di Oggi" value={totalOrdersToday} color="text-blue-400" />
                <StatCard title="Ricavo Odierno" value={`€${dailyRevenue.toFixed(2)}`} color="text-amber-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-gray-900/50 p-6 border border-gray-800 rounded-lg">
                    <h3 className="text-xl font-bold text-amber-400 mb-4">Performance Vendite</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topDishesData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                            <YAxis stroke="#888888" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}/>
                            <Legend />
                            <Bar dataKey="value" fill="#caa45a" name="Quantità Venduta" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="lg:col-span-2 bg-gray-900/50 p-6 border border-gray-800 rounded-lg">
                    <h3 className="text-xl font-bold text-amber-400 mb-4">Piatti più Popolari</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            {/* FIX: The `percent` prop from the recharts Pie component can be undefined or not a number. Added a `typeof` check to ensure the value is a number before performing arithmetic operations. */}
                            <Pie data={topDishesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name} ${((typeof percent === 'number' ? percent : 0) * 100).toFixed(0)}%`}>
                                {topDishesData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;