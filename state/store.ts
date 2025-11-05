import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { MOCK_TABLES, MOCK_DISHES } from '../constants';
import { Table, User, Dish, Order, OrderItem, CartItem, Notification, TableStatus, OrderItemStatus, MenuMode, Reservation, ReservationStatus } from '../types';
import { toast } from 'react-hot-toast';

// Mock Reservations
const MOCK_RESERVATIONS: Reservation[] = [
    {_id: 'res-1', name: 'Mario Rossi', email: 'mario@email.com', phone: '3331234567', guests: 2, date: new Date().toISOString().split('T')[0], time: '20:30', notes: 'Tavolo vicino alla finestra, se possibile.', status: 'In attesa', createdAt: new Date().toISOString()},
    {_id: 'res-2', name: 'Giulia Bianchi', email: 'giulia@email.com', phone: '3337654321', guests: 4, date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '21:00', notes: '', status: 'Confermata', createdAt: new Date(Date.now() - 86400000).toISOString()},
];


// Mock API client
const apiClient = {
  getDishes: async (): Promise<Dish[]> => {
    console.log('API: Fetching dishes...');
    await new Promise(res => setTimeout(res, 500));
    return MOCK_DISHES;
  },
  login: async (email: string, pass: string): Promise<User | null> => {
      console.log('API: Logging in...');
      await new Promise(res => setTimeout(res, 500));
      if (email === 'admin@sakura.it' && pass === 'admin') return { _id: 'user-admin', username: 'Admin', email, role: 'admin', createdAt: new Date().toISOString()};
      if (email === 'staff@sakura.it' && pass === 'staff') return { _id: 'user-staff', username: 'Staff Member', email, role: 'staff', createdAt: new Date().toISOString()};
      if (email === 'kitchen@sakura.it' && pass === 'kitchen') return { _id: 'user-kitchen', username: 'Kitchen Staff', email, role: 'kitchen', createdAt: new Date().toISOString()};
      if (email === 'user@sakura.it' && pass === 'user') return { _id: 'user-customer', username: 'Test User', email, role: 'customer', createdAt: new Date().toISOString()};
      return null;
  },
  register: async (username: string, email: string, pass: string): Promise<User | null> => {
      console.log('API: Registering...');
      await new Promise(res => setTimeout(res, 500));
      if(email.includes('sakura.it')) return null; // "already exists"
      return { _id: `user-${Date.now()}`, username, email, role: 'customer', createdAt: new Date().toISOString() };
  }
};

interface AppState {
    // Core State
    tables: Table[];
    user: User | null;
    notifications: Notification[];
    reservations: Reservation[];
    
    // UI State
    isLoginModalOpen: boolean;
    initialLoginView: 'login' | 'register';
    menuMode: MenuMode;
    
    // Cart State
    asportoCart: CartItem[];
    
    // API Client
    apiClient: typeof apiClient;
}

interface AppActions {
    // Auth
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    register: (username: string, email: string, pass: string) => Promise<boolean>;
    
    // UI
    setIsLoginModalOpen: (isOpen: boolean) => void;
    setInitialLoginView: (view: 'login' | 'register') => void;
    setMenuMode: (mode: MenuMode) => void;
    
    // Asporto Cart
    addToAsportoCart: (dish: Dish) => void;
    removeFromAsportoCart: (dishId: string) => void;
    clearAsportoCart: () => void;

    // Table / Order Management
    updateTableStatus: (tableId: string, status: TableStatus) => void;
    updateDishStatus: (tableId: string, dishId: string, status: OrderItemStatus) => void;
    addItemToTableOrder: (tableId: string, dish: Dish) => void;
    sendTableOrderToKitchen: (tableId: string) => void;
    markTableAsPaid: (tableId: string) => void;
    
    // Reservation Management
    addReservation: (reservationData: Omit<Reservation, '_id' | 'createdAt' | 'status'>) => Promise<Reservation>;
    updateReservationStatus: (reservationId: string, status: ReservationStatus) => void;
    
    // Notifications
    addNotification: (message: string, type: Notification['type']) => void;
    markAsRead: (id: number) => void;
    clearAllNotifications: () => void;

    // Getters
    getGlobalOrderHistory: () => OrderItem[];
}

