
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { Order, OrderItem } from '../types';

interface KitchenOrderItem extends OrderItem {
    orderId: string;
    tableId: string;
    tableName: string;
}

const KitchenDashboard: React.FC = () => {
    const { tables, updateDishStatus } = useAppStore();

    const ordersInPreparation = useMemo(() => {
        const items: KitchenOrderItem[] = [];
        tables.forEach(table => {
            if (table.activeOrder && table.status === 'Ordinazione Inviata') {
                table.activeOrder.items.forEach(item => {
                    if (item.status === 'in preparazione') {
                        items.push({
                            ...item,
                            orderId: table.activeOrder!._id,
                            tableId: table._id,
                            tableName: table.name,
                        });
                    }
                });
            }
        });
        return items;
    }, [tables]);

    // Group items by table for better visualization
    const groupedItems = useMemo(() => {
        return ordersInPreparation.reduce((acc, item) => {
            if (!acc[item.tableId]) {
                acc[item.tableId] = {
                    tableName: item.tableName,
                    items: []
                };
            }
            acc[item.tableId].items.push(item);
            return acc;
        }, {} as { [key: string]: { tableName: string; items: KitchenOrderItem[] } });
    }, [ordersInPreparation]);


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto p-6"
        >
            <div className="flex justify-between items-center mb-6">
                 <h2 className="font-sawarabi text-4xl font-bold text-white text-shadow-red">Dashboard Cucina</h2>
                 <div className="text-right">
                    <p className="text-lg font-semibold text-white">{new Date().toLocaleTimeString('it-IT')}</p>
                    <p className="text-sm text-gray-400">{new Date().toLocaleDateString('it-IT')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {Object.entries(groupedItems).map(([tableId, data]) => (
                        <motion.div
                            layout
                            key={tableId}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-col"
                        >
                            <h3 className="text-xl font-bold text-amber-400 border-b border-gray-700 pb-2 mb-3">{data.tableName}</h3>
                            <div className="space-y-3 flex-grow">
                                {data.items.map(item => (
                                    <div key={item.dish._id} className="bg-gray-800 p-3 rounded-md flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-white">{item.dish.name}</p>
                                            <p className="text-sm text-gray-400">Quantità: {item.quantity}</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => updateDishStatus(tableId, item.dish._id, 'pronto')}
                                            className="px-3 py-1.5 bg-green-700 text-white text-xs font-semibold rounded-md hover:bg-green-600 transition-colors"
                                        >
                                            Pronto
                                        </motion.button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
             {ordersInPreparation.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-2xl text-gray-500">Nessun ordine in preparazione.</p>
                </div>
            )}
        </motion.div>
    );
};

export default KitchenDashboard;
