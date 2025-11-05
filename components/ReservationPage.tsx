import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAppStore } from '../state/store';
import { Reservation } from '../types';

const pageTransition: Transition = { type: 'tween', ease: 'easeInOut', duration: 0.8 };

// Copied from Home.tsx for visual consistency
const Petals: React.FC = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-10">
    {/* Reduced density from 40 (home) to 30 for this section */}
    {Array.from({ length: 30 }).map((_, i) => {
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

const ConfirmationModal: React.FC<{ details: Reservation; onClose: () => void }> = ({ details, onClose }) => (
    <motion.div
        className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
                <div className="petal" style={{
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 5 + 5}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    transform: `scale(${Math.random() * 0.5 + 0.5})`,
                }} key={i} />
            ))}
        </div>
        <motion.div
            className="bg-[#0f0f0f]/90 border border-amber-500/50 rounded-lg w-full max-w-lg p-8 text-center relative shadow-lg shadow-amber-900/40"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
            <h2 className="font-sawarabi text-3xl font-bold text-amber-400">Prenotazione Inviata!</h2>
            <p className="mt-4 text-lg text-gray-300">Grazie, {details.name}. Abbiamo ricevuto la tua richiesta.</p>
            <div className="mt-6 text-left bg-gray-900/50 p-4 rounded-md border border-gray-700 space-y-2">
                <p><strong className="text-gray-400">ID Prenotazione:</strong> <span className="text-white font-mono text-sm">{details._id}</span></p>
                <p><strong className="text-gray-400">Ospiti:</strong> <span className="text-white">{details.guests}</span></p>
                <p><strong className="text-gray-400">Data:</strong> <span className="text-white">{new Date(details.date).toLocaleDateString('it-IT', { timeZone: 'UTC' })} alle {details.time}</span></p>
            </div>
            <p className="mt-4 text-sm text-gray-400">Riceverai una notifica di conferma a breve (simulata).</p>
            <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="mt-8 px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-500 transition-colors"
            >
                Chiudi
            </motion.button>
        </motion.div>
    </motion.div>
);

const FormField: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } }
        }}
    >
        {children}
    </motion.div>
);

