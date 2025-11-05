import React from 'react';
import { useAppStore } from '../state/store';

const NotificationsPanel: React.FC = () => {
    const { notifications, markAsRead, clearAllNotifications } = useAppStore();

    const getIcon = (type: 'success' | 'error' | 'info') => {
        switch (type) {
            case 'success': return <span className="text-green-400">✓</span>;
            case 'error': return <span className="text-red-400">!</span>;
            case 'info': return <span className="text-blue-400">i</span>;
        }
    }

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-amber-400">Centro Notifiche</h3>
                <button 
                    onClick={clearAllNotifications}
                    className="px-4 py-2 bg-red-800/70 text-red-300 text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
                >
                    Pulisci tutto
                </button>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div 
                            key={n.id} 
                            className={`flex items-start gap-4 p-3 rounded-md border ${n.read ? 'bg-gray-800/30 border-gray-800 opacity-60' : 'bg-gray-800 border-gray-700'}`}
                        >
                            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-gray-700 mt-1">
                                {getIcon(n.type)}
                            </div>
                            <div className="flex-grow">
                                <p className={`font-semibold ${n.read ? 'text-gray-400' : 'text-white'}`}>{n.message}</p>
                                <p className="text-xs text-gray-500">{new Date(n.timestamp).toLocaleString('it-IT')}</p>
                            </div>
                            {!n.read && (
                                <button onClick={() => markAsRead(n.id)} className="text-xs text-amber-500 hover:text-amber-300 font-semibold">
                                    Segna come letto
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">Nessuna notifica.</p>
                )}
            </div>
        </div>
    );
};

export default NotificationsPanel;
