import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../state/store';
import { Dish, OrderItem } from '../types';
import { MENU_CATEGORIES } from '../constants';

const filterDishes = (dishes: Dish[], filters: { category: string; search: string; }): Dish[] => {
  let results = dishes.filter(d => d.type?.includes('All You Can Eat'));

  if (filters.category && filters.category !== 'Tutti') {
    results = results.filter(dish => dish.category === filters.category);
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    results = results.filter(dish =>
      dish.name.toLowerCase().includes(searchTerm) ||
      dish.description.toLowerCase().includes(searchTerm)
    );
  }
  return results;
};

const DishCard: React.FC<{ dish: Dish; onAddToOrder: (dish: Dish) => void; }> = ({ dish, onAddToOrder }) => {
    return (
        <motion.div
            className={`bg-black/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden flex flex-col group transition-all duration-300 ${!dish.available ? 'opacity-50' : ''}`}
            whileHover={{ 
                y: -5, 
                scale: 1.03,
                boxShadow: '0 0 20px rgba(230, 0, 38, 0.3)',
                borderColor: 'rgba(230, 0, 38, 0.4)'
            }}
        >
            <div className="relative">
                <img src={dish.imageUrl} alt={dish.name} className="w-full h-40 object-cover"/>
                <span className="absolute top-2 right-2 text-xs bg-blue-900/70 backdrop-blur-sm text-blue-300 px-2 py-0.5 rounded-full">AYCE</span>
            </div>
            <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-[#e6b26f] font-sawarabi">{dish.name}</h3>
                <p className="mt-1 text-gray-400 text-xs flex-grow">{dish.description}</p>
                <div className="flex justify-end items-center mt-3">
                     {dish.available && (
                        <motion.button 
                            onClick={() => onAddToOrder(dish)}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-500 transition-colors"
                        >
                            Aggiungi
                        </motion.button>
                     )}
                </div>
            </div>
        </motion.div>
    );
};

const OrderSidebar: React.FC<{ tableId: string; orderItems: OrderItem[] }> = ({ tableId, orderItems }) => {
    const { sendTableOrderToKitchen } = useAppStore();
    const total = useMemo(() => orderItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0), [orderItems]);

    return (
        <div className="bg-black/40 backdrop-blur-md border border-neutral-700/80 rounded-lg p-4 h-full flex flex-col">
           <h3 className="text-xl font-sawarabi font-bold text-amber-400 mb-4">Ordine Tavolo</h3>
           <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                {orderItems.length > 0 ? orderItems.map(item => (
                    <div key={item.dish._id} className="flex justify-between items-center text-sm">
                        <span className="text-white">{item.quantity}x {item.dish.name}</span>
                        <span className="text-gray-400">€{(item.dish.price * item.quantity).toFixed(2)}</span>
                    </div>
                )) : <p className="text-gray-500 text-center mt-4">Aggiungi piatti al tuo ordine.</p>}
           </div>
           {orderItems.length > 0 && (
            <div className="pt-4 mt-4 border-t border-gray-700/50">
                    <div className="flex justify-between items-center text-lg font-bold mb-4">
                        <span>Totale:</span>
                        <span className="text-amber-400">€{total.toFixed(2)}</span>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => sendTableOrderToKitchen(tableId)}
                        className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-md hover:bg-green-500 transition-colors duration-300"
                    >
                        Invia Ordine in Cucina
                    </motion.button>
            </div>
           )}
        </div>
    );
}


interface TableOrderViewProps {
    tableId: string;
    onExit: () => void;
}

const TableOrderView: React.FC<TableOrderViewProps> = ({ tableId, onExit }) => {
    const [allDishes, setAllDishes] = useState<Dish[]>([]);
    const [displayDishes, setDisplayDishes] = useState<Dish[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { tables, addItemToTableOrder, apiClient } = useAppStore();
    const currentTable = tables.find(t => t._id === tableId);

    const [filters, setFilters] = useState({
        category: 'Tutti',
        search: '',
    });

    useEffect(() => {
        const loadDishes = async () => {
          setIsLoading(true);
          try {
            const result = await apiClient.getDishes();
            setAllDishes(result);
          } catch (err) {
            setError('Failed to load menu.');
          } finally {
            setIsLoading(false);
          }
        };
        loadDishes();
    }, [apiClient]);

    useEffect(() => {
        if (allDishes.length > 0) {
            const results = filterDishes(allDishes, filters);
            setDisplayDishes(results);
        }
    }, [filters, allDishes]);

     const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-sawarabi text-3xl font-bold text-white">
                    Menu per <span className="text-amber-400">{currentTable?.name}</span>
                </h3>
                <button onClick={onExit} className="px-4 py-2 bg-gray-700/50 backdrop-blur-sm border border-neutral-600 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors">
                    Cambia Tavolo
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Filtra per nome..." className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/80 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" />
                        <select name="category" value={filters.category} onChange={handleFilterChange} className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-700/80 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500">
                            {MENU_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {isLoading && <p>Caricamento menu...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {!isLoading && (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { staggerChildren: 0.05 }}}
                        >
                            {displayDishes.map((dish) => (
                            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key={dish._id}>
                                <DishCard dish={dish} onAddToOrder={(d) => addItemToTableOrder(tableId, d)} />
                            </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
                <div className="lg:col-span-1 h-[70vh] sticky top-24">
                   <OrderSidebar tableId={tableId} orderItems={currentTable?.activeOrder?.items || []} />
                </div>
            </div>
        </motion.div>
    )
}

export default TableOrderView;