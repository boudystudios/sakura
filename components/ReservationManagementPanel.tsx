
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../state/store';
import { Reservation, ReservationStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const statusConfig: { [key in ReservationStatus]: { color: string; icon: React.ElementType } } = {
    'In attesa': { color: 'border-yellow-500/50 bg-yellow-900/20', icon: ClockIcon },
    'Confermata': { color: 'border-green-500/50 bg-green-900/20', icon: CheckCircleIcon },
    'Annullata': { color: 'border-red-500/50 bg-red-900/20', icon: XCircleIcon },
};

const ReservationCard: React.FC<{ reservation: Reservation; onUpdateStatus: (id: string, status: ReservationStatus) => void }> = ({ reservation, onUpdateStatus }) => {
    const StatusIcon = statusConfig[reservation.status].icon;
    const cardColor = statusConfig[reservation.status].color;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className={`p-4 border rounded-lg ${cardColor} space-y-3`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-white text-lg">{reservation.name}</h4>
                    <p className="text-sm text-gray-400">{reservation.email}</p>
                    <p className="text-sm text-gray-400">{reservation.phone}</p>
                </div>
                <div className={`flex items-center gap-2 p-1.5 rounded-full text-xs font-semibold ${statusConfig[reservation.status].color.replace('border-', 'bg-').replace('/20', '/40')}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span>{reservation.status}</span>
                </div>
            </div>
            <div className="text-sm border-t border-gray-700/50 pt-3">
                <p><strong className="text-gray-300">Data:</strong> {new Date(reservation.date).toLocaleDateString('it-IT', { timeZone: 'UTC' })} alle {reservation.time}</p>
                <p><strong className="text-gray-300">Ospiti:</strong> {reservation.guests}</p>
                {reservation.notes && <p className="mt-1 text-gray-400 italic">"{reservation.notes}"</p>}
            </div>
            {reservation.status === 'In attesa' && (
                <div className="flex gap-2 pt-2">
                    <button onClick={() => onUpdateStatus(reservation._id, 'Confermata')} className="w-full text-sm bg-green-600/80 hover:bg-green-600 text-white font-semibold py-1.5 rounded-md transition-colors">Conferma</button>
                    <button onClick={() => onUpdateStatus(reservation._id, 'Annullata')} className="w-full text-sm bg-red-600/80 hover:bg-red-600 text-white font-semibold py-1.5 rounded-md transition-colors">Annulla</button>
                </div>
            )}
        </motion.div>
    );
};


const ReservationManagementPanel: React.FC = () => {
    const { reservations, updateReservationStatus } = useAppStore();
    const [filter, setFilter] = useState({ date: '', search: '' });

    const filteredReservations = useMemo(() => {
        return reservations
            .filter(r => {
                const dateMatch = !filter.date || r.date === filter.date;
                const searchMatch = !filter.search || r.name.toLowerCase().includes(filter.search.toLowerCase());
                return dateMatch && searchMatch;
            })
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [reservations, filter]);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Gestione Prenotazioni</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input
                    type="date"
                    value={filter.date}
                    onChange={e => setFilter(f => ({ ...f, date: e.target.value }))}
                    className="bg-gray-800 border-2 border-gray-700 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                    type="text"
                    placeholder="Cerca per nome..."
                    value={filter.search}
                    onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                    className="flex-grow bg-gray-800 border-2 border-gray-700 text-white rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                    {filteredReservations.map(res => (
                        <ReservationCard key={res._id} reservation={res} onUpdateStatus={updateReservationStatus} />
                    ))}
                </AnimatePresence>
            </motion.div>
            {filteredReservations.length === 0 && (
                <p className="text-center text-gray-500 py-10">Nessuna prenotazione trovata con i filtri correnti.</p>
            )}
        </div>
    );
};

export default ReservationManagementPanel;
