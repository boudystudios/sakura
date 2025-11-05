
import React from 'react';
import { motion, Transition } from 'framer-motion';
import { useAppStore } from '../state/store';

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(5px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)' },
  out: { opacity: 0, y: -20, filter: 'blur(5px)' },
};
const pageTransition: Transition = { type: 'tween', ease: 'easeInOut', duration: 0.6 };


const Profile: React.FC = () => {
    const { user } = useAppStore();

    if (!user) {
        return (
            <motion.div 
                initial="initial" animate="in" exit="out"
                variants={pageVariants} transition={pageTransition}
                className="container mx-auto px-6 py-12 text-center"
            >
                <p className="text-xl text-gray-500">Devi essere loggato per vedere questa pagina.</p>
            </motion.div>
        );
    }
    
    return (
        <motion.div 
            initial="initial" animate="in" exit="out"
            variants={pageVariants} transition={pageTransition}
            className="container mx-auto px-6 py-12"
        >
             <div className="max-w-2xl mx-auto bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                 <h2 className="font-sawarabi text-3xl font-bold text-amber-400 mb-6 text-center">Profilo Utente</h2>
                 <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-400">Username</label>
                        <p className="text-lg text-white p-2 bg-gray-800 rounded-md">{user.username}</p>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-gray-400">Email</label>
                        <p className="text-lg text-white p-2 bg-gray-800 rounded-md">{user.email}</p>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-gray-400">Ruolo</label>
                        <p className="text-lg text-white p-2 bg-gray-800 rounded-md capitalize">{user.role}</p>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-gray-400">Membro dal</label>
                        <p className="text-lg text-white p-2 bg-gray-800 rounded-md">{new Date(user.createdAt).toLocaleDateString('it-IT')}</p>
                    </div>
                 </div>
             </div>
        </motion.div>
    );
};

export default Profile;
