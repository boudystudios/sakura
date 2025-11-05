
import React, { useState } from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';

const images = [
  'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop', // Interior
  'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop', // Uramaki
  'https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=1200&auto=format&fit=crop', // Ramen
  'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200&auto=format&fit=crop', // Sashimi
  'https://images.unsplash.com/photo-1625631976999-53b75a1f3a09?q=80&w=1200&auto=format&fit=crop', // Chef
  'https://images.unsplash.com/photo-1607301405390-7218684d3ce3?q=80&w=1200&auto=format&fit=crop', // Cocktails
];

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(5px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)' },
  out: { opacity: 0, y: -20, filter: 'blur(5px)' },
};
const pageTransition: Transition = { type: 'tween', ease: 'easeInOut', duration: 0.6 };

const GalleryImage: React.FC<{ src: string; alt: string; onClick: () => void; id: string }> = ({ src, alt, onClick, id }) => (
  <motion.div 
    layoutId={id}
    className="overflow-hidden rounded-lg shadow-lg shadow-black/50 aspect-w-3 aspect-h-4 cursor-pointer" 
    onClick={onClick}
    whileHover={{ scale: 1.05, zIndex: 10 }}
  >
    <motion.img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  </motion.div>
);

const GalleryModal: React.FC<{ src: string; id: string; onClose: () => void }> = ({ src, id, onClose }) => (
    <motion.div 
        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <motion.div 
          layoutId={id} 
          className="relative w-full max-w-4xl h-auto max-h-[90vh] overflow-hidden rounded-lg"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
        >
             <img src={src} alt="Fullscreen gallery view" className="w-full h-full object-contain" />
        </motion.div>
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-4xl" aria-label="Close fullscreen view">&times;</button>
    </motion.div>
);


const Gallery: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedImage = images.find((img, index) => `gallery-img-${index}` === selectedId);

  return (
    <motion.div 
        initial="initial" animate="in" exit="out"
        variants={pageVariants} transition={pageTransition}
        className="container mx-auto px-6 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="font-sawarabi text-4xl font-bold text-white text-shadow-red">Galleria</h2>
        <p className="mt-4 text-lg text-gray-400">Uno sguardo alla nostra arte culinaria e all'atmosfera del locale.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => {
          const id = `gallery-img-${index}`;
          return (
            <GalleryImage 
              key={id} 
              id={id}
              src={img} 
              alt={`Galleria Sakura ${index + 1}`}
              onClick={() => setSelectedId(id)}
            />
          );
        })}
      </div>
       <AnimatePresence>
         {selectedId && selectedImage && (
            <GalleryModal id={selectedId} src={selectedImage} onClose={() => setSelectedId(null)} />
         )}
       </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;
