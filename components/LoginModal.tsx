
import React, { useState } from 'react';
// FIX: Import `Variants` type from framer-motion to correctly type the animation variants object.
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useAppStore } from '../state/store';

interface LoginModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialView?: 'login' | 'register';
}

// FIX: Explicitly typed with `Variants` from framer-motion to prevent type inference issues with the transition property.
const formVariants: Variants = {
    initial: (direction: number) => ({
        x: `${direction * 100}%`,
        opacity: 0,
        scale: 0.95
    }),
    animate: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: (direction: number) => ({
        x: `${direction * -100}%`,
        opacity: 0,
        scale: 0.95,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
    })
};

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSuccess, initialView = 'login' }) => {
    const [view, setView] = useState<'login' | 'register'>(initialView);
    const [direction, setDirection] = useState(0);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAppStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        let success = false;
        if(view === 'login') {
            success = await login(email, password);
        } else {
            success = await register(username, email, password);
        }

        setIsLoading(false);

        if (success) {
            onSuccess();
        } else {
            setError(`Credenziali non valide o utente già esistente. Riprova.`);
        }
    };

    const toggleView = () => {
        setError('');
        setDirection(view === 'login' ? 1 : -1);
        setView(prev => prev === 'login' ? 'register' : 'login');
    }

    return (
        <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div 
                className="bg-[#0f0f0f]/90 border border-red-500/30 rounded-lg w-full max-w-sm relative shadow-lg shadow-red-900/50 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
                <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 text-2xl hover:text-white z-20">&times;</button>
                <motion.h2 
                    key={view}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.4 } }}
                    className="text-3xl font-bold text-center text-amber-400 font-sawarabi pt-8"
                >
                    {view === 'login' ? 'Accesso' : 'Registrati'}
                </motion.h2>

                <div className="p-8 relative h-auto">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.form
                            key={view}
                            custom={direction}
                            variants={formVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {view === 'register' && (
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username</label>
                                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label htmlFor="password-login" className="block text-sm font-medium text-gray-400">Password</label>
                                <input type="password" id="password-login" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <motion.button 
                                whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(230, 0, 38, 0.7)' }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-500 transition-colors duration-300 disabled:bg-red-800 disabled:cursor-not-allowed"
                            >
                            {isLoading ? '...' : (view === 'login' ? 'Login' : 'Registrati')}
                            </motion.button>
                        </motion.form>
                    </AnimatePresence>
                </div>
                
                <p className="text-center text-sm text-gray-400 pb-8">
                    {view === 'login' ? "Non hai un account? " : "Hai già un account? "}
                    <button onClick={toggleView} className="font-medium text-amber-400 hover:text-amber-300">
                        {view === 'login' ? "Registrati" : "Accedi"}
                    </button>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default LoginModal;
