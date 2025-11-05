import React from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { useAppStore } from '../state/store';
import MenuAsporto from './MenuAsporto';
import AYCELoginGate from './AYCELoginGate';
import { MenuMode } from '../types';

interface MenuPageProps {
  onLoginClick: (view?: 'login' | 'register') => void;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition: Transition = { type: 'tween', ease: 'easeInOut', duration: 0.5 };

const Petals: React.FC = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-10">
    {Array.from({ length: 25 }).map((_, i) => {
        const petalColors = ['#f6c9d0', '#e6b26f', '#ffffff'];
        const color = petalColors[Math.floor(Math.random() * petalColors.length)];
        const style = {
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 12 + 10}s`,
            animationDelay: `${Math.random() * 20}s`,
            transform: `scale(${Math.random() * 0.5 + 0.3})`,
            filter: `blur(${Math.random() * 2}px)`,
            background: `radial-gradient(circle, ${color}99 0%, ${color}66 100%)`,
            borderRadius: '15px 0px 15px 0px',
        };
        return <div key={i} className="petal" style={style} />;
    })}
  </div>
);


const ModeToggle: React.FC = () => {
  const { menuMode, setMenuMode } = useAppStore();
  
  const handleSetMode = (mode: MenuMode) => {
    setMenuMode(mode);
  };
  
  return (
    <div className="relative w-full max-w-xs mx-auto flex items-center bg-black/40 backdrop-blur-sm border border-neutral-700/80 rounded-full p-1 mb-12 shadow-lg">
      <button 
        onClick={() => handleSetMode('asporto')}
        className={`w-1/2 rounded-full py-2 text-sm font-bold transition-colors z-10 ${menuMode === 'asporto' ? 'text-white' : 'text-gray-400'}`}
      >
        Asporto
      </button>
      <button 
        onClick={() => handleSetMode('ayce')}
        className={`w-1/2 rounded-full py-2 text-sm font-bold transition-colors z-10 ${menuMode === 'ayce' ? 'text-white' : 'text-gray-400'}`}
      >
        All You Can Eat
      </button>
      <motion.div
        layoutId="mode-indicator"
        className="absolute top-1 bottom-1 w-1/2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(230,0,38,0.7)]"
        initial={false}
        animate={{ x: menuMode === 'asporto' ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </div>
  );
};


const MenuPage: React.FC<MenuPageProps> = ({ onLoginClick }) => {
    const { menuMode } = useAppStore();

    return (
       <div className="relative min-h-screen w-full pt-12 pb-20 overflow-hidden">
            {/* Background & Effects */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center animate-pan"
                    style={{ 
                        backgroundImage: "url('https://i.imgur.com/KuM84Xe.jpeg')",
                        filter: 'saturate(0.8)'
                    }}
                >
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/60" />
                </div>
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,0,38,0.15)_0%,_transparent_70%)]" />
            </div>
            <Petals />

            {/* Content Container */}
            <motion.div
                key="menu-page-content"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="relative z-20 container mx-auto px-6"
            >
                <div className="text-center mb-8">
                    <h2 className="font-sawarabi text-5xl md:text-6xl font-bold text-white text-shadow-red animate-[pulse_4s_ease-in-out_infinite]">Il Nostro Menu</h2>
                    <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
                        Scegli la tua esperienza: ordina da casa con Asporto o vivi il nostro All You Can Eat.
                    </p>
                </div>

                <ModeToggle />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={menuMode}
                        initial={{ opacity: 0.5, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0.5, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {menuMode === 'asporto' ? (
                            <MenuAsporto onLoginClick={onLoginClick} />
                        ) : (
                            <AYCELoginGate />
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default MenuPage;