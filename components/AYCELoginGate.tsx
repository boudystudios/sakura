import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../state/store';
import { toast } from 'react-hot-toast';
import TableOrderView from './TableOrderView';

const AYCELoginGate: React.FC = () => {
    const [tableCode, setTableCode] = useState('');
    const [activeTableId, setActiveTableId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const tables = useAppStore(state => state.tables);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Simulating table code logic, e.g., code "TAVOLO-1" corresponds to table 't1'
        const code = tableCode.toUpperCase().replace(' ', '-');
        const match = code.match(/^TAVOLO-(\d+)$/);

        if (match) {
            const tableId = `t${match[1]}`;
            const tableExists = tables.some(t => t._id === tableId);
            if (tableExists) {
                toast.success(`Accesso al ${tableCode.toUpperCase()} effettuato!`);
                setActiveTableId(tableId);
                return;
            }
        }
        
        setError("Codice tavolo non valido. Riprova. (Es. 'Tavolo 1')");
    };

    if (activeTableId) {
        return <TableOrderView tableId={activeTableId} onExit={() => setActiveTableId(null)} />;
    }

    return (
        <motion.div 
            className="max-w-md mx-auto bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl p-8 text-center shadow-lg shadow-red-900/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <h3 className="font-sawarabi text-2xl font-bold text-amber-400 mb-2">Accesso Tavolo</h3>
            <p className="text-gray-400 mb-6">Inserisci il codice che trovi sul tuo tavolo per iniziare a ordinare.</p>
            <form onSubmit={handleLogin} className="space-y-4">
                 <div>
                    <label htmlFor="tableCode" className="sr-only">Codice Tavolo</label>
                    <input 
                        type="text" 
                        id="tableCode" 
                        value={tableCode}
                        onChange={(e) => setTableCode(e.target.value)}
                        placeholder="Es. Tavolo 5"
                        required 
                        className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-md shadow-sm py-3 px-4 text-white text-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                 {error && <p className="text-red-500 text-sm">{error}</p>}
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    className="w-full bg-amber-600 text-white font-bold py-3 px-4 rounded-md hover:bg-amber-500 transition-colors duration-300"
                >
                    Accedi al Menu
                </motion.button>
            </form>
        </motion.div>
    );
};

export default AYCELoginGate;