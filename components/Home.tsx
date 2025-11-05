import React from 'react';
import { Page } from '../types';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const Petals: React.FC = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
    {Array.from({ length: 40 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 8 + 7}s`,
            animationDelay: `${Math.random() * 15}s`,
            transform: `scale(${Math.random() * 0.6 + 0.4})`,
            filter: `blur(${Math.random() * 1.5}px)`,
        };
        return <div key={i} className="petal" style={style} />;
    })}
  </div>
);


const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="relative h-[calc(100vh-80px)] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
      <Petals />
      <div
        className="absolute inset-0 bg-cover bg-center z-0 animate-pan"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1920&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      <div className="relative z-10 p-4 flex flex-col items-center">
        <h1 className="font-sawarabi text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider text-shadow-red animate-[pulse_4s_ease-in-out_infinite]">
          SAKURA
        </h1>
        <h2 className="font-inter text-xl md:text-2xl lg:text-3xl font-light mt-2 uppercase tracking-[0.2em]">
          China & Japan Restaurant
        </h2>
        
        <p className="max-w-2xl mx-auto mt-6 text-gray-300">
          Un viaggio sensoriale tra i sapori autentici della Cina e l'eleganza della cucina giapponese.
        </p>

        <button
          onClick={() => onNavigate('menu')}
          className="mt-10 px-8 py-3 bg-[#e60026]/80 border-2 border-[#e60026] text-white font-bold uppercase tracking-widest rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#e60026] hover:scale-105 hover:shadow-[0_0_20px_rgba(230,0,38,0.8)]"
        >
          Scopri il Menu
        </button>
      </div>
    </div>
  );
};

export default Home;