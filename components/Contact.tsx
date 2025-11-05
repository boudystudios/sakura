import React from 'react';
// FIX: Import `Variants` type from framer-motion to correctly type the animation variants object.
import { motion, Transition, Variants } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';

const pageVariants: Variants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};
const pageTransition: Transition = { type: 'tween', ease: 'anticipate', duration: 0.8 };

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

// Sakura Petals Component (consistent with Home)
const Petals: React.FC = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-10">
    {Array.from({ length: 50 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 10 + 8}s`,
            animationDelay: `${Math.random() * 18}s`,
            transform: `scale(${Math.random() * 0.7 + 0.3})`,
            filter: `blur(${Math.random() * 1.8}px)`,
        };
        return <div key={i} className="petal" style={style} />;
    })}
  </div>
);


const Contact: React.FC = () => {

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    const promise = new Promise((resolve) => setTimeout(resolve, 1500));
    toast.promise(promise, {
        loading: 'Invio in corso...',
        success: 'Messaggio inviato! Riceverai una conferma a breve.',
        error: 'Errore durante l\'invio.',
    });
    (e.target as HTMLFormElement).reset();
  }

  return (
    <motion.div 
        initial="initial" animate="in" exit="out"
        variants={pageVariants} transition={pageTransition}
        className="relative py-20 lg:py-28 overflow-hidden"
    >
      {/* Animated Background & Petals (Home Style) */}
      <div className="absolute inset-0 z-0">
          <div
              className="absolute inset-0 bg-cover bg-center animate-pan"
              style={{ backgroundImage: "url('https://i.imgur.com/f6fmsMU.jpeg')" }}
          >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
          </div>
           {/* Red/Amber glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(230,0,38,0.25)_0%,_transparent_70%)] opacity-80" />
      </div>
      <Petals />
      
      {/* Top glow line */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#e60026] to-transparent animate-pulse" />


      <div className="container mx-auto px-6 relative z-20">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          <h2 className="font-sawarabi text-5xl md:text-6xl font-bold text-white text-shadow-red animate-[pulse_3s_ease-in-out_infinite]">
            Dove Siamo
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Scopri dove nasce l’arte della cucina orientale in un ambiente elegante e accogliente.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Info + Form */}
          <motion.div 
            className="space-y-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Info Section */}
            <div className="space-y-6">
                <motion.div variants={itemVariants} className="flex items-start gap-4">
                    <FaMapMarkerAlt className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-amber-400 text-lg">Indirizzo</h3>
                        <p className="text-gray-300">Piazza Carminati, 5<br/>24064 Grumello del Monte (BG), Italia</p>
                    </div>
                </motion.div>
                 <motion.div variants={itemVariants} className="flex items-start gap-4">
                    <FaPhoneAlt className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-amber-400 text-lg">Telefono</h3>
                        <p className="text-gray-300">035 442 0460</p>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-start gap-4">
                    <FaEnvelope className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-amber-400 text-lg">Email</h3>
                        <p className="text-gray-300">info@sakurarestaurant.it</p>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="flex items-start gap-4">
                    <FaClock className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-amber-400 text-lg">Orari</h3>
                        <p className="text-gray-300">Mar–Dom: 12:00–14:30 / 19:00–22:30</p>
                        <p className="text-gray-400">Lunedì: Chiuso</p>
                    </div>
                </motion.div>
            </div>

            {/* Form Section */}
             <motion.div 
                variants={itemVariants}
                className="bg-black/40 backdrop-blur-md border border-neutral-800/70 p-8 rounded-xl shadow-lg shadow-black/40"
             >
                <h3 className="text-2xl font-bold text-white mb-6">Manda un Messaggio</h3>
                <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="sr-only">Nome</label>
                    <input type="text" id="name" name="name" required placeholder="Nome" className="mt-1 block w-full bg-gray-900/60 border-neutral-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300" />
                </div>
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input type="email" id="email" name="email" required placeholder="Email" className="mt-1 block w-full bg-gray-900/60 border-neutral-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300" />
                </div>
                <div>
                    <label htmlFor="message" className="sr-only">Messaggio</label>
                    <textarea id="message" name="message" rows={4} required placeholder="Messaggio" className="mt-1 block w-full bg-gray-900/60 border-neutral-700 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300"></textarea>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(230, 0, 38, 0.7)' }}
                    whileTap={{ scale: 0.98, boxShadow: '0 0 10px rgba(230, 0, 38, 0.5)' }}
                    type="submit" 
                    className="w-full bg-[#e60026] text-white font-bold py-3 px-4 rounded-md hover:bg-red-500 transition-colors duration-300"
                >
                    Invia Messaggio
                </motion.button>
                </form>
            </motion.div>
          </motion.div>

          {/* Right Column: Map */}
          <motion.div
            className="h-[400px] lg:h-full w-full min-h-[400px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <div className="rounded-xl overflow-hidden w-full h-full border-2 border-neutral-800/70 shadow-2xl shadow-red-900/40">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2793.181977717467!2d9.86312417688229!3d45.56810242540511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478158d69306c597%3A0x631481c47a544498!2sSakura%20China%20Japan%20Restaurant!5e0!3m2!1sit!2sit!4v1717348986221!5m2!1sit!2sit"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(95%) grayscale(80%) hue-rotate(210deg)' }}
                    allowFullScreen={false}
                    loading="lazy"
                    title="Mappa Ristorante Sakura Grumello del Monte"
                ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;