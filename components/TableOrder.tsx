
import React from 'react';

const TableOrder: React.FC = () => {
    return (
        <div className="p-8 bg-gray-800 text-white min-h-screen">
            <h1 className="text-3xl font-orbitron text-amber-400 mb-4">Tavolo 12 - Ordine</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <h2 className="text-2xl mb-4">Menu</h2>
                    <div className="bg-gray-900 p-4 rounded-lg">
                        {/* Placeholder for menu items */}
                        <p>Lista categorie e piatti qui...</p>
                    </div>
                </div>
                <div className="col-span-1">
                    <h2 className="text-2xl mb-4">Riepilogo Ordine</h2>
                     <div className="bg-gray-900 p-4 rounded-lg space-y-2">
                        {/* Placeholder for order summary */}
                        <p className="text-gray-400">Nessun articolo.</p>
                        <div className="pt-4 border-t border-gray-700">
                           <p className="text-xl font-bold">Totale: €0.00</p>
                           <button className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">
                               Invia Ordine
                           </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableOrder;
