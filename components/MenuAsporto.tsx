import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dish, ReligionTag } from '../types';
import { MENU_CATEGORIES } from '../constants';
import { useAppStore } from '../state/store';
import { toast } from 'react-hot-toast';

const filterDishes = (dishes: Dish[], filters: { category: string; search: string; religion: string }): Dish[] => {
  let results = dishes.filter(d => d.type?.includes('Asporto'));

  if (filters.category && filters.category !== 'Tutti') {
    results = results.filter(dish => dish.category === filters.category);
  }
  
  if (filters.religion && filters.religion !== 'Tutti') {
    results = results.filter(dish => dish.religionTags?.includes(filters.religion as ReligionTag));
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


const DishCard: React.FC<{ dish: Dish; onAddToCart: (dish: Dish) => void; }> = ({ dish, onAddToCart }) => {
    return (
        <motion.div
            className={`bg-black/40 backdrop-blur-sm border border-neutral-800 rounded-lg overflow-hidden flex flex-col group transition-all duration-300 ${!dish.available ? 'opacity-50' : ''}`}
            whileHover={{ 
                y: -8, 
                scale: 1.03,
                boxShadow: '0 0 25px rgba(230, 0, 38, 0.4)',
                borderColor: 'rgba(230, 0, 38, 0.5)'
            }}
        >
            <img src={dish.imageUrl} alt={dish.name} className="w-full h-48 object-cover"/>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#e6b26f] font-sawarabi">{dish.name}</h3>
                <p className="text-xs uppercase text-red-400 tracking-wider">{dish.category}</p>
                <p className="mt-2 text-gray-300 text-sm flex-grow">{dish.description}</p>
                <div className="flex justify-between items-center mt-4">
                     <p className="text-2xl font-semibold text-white">€{dish.price.toFixed(2)}</p>
                     {dish.available && (
                        <motion.button 
                            onClick={() => onAddToCart(dish)}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-md hover:bg-red-500 transition-colors"
                        >
                            Aggiungi
                        </motion.button>
                     )}
                </div>
            </div>
        </motion.div>
    );
};

const CartSidebar: React.FC = () => {
    const { asportoCart, addToAsportoCart, removeFromAsportoCart, clearAsportoCart } = useAppStore();
    const total = useMemo(() => asportoCart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0), [asportoCart]);

    if(asportoCart.length === 0) return null;

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-20 right-0 h-[calc(100vh-80px)] w-full max-w-sm bg-black/70 backdrop-blur-md border-l border-gray-700 shadow-lg z-40 flex flex-col"
        >
           <div className="p-6 border-b border-gray-700">
               <h3 className="text-2xl font-sawarabi font-bold text-amber-400">Il Tuo Carrello</h3>
           </div>
           <div className="flex-grow p-6 overflow-y-auto space-y-4">
                {asportoCart.map(item => (
                    <div key={item.dish._id} className="flex items-center gap-4">
                        <img src={item.dish.imageUrl} alt={item.dish.name} className="w-16 h-16 object-cover rounded-md"/>
                        <div className="flex-grow">
                            <p className="font-semibold text-white">{item.dish.name}</p>
                            <p className="text-sm text-gray-400">€{item.dish.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <button onClick={() => removeFromAsportoCart(item.dish._id)} className="w-6 h-6 bg-gray-700 rounded-full">-</button>
                           <span>{item.quantity}</span>
                           <button onClick={() => addToAsportoCart(item.dish)} className="w-6 h-6 bg-gray-700 rounded-full">+</button>
                        </div>
                    </div>
                ))}
           </div>
           <div className="p-6 border-t border-gray-700 bg-black/50">
                <div className="flex justify-between items-center text-xl font-bold mb-4">
                    <span>Totale:</span>
                    <span className="text-amber-400">€{total.toFixed(2)}</span>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        toast.success("Ordine inviato con successo! Riceverai una notifica di conferma.");
                        clearAsportoCart();
                    }}
                    className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-500 transition-colors duration-300"
                >
                    Checkout
                </motion.button>
           </div>
        </motion.div>
    )
}

interface MenuAsportoProps {
    onLoginClick: (view?: 'login' | 'register') => void;
}

const MenuAsporto: React.FC<MenuAsportoProps> = ({ onLoginClick }) => {
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [displayDishes, setDisplayDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToAsportoCart, asportoCart, user, apiClient, setIsLoginModalOpen, setInitialLoginView } = useAppStore();
  
  const [filters, setFilters] = useState({
    category: 'Tutti',
    search: '',
    religion: 'Tutti',
  });
  
  const allReligionTags: (ReligionTag | 'Tutti')[] = ['Tutti', 'Vegan', 'Halal', 'Kosher'];


  useEffect(() => {
    const loadDishes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiClient.getDishes();
        setAllDishes(result);
      } catch (err) {
        setError('Failed to load menu. Please try again.');
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

  const handleAddToCart = (dish: Dish) => {
      if (!user) {
          toast.error("Devi essere loggato per aggiungere piatti al carrello.");
          setInitialLoginView('login');
          setIsLoginModalOpen(true);
          return;
      }
      addToAsportoCart(dish);
  };


  return (
    <div>
      <div className="max-w-5xl mx-auto mb-12 p-4 bg-black/40 backdrop-blur-sm border border-neutral-700/80 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Filtra per nome..." className="bg-gray-900/50 border-2 border-gray-700/80 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" />
              <select name="category" value={filters.category} onChange={handleFilterChange} className="bg-gray-900/50 border-2 border-gray-700/80 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all">
                  {MENU_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select name="religion" value={filters.religion} onChange={handleFilterChange} className="bg-gray-900/50 border-2 border-gray-700/80 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all">
                  {allReligionTags.map(tag => <option key={tag} value={tag}>{tag === 'Tutti' ? 'Dieta Specifica' : tag}</option>)}
              </select>
          </div>
      </div>

      {isLoading && <p className="text-center">Caricamento...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!isLoading && displayDishes.length > 0 && (
         <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.05 }}}
         >
            {displayDishes.map((dish) => (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} key={dish._id}>
                  <DishCard dish={dish} onAddToCart={handleAddToCart} />
              </motion.div>
            ))}
         </motion.div>
      )}
      
      {!isLoading && displayDishes.length === 0 && !error && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">Nessun piatto trovato.</p>
        </div>
      )}

      <AnimatePresence>
          {asportoCart.length > 0 && <CartSidebar />}
      </AnimatePresence>
    </div>
  );
};

export default MenuAsporto;