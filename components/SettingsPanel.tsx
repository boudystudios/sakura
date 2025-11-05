
import React from 'react';
import { toast } from 'react-hot-toast';

const SettingsPanel: React.FC = () => {

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Impostazioni salvate con successo!");
    }

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-amber-400 mb-6">Impostazioni Ristorante</h3>
            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-400">Nome Ristorante</label>
                    <input type="text" id="restaurantName" defaultValue="Sakura China & Japan Restaurant" className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                </div>
                 <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-400">Indirizzo</label>
                    <input type="text" id="address" defaultValue="Via Roma, 123 - 00100 Roma, Italia" className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                </div>
                 <div>
                    <label htmlFor="openingHours" className="block text-sm font-medium text-gray-400">Orari di Apertura</label>
                    <textarea id="openingHours" rows={3} defaultValue={"Lunedì - Domenica:\n12:00 - 15:00\n19:00 - 23:30"} className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                </div>
                <div className="text-right">
                    <button type="submit" className="px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-500 transition-colors">
                        Salva Modifiche
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsPanel;
