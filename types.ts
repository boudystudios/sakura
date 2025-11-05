
export type Page = 'home' | 'menu' | 'about' | 'contact' | 'reservations' | 'profile' | 'admin' | 'staffDashboard' | 'kitchenDashboard';

export type UserRole = 'customer' | 'staff' | 'kitchen' | 'admin';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type ReligionTag = 'Vegan' | 'Halal' | 'Kosher' | 'None';

export interface Dish {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  ingredients: string[];
  type: ('All You Can Eat' | 'Asporto')[];
  religionTags: ReligionTag[];
  allergens: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type OrderStatus = 'active' | 'completed' | 'cancelled';
export type OrderItemStatus = 'in preparazione' | 'pronto' | 'servito';

export interface OrderItem {
  dish: Dish;
  quantity: number;
  status: OrderItemStatus;
}

export interface Order {
  _id: string;
  tableId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export type TableStatus = 'Libero' | 'Occupato' | 'Ordinazione Inviata' | 'Conto richiesto';

export interface Table {
  _id: string;
  name: string;
  status: TableStatus;
  activeOrder: Order | null;
  orderHistory: Order[];
  position: { x: number; y: number };
}

export type MenuMode = 'asporto' | 'ayce';

export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  read: boolean;
  timestamp: string;
}

export type ReservationStatus = 'In attesa' | 'Confermata' | 'Annullata';

export interface Reservation {
  _id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes: string;
  status: ReservationStatus;
  createdAt: string;
}
