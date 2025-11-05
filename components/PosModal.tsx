import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table } from '../types';
import { useAppStore } from '../state/store';
import { toast } from 'react-hot-toast';
import { generateReceiptPdf } from '../utils/receiptGenerator';

interface PosModalProps {
    table: Table;
    onClose: () => void;
}

const PosModal: React.FC<PosModalProps> = ({ table, onClose }) => {
    const { markTableAsPaid, updateTableStatus } = useAppStore();
    const order = table.activeOrder;

    const handleMarkAsPaid = () => {
        if(table.activeOrder) {
            markTableAsPaid(table._id);
            onClose();
        }
    }
    
    const handleRequestBill = () => {
        updateTableStatus(table._id, 'Conto richiesto');
        // FIX: Replaced `toast.info` with `toast.success` as `.info` does not exist on the toast object.
        toast.success(`Bill requested for ${table.name}`);
    }

    const handlePrintReceipt = () => {
        if (order) {
            generateReceiptPdf(order, table.name);
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 text-2xl hover:text-white">&times;</button>
                    <h2 className="text-2xl font-bold text-center text-amber-400 font-sawarabi mb-4">{table.name} - Riepilogo Ordine</h2>
                    
                    {order ? (
                        <>
                            <div className="bg-gray-800 p-4 rounded-md max-h-64 overflow-y-auto space-y-2 mb-4">
                                {order.items.map(item => (
                                    <div key={item.dish._id} className="flex justify-between items-center text-sm">
                                        <div>
                                            <span className="font-semibold text-white">{item.quantity}x {item.dish.name}</span>
                                        </div>
                                        <span className="text-gray-300">€{(item.dish.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-700 pt-4 text-right">
                                <p className="text-2xl font-bold text-white">TOTALE: <span className="text-amber-400">€{order.total.toFixed(2)}</span></p>
                            </div>
                             <div className="grid grid-cols-2 gap-4 mt-6">
                                <button onClick={handlePrintReceipt} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-500 transition-colors">Stampa Ricevuta</button>
                                {table.status !== 'Conto richiesto' && <button onClick={handleRequestBill} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-500 transition-colors">Richiedi Conto</button>}
                                <button onClick={handleMarkAsPaid} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-500 transition-colors col-span-2">Segna come Pagato</button>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500 py-10">Nessun ordine attivo per questo tavolo.</p>
                    )}

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PosModal;