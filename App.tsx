
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { User, Booking } from './types';
import { UserRole } from './types';
import Header from './components/Header';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CustomerView from './components/CustomerView';

export const AuthContext = React.createContext<{
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const BookingContext = React.createContext<{
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => boolean;
  cancelBooking: (bookingId: string) => void;
}>({
  bookings: [],
  addBooking: () => false,
  cancelBooking: () => {},
});

const generateInitialBookings = (): Booking[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    return [
        { id: '1', userId: 'admin-001', userName: 'Admin', courtId: 1, date: formatDate(today), timeSlot: '10:00', status: 'confirmed' },
        { id: '2', userId: 'customer-001', userName: 'John Doe', courtId: 3, date: formatDate(today), timeSlot: '14:00', status: 'confirmed' },
        { id: '3', userId: 'customer-002', userName: 'Jane Smith', courtId: 4, date: formatDate(today), timeSlot: '18:00', status: 'confirmed' },
        { id: '4', userId: 'customer-001', userName: 'John Doe', courtId: 2, date: formatDate(tomorrow), timeSlot: '09:00', status: 'confirmed' },
    ];
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
        const storedBookings = localStorage.getItem('bookings');
        return storedBookings ? JSON.parse(storedBookings) : generateInitialBookings();
    } catch (error) {
        console.error("Failed to parse bookings from localStorage", error);
        return generateInitialBookings();
    }
  });
  
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  const login = useCallback((userToLogin: User) => {
    setUser(userToLogin);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addBooking = useCallback((newBookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...newBookingData,
      id: `booking-${Date.now()}-${Math.random()}`,
    };
    setBookings(prev => [...prev, newBooking]);
    return true;
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  }, []);

  const authContextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  const bookingContextValue = useMemo(() => ({ bookings, addBooking, cancelBooking }), [bookings, addBooking, cancelBooking]);

  return (
    <AuthContext.Provider value={authContextValue}>
      <BookingContext.Provider value={bookingContextValue}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            {!user ? (
              <Login />
            ) : user.role === UserRole.Admin ? (
              <AdminDashboard />
            ) : (
              <CustomerView />
            )}
          </main>
        </div>
      </BookingContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
