import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = 2025;

  return (
    <footer className="relative bg-[#0a0a0a] border-t border-neutral-800 py-12 px-8 md:px-20 overflow-hidden">
      {/* Effetto Glow superiore */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff0033] to-transparent blur-sm opacity-60 animate-pulse" />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          
          {/* Logo + Testo */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.img
              src="https://i.imgur.com/ZeEnUVN.png"
              alt="Sakura Logo"
              className="h-16 w-16 opacity-90"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ duration: 0.3 }}
              style={{ filter: 'drop-shadow(0 0 8px rgba(230, 0, 38, 0.6))' }}
            />
            <div>
              <p className="font-bold text-lg text-white font-sawarabi">Sakura China & Japan Restaurant</p>
              <p className="text-sm text-gray-400">
                © {currentYear} Sakura Restaurant. All Rights Reserved.
              </p>
              <p className="text-xs text-gray-500 mt-2 tracking-wide">
                Design & Development by{' '}
                <a
                  href="#"
                  className="text-[#ff0033] font-semibold hover:text-amber-400 drop-shadow-[0_0_4px_#ff0033]"
                >
                  BOUDY STUDIOS™
                </a>
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center items-center space-x-8 mt-6 md:mt-0">
            <motion.a
              href="https://www.facebook.com/p/Sakura-China-Japan-Restaurant-100063894554953/?locale=it_IT"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-400"
              whileHover={{
                scale: 1.2,
                color: '#ff0033',
                textShadow: '0 0 8px #ff0033',
              }}
              transition={{ duration: 0.3 }}
            >
              <FaFacebookF className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/sakura_grumello"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400"
              whileHover={{
                scale: 1.2,
                color: '#ff0033',
                textShadow: '0 0 8px #ff0033',
              }}
              transition={{ duration: 0.3 }}
            >
              <FaInstagram className="w-7 h-7" />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Layer effetto di separazione soft */}
      <div className="absolute inset-x-0 bottom-0 h-[80px] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
    </footer>
  );
};

export default Footer;
