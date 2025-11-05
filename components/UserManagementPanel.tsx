
import React from 'react';
import { useAppStore } from '../state/store';
import { User } from '../types';

// Mock users for demonstration since store doesn't manage a list of users
const MOCK_USERS: User[] = [
  { _id: 'user-admin', username: 'Admin', email: 'admin@sakura.it', role: 'admin', createdAt: new Date().toISOString() },
  { _id: 'user-staff', username: 'Staff Member', email: 'staff@sakura.it', role: 'staff', createdAt: new Date().toISOString() },
  { _id: 'user-kitchen', username: 'Kitchen Staff', email: 'kitchen@sakura.it', role: 'kitchen', createdAt: new Date().toISOString() },
  { _id: 'user-customer', username: 'Test User', email: 'user@sakura.it', role: 'customer', createdAt: new Date().toISOString() },
  { _id: 'user-customer-2', username: 'Jane Doe', email: 'jane.d@example.com', role: 'customer', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];


const UserManagementPanel: React.FC = () => {
    // In a real app, this would come from the store or an API call.
    const users = MOCK_USERS;

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Gestione Utenti</h3>
            <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-700 text-gray-400">
                        <tr>
                            <th className="p-2">Username</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Ruolo</th>
                            <th className="p-2">Membro dal</th>
                            <th className="p-2 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="p-2 font-semibold text-white">{user.username}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2 capitalize">{user.role}</td>
                                <td className="p-2">{new Date(user.createdAt).toLocaleDateString('it-IT')}</td>
                                <td className="p-2 text-right">
                                    <button className="text-blue-400 hover:text-blue-300 mr-2">Modifica</button>
                                    <button className="text-red-400 hover:text-red-300">Elimina</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagementPanel;
