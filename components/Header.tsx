import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';
import { useAppStore } from '../state/store';
import { UserCircleIcon, CogIcon, ArrowRightOnRectangleIcon, BellIcon } from '@heroicons/react/24/outline';

const AnimatedHamburgerIcon: React.FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
    return (
        <motion.button
            onClick={toggle}
            className="relative h-8 w-8 text-gray-400 hover:text-white transition-colors z-[70]"
            animate={isOpen ? 'open' : 'closed'}
            aria-label={isOpen ? "Close menu" : "Open menu"}
        >
            <motion.span
                style={{ left: '50%', top: '35%', x: '-50%', y: '-50%' }}
                className="absolute h-0.5 w-6 bg-current"
                variants={{
                    open: { rotate: 45, y: 5 },
                    closed: { rotate: 0, y: -5 },
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
            <motion.span
                style={{ left: '50%', top: '50%', x: '-50%', y: '-50%' }}
                className="absolute h-0.5 w-6 bg-current"
                variants={{
                    open: { opacity: 0 },
                    closed: { opacity: 1 },
                }}
                 transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
            <motion.span
                style={{ left: '50%', top: '65%', x: '-50%', y: '-50%' }}
                className="absolute h-0.5 w-6 bg-current"
                variants={{
                    open: { rotate: -45, y: -5 },
                    closed: { rotate: 0, y: 5 },
                }}
                 transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
        </motion.button>
    );
};

interface HeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onLoginClick: (view?: 'login' | 'register') => void;
    isAudioPlaying: boolean;
    toggleAudio: () => void;
}

const NavLink: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode }> = 
({ page, currentPage, onNavigate, children }) => {
    const isActive = currentPage === page;
    const navClasses = `relative px-3 py-2 text-sm font-medium transition-all duration-300 ${isActive ? 'text-[#ff0033] drop-shadow-[0_0_6px_#ff0033]' : 'text-gray-400 hover:text-[#ff0033] hover:drop-shadow-[0_0_6px_#ff0033]'}`;

    return (
        <button onClick={() => onNavigate(page)} className={navClasses}>
            {children}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onLoginClick, isAudioPlaying, toggleAudio }) => {
    const { user, logout, notifications } = useAppStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleDashboardNavigation = () => {
        if (!user) return;
        switch (user.role) {
            case 'admin': onNavigate('admin'); break;
            case 'staff': onNavigate('staffDashboard'); break;
            case 'kitchen': onNavigate('kitchenDashboard'); break;
            default: onNavigate('profile'); break;
        }
    };
    
    const handleMobileNavigate = (page: Page) => {
        onNavigate(page);
        setIsMobileMenuOpen(false);
    };

    const navItems: { page: Page; label: string }[] = [
        { page: 'home', label: 'Home' },
        { page: 'menu', label: 'Menu' },
        { page: 'reservations', label: 'Prenota' },
        { page: 'about', label: 'Chi Siamo' },
        { page: 'contact', label: 'Dove Siamo' },
    ];


    return (
        <>
            <header className="sticky top-0 bg-black/60 backdrop-blur-md border-b border-neutral-800 z-50 h-20 flex items-center">
                <nav className="container mx-auto px-6 flex justify-between items-center">
                    <motion.div 
                        className="flex items-center gap-2 cursor-pointer" 
                        onClick={() => onNavigate('home')}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img src="https://i.imgur.com/ZeEnUVN.png" alt="Sakura Logo" className="h-12 w-12" />
                        <span className="font-bold text-xl text-white font-sawarabi hidden md:block">SAKURA</span>
                    </motion.div>

                    <div className="hidden lg:flex items-center gap-2">
                         {navItems.map(item => (
                            <NavLink key={item.page} page={item.page} currentPage={currentPage} onNavigate={onNavigate}>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={toggleAudio} className="text-gray-400 hover:text-white">
                            {isAudioPlaying ? "❚❚" : "►"}
                        </button>
                        {user ? (
                            <div className="relative group hidden lg:block">
                                <button onClick={() => onNavigate('profile')} className="flex items-center gap-2 text-white">
                                    <UserCircleIcon className="h-7 w-7 text-amber-400" />
                                    <span className="hidden md:block">{user.username}</span>
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                    <button onClick={() => onNavigate('profile')} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 cursor-pointer"><UserCircleIcon className="h-5 w-5" /> Profilo</button>
                                    {user.role !== 'customer' && <button onClick={handleDashboardNavigation} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 cursor-pointer"><CogIcon className="h-5 w-5" /> Dashboard</button>}
                                    {user.role === 'admin' && (
                                        <button onClick={() => onNavigate('admin')} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 cursor-pointer relative">
                                            <BellIcon className="h-5 w-5" /> Notifiche
                                            {unreadCount > 0 && <span className="absolute top-1 right-2 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>}
                                        </button>
                                    )}
                                    <button onClick={logout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 cursor-pointer"><ArrowRightOnRectangleIcon className="h-5 w-5" /> Logout</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => onLoginClick('login')} className="hidden lg:block px-4 py-2 bg-red-600/80 border border-red-600 text-white text-sm font-bold rounded-md hover:bg-red-600 transition-colors">
                                Accedi
                            </button>
                        )}
                         <div className="lg:hidden">
                            <AnimatedHamburgerIcon isOpen={isMobileMenuOpen} toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                         </div>
                    </div>
                </nav>
            </header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/60 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            className="fixed top-0 right-0 h-full w-[70vw] max-w-xs bg-black/70 backdrop-blur-md z-[60] flex flex-col p-6"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="font-bold text-xl text-white font-sawarabi">SAKURA</span>
                            </div>
                            
                            <nav className="flex flex-col items-center justify-center flex-grow space-y-6">
                                {navItems.map(item => (
                                    <button 
                                        key={item.page}
                                        onClick={() => handleMobileNavigate(item.page)}
                                        className="text-xl text-gray-300 hover:text-[#ff0033] hover:drop-shadow-[0_0_4px_#ff0033] transition-all duration-300"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                                
                                {user && user.role !== 'customer' && (
                                     <button 
                                        onClick={() => {
                                            handleDashboardNavigation();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="text-xl text-gray-300 hover:text-[#ff0033] hover:drop-shadow-[0_0_4px_#ff0033] transition-all duration-300"
                                    >
                                        Dashboard
                                    </button>
                                )}
                            </nav>

                            <div className="mt-auto flex flex-col items-center">
                                {user ? (
                                    <>
                                        <p className="text-yellow-400 mb-4 capitalize">Ciao, {user.role}</p>
                                        <button 
                                            onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                                            className="w-full text-center px-4 py-3 bg-red-600/80 border border-red-600 text-white text-lg font-bold rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                     <button 
                                        onClick={() => { onLoginClick('login'); setIsMobileMenuOpen(false); }} 
                                        className="w-full text-center px-4 py-3 bg-red-600/80 border border-red-600 text-white text-lg font-bold rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        Accedi
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;