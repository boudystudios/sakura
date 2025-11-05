
import React from 'react';
import { motion } from 'framer-motion';
import TableManagement from './TableManagement';
import LiveOrdersTable from './LiveOrdersTable';

const StaffDashboard: React.FC = () => {
    return (
        <motion.div 
            className="container mx-auto p-6 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
             <h2 className="font-sawarabi text-4xl font-bold text-white text-shadow-red">Dashboard Staff</h2>
            
            <LiveOrdersTable />
            
            <TableManagement />

        </motion.div>
    );
};

export default StaffDashboard;
