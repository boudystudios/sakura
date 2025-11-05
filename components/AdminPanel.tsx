
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminDashboard from './AdminDashboard';
import TableManagement from './TableManagement';
import UserManagementPanel from './UserManagementPanel';
import HistoryPanel from './HistoryPanel';
import NotificationsPanel from './NotificationsPanel';
import SettingsPanel from './SettingsPanel';
import PaymentsPanel from './PaymentsPanel';
import ReservationManagementPanel from './ReservationManagementPanel';

type AdminTab = 'dashboard' | 'tables' | 'reservations' | 'users' | 'history' | 'payments' | 'notifications' | 'settings';

const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard': return <AdminDashboard />;
            case 'tables': return <TableManagement />;
            case 'reservations': return <ReservationManagementPanel />;
            case 'users': return <UserManagementPanel />;
            case 'history': return <HistoryPanel />;
            case 'payments': return <PaymentsPanel />;
            case 'notifications': return <NotificationsPanel />;
            case 'settings': return <SettingsPanel />;
            default: return null;
        }
    };

    const TabButton: React.FC<{tab: AdminTab, label: string}> = ({tab, label}) => (
         <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
        >
            {label}
        </button>
    );

    return (
        <motion.div 
            className="container mx-auto p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h2 className="font-sawarabi text-4xl font-bold text-white text-shadow-red mb-8">Pannello Amministrazione</h2>
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-4">
                <TabButton tab="dashboard" label="Dashboard" />
                <TabButton tab="tables" label="Gestione Tavoli" />
                <TabButton tab="reservations" label="Prenotazioni" />
                <TabButton tab="history" label="Storico Ordini" />
                <TabButton tab="payments" label="Pagamenti" />
                <TabButton tab="notifications" label="Notifiche" />
                <TabButton tab="users" label="Utenti" />
                <TabButton tab="settings" label="Impostazioni" />
            </div>
            
            <div>
                {renderTabContent()}
            </div>

        </motion.div>
    );
};

export default AdminPanel;
