
import React, { useState } from 'react';
import CourtGrid from './CourtGrid';
import MyBookings from './MyBookings';

type View = 'book' | 'my_bookings';

const CustomerView: React.FC = () => {
  const [view, setView] = useState<View>('book');

  return (
    <div className="container mx-auto">
      <div className="mb-6 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md inline-flex items-center space-x-1">
        <button
          onClick={() => setView('book')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            view === 'book'
              ? 'bg-green-500 text-white'
              : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          Book a Court
        </button>
        <button
          onClick={() => setView('my_bookings')}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            view === 'my_bookings'
              ? 'bg-green-500 text-white'
              : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          My Reservations
        </button>
      </div>

      {view === 'book' && <CourtGrid />}
      {view === 'my_bookings' && <MyBookings />}
    </div>
  );
};

export default CustomerView;