const ReservationPage: React.FC = () => {
    const { addReservation } = useAppStore();
    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', guests: 2, date: '', time: '', notes: ''
    });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
    const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
    const [shake, setShake] = useState(0);

    const validate = () => {
        const newErrors: Partial<typeof formData> = {};
        if (!formData.name.trim()) newErrors.name = 'Il nome è richiesto.';
        if (!formData.phone.match(/^[0-9\s+()-]{8,}$/)) newErrors.phone = 'Numero di telefono non valido.';
        if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'Email non valida.';
        if (new Date(formData.date) < new Date(new Date().toDateString())) newErrors.date = 'La data non può essere nel passato.';
        if (!formData.date) newErrors.date = 'La data è richiesta.';
        if (!formData.time) newErrors.time = 'L\'orario è richiesto.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    useEffect(() => {
        validate();
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Per favore, correggi gli errori nel modulo.");
            setStatus('error');
            setShake(s => s + 1);
            setTimeout(() => setStatus('idle'), 500);
            return;
        }
        setStatus('submitting');
        try {
            const result = await addReservation(formData);
            toast.success('Richiesta inviata con successo!');
            setConfirmedReservation(result);
            setFormData({ name: '', phone: '', email: '', guests: 2, date: '', time: '', notes: '' });
        } catch {
             toast.error('Errore durante la prenotazione.');
        } finally {
            setStatus('idle');
        }
    };

    const getInputClass = (fieldName: keyof typeof formData) => {
        const base = "mt-1 block w-full bg-black/40 border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 backdrop-blur-sm transition-all";
        if (errors[fieldName]) return `${base} border-red-500/80 focus:ring-red-500 focus:border-red-500`;
        if (formData[fieldName] && !errors[fieldName]) return `${base} border-green-500/70 focus:ring-green-500 focus:border-green-500`;
        return `${base} border-neutral-700 focus:ring-red-500 focus:border-red-500`;
    };

    return (
        <>
            <motion.div 
                key="reservation-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={pageTransition}
                className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center py-16 px-4 overflow-hidden"
            >
                {/* Background Parallax - Aligned with Home page */}
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 animate-pan"
                    style={{ backgroundImage: "url('https://i.imgur.com/ByCsIzz.jpeg')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                
                <Petals />
                
                {/* Content */}
                <div className="relative z-20 flex flex-col items-center w-full max-w-3xl">
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h1 className="font-sawarabi text-5xl md:text-7xl font-bold text-white text-shadow-red animate-pulse">
                            Prenota il tuo Tavolo
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-gray-300">
                            Assicurati un posto per un’esperienza indimenticabile.
                        </p>
                    </motion.div>
                    
                    <motion.div
                        className="w-full mt-10 relative"
                    >
                         <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,_rgba(230,0,38,0.2)_0%,_rgba(230,0,38,0)_60%)] blur-2xl animate-pulse" />
                        <motion.form 
                            onSubmit={handleSubmit}
                            className="bg-black/50 backdrop-blur-lg border border-red-500/40 p-8 rounded-xl space-y-6 shadow-2xl shadow-red-900/50"
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, staggerChildren: 0.1 } },
                                shake: { x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } }
                            }}
                            initial="hidden"
                            animate={status === 'error' ? ['visible', 'shake'] : 'visible'}
                            key={shake}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField delay={0.1}>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome e Cognome</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={getInputClass('name')} />
                                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                </FormField>
                                <FormField delay={0.2}>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Telefono</label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={getInputClass('phone')} />
                                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                </FormField>
                            </div>
                            <FormField delay={0.3}>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={getInputClass('email')} />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                            </FormField>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField delay={0.4}>
                                    <label htmlFor="guests" className="block text-sm font-medium text-gray-300">N. Ospiti</label>
                                    <input type="number" id="guests" name="guests" value={formData.guests} onChange={handleChange} min="1" max="12" className={getInputClass('guests')} />
                                </FormField>
                                <FormField delay={0.5}>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-300">Data</label>
                                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={getInputClass('date')} min={new Date().toISOString().split('T')[0]} />
                                    {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                                </FormField>
                                <FormField delay={0.6}>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-300">Orario</label>
                                    <select id="time" name="time" value={formData.time} onChange={handleChange} className={getInputClass('time')}>
                                        <option value="">Seleziona</option>
                                        <option value="19:00">19:00</option><option value="19:30">19:30</option><option value="20:00">20:00</option><option value="20:30">20:30</option><option value="21:00">21:00</option><option value="21:30">21:30</option>
                                    </select>
                                    {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
                                </FormField>
                            </div>
                            <FormField delay={0.7}>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Note (opzionale)</label>
                                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Es. allergie, preferenze..." className={getInputClass('notes')}></textarea>
                            </FormField>
                            <FormField delay={0.8}>
                                <motion.button 
                                    whileHover={{ scale: 1.02, y: -2, boxShadow: '0 0 25px rgba(230, 0, 38, 0.8)', color: '#caa45a' }}
                                    whileTap={{ scale: 0.98, y: 0 }}
                                    type="submit" disabled={status === 'submitting'} className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-md hover:bg-red-500 transition-all duration-300 disabled:bg-red-800 relative overflow-hidden disabled:cursor-not-allowed">
                                    {status === 'submitting' ? 'Invio in corso...' : 'Conferma Prenotazione'}
                                    {status === 'submitting' && <span className="absolute left-0 top-0 h-full w-full bg-white/20 animate-pulse" />}
                                </motion.button>
                            </FormField>
                        </motion.form>
                    </motion.div>
                </div>
            </motion.div>
            <AnimatePresence>
                {confirmedReservation && <ConfirmationModal details={confirmedReservation} onClose={() => setConfirmedReservation(null)} />}
            </AnimatePresence>
        </>
    );
};

export default ReservationPage;