export const useAppStore = create<AppState & AppActions>()(
    immer((set, get) => ({
        // --- STATE ---
        tables: MOCK_TABLES,
        user: null,
        reservations: MOCK_RESERVATIONS,
        notifications: [
            {id: 1, message: "Welcome to Sakura Admin Panel!", type: 'info', read: true, timestamp: new Date().toISOString()},
            {id: 2, message: "Table 5 requested the check.", type: 'info', read: false, timestamp: new Date().toISOString()}
        ],
        isLoginModalOpen: false,
        initialLoginView: 'login',
        menuMode: 'asporto',
        asportoCart: [],
        apiClient,

        // --- ACTIONS ---
        
        // Auth
        login: async (email, pass) => {
            const user = await apiClient.login(email, pass);
            if (user) {
                set({ user });
                toast.success(`Welcome back, ${user.username}!`);
                get().addNotification(`User ${user.username} logged in.`, 'success');
                return true;
            }
            return false;
        },
        logout: () => {
             if (get().user) {
                get().addNotification(`User ${get().user?.username} logged out.`, 'info');
             }
             set({ user: null });
             toast.success('You have been logged out.');
        },
        register: async (username, email, pass) => {
            const user = await apiClient.register(username, email, pass);
            if (user) {
                set({ user });
                toast.success(`Welcome, ${user.username}!`);
                get().addNotification(`New user registered: ${user.username}`, 'success');
                return true;
            }
            return false;
        },

        // UI
        setIsLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),
        setInitialLoginView: (view) => set({ initialLoginView: view }),
        setMenuMode: (mode) => set({ menuMode: mode }),

        // Asporto Cart
        addToAsportoCart: (dish) => {
            set((state) => {
                const existingItem = state.asportoCart.find(item => item.dish._id === dish._id);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    state.asportoCart.push({ dish, quantity: 1 });
                }
            });
            toast.success(`${dish.name} added to cart!`);
        },
        removeFromAsportoCart: (dishId) => {
            set((state) => {
                const itemIndex = state.asportoCart.findIndex(item => item.dish._id === dishId);
                if (itemIndex > -1) {
                    if (state.asportoCart[itemIndex].quantity > 1) {
                        state.asportoCart[itemIndex].quantity -= 1;
                    } else {
                        state.asportoCart.splice(itemIndex, 1);
                    }
                }
            });
        },
        clearAsportoCart: () => set({ asportoCart: [] }),
        
        // Table / Order Management
        updateTableStatus: (tableId, status) => {
            set(state => {
                const table = state.tables.find(t => t._id === tableId);
                if (table) {
                    table.status = status;
                }
            });
            get().addNotification(`Table ${tableId} status updated to ${status}.`, 'info');
        },
        updateDishStatus: (tableId, dishId, status) => {
             set(state => {
                const table = state.tables.find(t => t._id === tableId);
                if (table?.activeOrder) {
                    const dish = table.activeOrder.items.find(i => i.dish._id === dishId);
                    if (dish) {
                        dish.status = status;
                         if (status === 'pronto') {
                           get().addNotification(`${dish.dish.name} for table ${table.name} is ready.`, 'success');
                        }
                    }
                }
            });
        },
        addItemToTableOrder: (tableId, dish) => {
             set(state => {
                const table = state.tables.find(t => t._id === tableId);
                if (table) {
                    if (!table.activeOrder) {
                        table.activeOrder = {
                            _id: `order-${Date.now()}`,
                            tableId: tableId,
                            items: [],
                            total: 0,
                            status: 'active',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        table.status = 'Occupato';
                    }
                    const existingItem = table.activeOrder.items.find(i => i.dish._id === dish._id);
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        table.activeOrder.items.push({ dish, quantity: 1, status: 'in preparazione'});
                    }
                    table.activeOrder.total += dish.price;
                    table.activeOrder.updatedAt = new Date().toISOString();
                }
            });
            toast.success(`${dish.name} added to order.`);
        },
        sendTableOrderToKitchen: (tableId) => {
            set(state => {
                 const table = state.tables.find(t => t._id === tableId);
                 if (table && table.activeOrder && table.activeOrder.items.length > 0) {
                     table.status = 'Ordinazione Inviata';
                     get().addNotification(`New order from ${table.name} sent to kitchen.`, 'info');
                     toast.success(`Order sent for ${table.name}!`);
                 } else {
                     toast.error('Cannot send an empty order.');
                 }
            })
        },
        markTableAsPaid: (tableId: string) => {
            set(state => {
                const table = state.tables.find(t => t._id === tableId);
                if (table && table.activeOrder) {
                    const completedOrder: Order = { ...table.activeOrder, status: 'completed', updatedAt: new Date().toISOString() };
                    table.orderHistory.push(completedOrder);
                    table.activeOrder = null;
                    table.status = 'Libero';
                    get().addNotification(`Payment for ${table.name} completed. Total: €${completedOrder.total.toFixed(2)}`, 'success');
                    toast.success(`${table.name} has been marked as paid.`);
                }
            });
        },
        
        // Reservation Management
        addReservation: async (reservationData) => {
            const newReservation: Reservation = {
                ...reservationData,
                _id: `res-${Date.now()}`,
                createdAt: new Date().toISOString(),
                status: 'In attesa',
            };
            set(state => {
                state.reservations.unshift(newReservation);
            });
            get().addNotification(`Nuova prenotazione da ${reservationData.name} per ${reservationData.guests} persone.`, 'info');
            return newReservation;
        },
        updateReservationStatus: (reservationId, status) => {
            set(state => {
                const reservation = state.reservations.find(r => r._id === reservationId);
                if (reservation) {
                    reservation.status = status;
                    const message = `Prenotazione di ${reservation.name} (${reservation._id}) ${status === 'Confermata' ? 'confermata' : 'annullata'}.`;
                    get().addNotification(message, 'success');

                    // Simulate sending an email to the customer
                    const customerMessage = `La tua prenotazione per il ${new Date(reservation.date).toLocaleDateString('it-IT', { timeZone: 'UTC' })} alle ${reservation.time} è stata ${status.toLowerCase()}.`;
                    toast.success(customerMessage, { icon: '📧' });
                }
            });
        },

        // Notifications
        addNotification: (message, type) => {
            set(state => {
                const newNotif: Notification = {
                    id: Date.now(),
                    message,
                    type,
                    read: false,
                    timestamp: new Date().toISOString()
                };
                state.notifications.unshift(newNotif);
            });
        },
        markAsRead: (id) => {
            set(state => {
                const notif = state.notifications.find(n => n.id === id);
                if (notif) notif.read = true;
            })
        },
        clearAllNotifications: () => {
             set(state => {
                state.notifications.forEach(n => n.read = true);
            });
        },

        // Getters
        getGlobalOrderHistory: () => {
            return get().tables.flatMap(t => t.orderHistory).flatMap(o => o.items);
        }
    }))
);