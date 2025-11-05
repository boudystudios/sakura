import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../state/store';
import { OrderItem } from '../types';

interface ReadyItem extends OrderItem {
    tableId: string;
    tableName: string;
}

const LiveOrdersTable: React.FC = () => {
    const { tables, updateDishStatus } = useAppStore();

    const readyItems = useMemo((): ReadyItem[] => {
        return tables
            .filter(table => table.activeOrder)
            .flatMap(table => 
                table.activeOrder!.items
                    .filter(item => item.status === 'pronto')
                    .map(item => ({
                        ...item,
                        tableId: table._id,
                        tableName: table.name,
                    }))
            );
    }, [tables]);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Ordini Pronti da Servire</h3>
            <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-700 text-gray-400">
                        <tr>
                            <th className="p-3">Tavolo</th>
                            <th className="p-3">Piatto</th>
                            <th className="p-3">Q.tà</th>
                            <th className="p-3 text-right">Azione</th>
                        </tr>
                    </thead>
                    <motion.tbody layout>
                       <AnimatePresence>
                        {readyItems.map(item => (
                            <motion.tr 
                                layout
                                key={`${item.tableId}-${item.dish._id}`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 50 }} 
                                className="border-b border-gray-800 hover:bg-gray-800/50"
                            >
                                <td className="p-3 font-bold">{item.tableName}</td>
                                <td className="p-3">{item.dish.name}</td>
                                <td className="p-3 text-center">{item.quantity}</td>
                                <td className="p-3 text-right">
                                    <button 
                                        onClick={() => updateDishStatus(item.tableId, item.dish._id, 'servito')}
                                        className="px-3 py-1.5 bg-blue-700 text-white text-xs font-semibold rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Servito
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                       </AnimatePresence>
                    </motion.tbody>
                </table>
                 {readyItems.length === 0 && <p className="text-center text-gray-500 py-8">Nessun ordine pronto al momento.</p>}
            </div>
        </div>
    );
};

export default LiveOrdersTable;
