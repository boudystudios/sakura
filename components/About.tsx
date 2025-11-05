import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, Variants, Transition } from 'framer-motion';

// Componente per le particelle di petali di Sakura
const SakuraParticle: React.FC = () => {
  const x = Math.random() * 100; // Posizione orizzontale iniziale (vw)
  const y = -10 - Math.random() * 20; // Inizia fuori dallo schermo in alto
  const duration = Math.random() * 10 + 15; // Durata lenta
  const delay = Math.random() * 15;
  const scale = Math.random() * 0.5 + 0.3;
  const initialRotation = Math.random() * 360;
  const rotationAmount = (Math.random() - 0.5) * 720; // Rotazione casuale a destra o sinistra

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}vw`,
        top: `${y}vh`,
        scale: scale,
        rotate: initialRotation,
        width: '20px',
        height: '20px',
        background: 'radial-gradient(circle, rgba(255,192,203,0.8) 0%, rgba(202, 164, 90, 0.6) 100%)',
        borderRadius: '15px 0px 15px 0px',
        filter: `blur(${Math.random() * 1.5}px)`,
      }}
      animate={{
        y: '120vh', // Cade fino in fondo
        x: ['0vw', '5vw', '-5vw', '0vw'], // Leggero movimento laterale
        rotate: initialRotation + rotationAmount,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
      }}
    />
  );
};

const SakuraParticlesBackground: React.FC<{ count: number }> = ({ count }) => (
  <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-10">
    {Array.from({ length: count }).map((_, i) => (
      <SakuraParticle key={i} />
    ))}
  </div>
);


// Linea dinamica dorata-rossa sotto le parole chiave
const ShimmerHighlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="relative inline-block">
    {children}
    <motion.span
      className="absolute bottom-[-2px] left-0 w-full h-[2px]"
      style={{
        backgroundImage: 'linear-gradient(to right, #caa45a, #e60026, #caa45a)',
        backgroundSize: '200% 100%',
      }}
      initial={{ backgroundPosition: '200% 0' }}
      whileInView={{ backgroundPosition: '0% 0' }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      viewport={{ once: true }}
    />
  </span>
);

const About: React.FC = () => {
  const [particleCount, setParticleCount] = useState(25);
  const targetRef = useRef<HTMLDivElement | null>(null);

  // Parallax dello scroll per lo sfondo
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-20%', '10%']);

  useEffect(() => {
    const updateParticleCount = () => {
      setParticleCount(window.innerWidth < 768 ? 12 : 25);
    };
    updateParticleCount();
    window.addEventListener('resize', updateParticleCount);
    return () => window.removeEventListener('resize', updateParticleCount);
  }, []);

  const textContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };

  const textItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  const pageTransition: Transition = { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] };

  return (
    <motion.section
      ref={targetRef}
      className="relative min-h-screen flex items-center justify-center py-16 px-4 md:px-8 text-gray-200 overflow-hidden"
      initial="initial"
      animate="in"
      exit="out"
      variants={{
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 },
      }}
      transition={pageTransition}
    >
      {/* Layer Sfondo */}
      <div className="absolute inset-0 z-0">
        <motion.div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
            style={{ 
                backgroundImage: "url('https://i.imgur.com/r5YTyQK.jpeg')",
                y: backgroundY, // Applica parallax
            }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <SakuraParticlesBackground count={particleCount} />

      <div className="container mx-auto px-6 relative z-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">

          {/* Immagine */}
          <motion.div
            className="w-full max-w-md lg:w-5/12"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ ...pageTransition, duration: 1.2 }}
          >
            <motion.div
              className="group relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(230,0,38,0.25)]"
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <img
                src="https://i.imgur.com/Xw7r19Q.jpeg"
                alt="Chef preparing sushi"
                className="w-full h-auto object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500" />
            </motion.div>
          </motion.div>

          {/* Contenuto Testuale */}
          <motion.div
            className="lg:w-6/12 space-y-6 text-left"
            variants={textContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              className="font-sawarabi text-5xl md:text-6xl lg:text-7xl font-bold text-white"
              style={{ textShadow: '0 0 10px rgba(230,0,38,0.8), 0 0 25px rgba(230,0,38,0.6)' }}
              variants={textItem}
            >
              La Nostra Storia
            </motion.h2>
            <motion.p className="text-xl font-semibold text-[#caa45a]" variants={textItem}>
              Passione, Tradizione e Innovazione.
            </motion.p>

            <motion.div className="leading-loose text-[#d1d1d1] space-y-4" variants={textItem}>
              <p>
                Nato dalla passione per l’autentica cucina asiatica, <span className="text-amber-400 font-medium">Sakura Restaurant</span> è un ponte tra le culture orientali e occidentali. 
                Il nostro nome, "<ShimmerHighlight>Sakura</ShimmerHighlight>", simboleggia la bellezza effimera e la perfezione che guidano ogni nostra creazione.
              </p>
              <p>
                Usiamo solo ingredienti <ShimmerHighlight>freschissimi</ShimmerHighlight>, selezionati con cura, per offrirvi un’esperienza culinaria indimenticabile. 
                Ogni piatto è un equilibrio tra <ShimmerHighlight>tradizione</ShimmerHighlight> e <ShimmerHighlight>innovazione</ShimmerHighlight>.
              </p>
            </motion.div>

            <motion.blockquote
              className="mt-6 bg-black/30 backdrop-blur-md border border-amber-400/30 p-6 rounded-lg shadow-lg shadow-black/50"
              variants={textItem}
              whileHover={{ scale: 1.02, borderColor: 'rgba(202, 164, 90, 0.6)'}}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg italic text-gray-200">
                “La nostra missione è trasportarvi nel cuore di Tokyo e Pechino, 
                in un’atmosfera che unisce il minimalismo Zen al vibrante spirito metropolitano.”
              </p>
            </motion.blockquote>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
