
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../state/store';
import { Table, TableStatus } from '../types';
import PosModal from './PosModal';

const statusStyles: { [key in TableStatus]: string } = {
    'Libero': 'border-green-500 bg-green-900/50 text-green-300',
    'Occupato': 'border-yellow-500 bg-yellow-900/50 text-yellow-300',
    'Ordinazione Inviata': 'border-blue-500 bg-blue-900/50 text-blue-300',
    'Conto richiesto': 'border-purple-500 bg-purple-900/50 text-purple-300',
};

const TableCard: React.FC<{ table: Table; onClick: () => void }> = ({ table, onClick }) => {
    return (
        <motion.div
            layout
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`p-4 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center aspect-square ${statusStyles[table.status]}`}
        >
            <h3 className="text-xl font-bold text-white">{table.name}</h3>
            <p className="text-sm font-semibold">{table.status}</p>
            {table.activeOrder && (
                <p className="mt-2 text-lg font-mono text-amber-400">€{table.activeOrder.total.toFixed(2)}</p>
            )}
        </motion.div>
    );
};

const TableManagement: React.FC = () => {
    const tables = useAppStore(state => state.tables);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
             <h3 className="text-xl font-bold text-amber-400 mb-4">Gestione Tavoli</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                 {tables.map(table => (
                     <TableCard key={table._id} table={table} onClick={() => setSelectedTable(table)} />
                 ))}
             </div>
             {selectedTable && (
                 <PosModal
                     table={selectedTable}
                     onClose={() => setSelectedTable(null)}
                 />
             )}
        </div>
    );
};

export default TableManagement;
