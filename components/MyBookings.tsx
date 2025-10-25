
import React, { useContext, useMemo } from 'react';
import { AuthContext, BookingContext } from '../App';
import { CalendarIcon, ClockIcon, CourtIcon } from './icons';

const MyBookings: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { bookings, cancelBooking } = useContext(BookingContext);
  
  const myBookings = useMemo(() => {
    if (!user) return [];
    return bookings
      .filter(b => b.userId === user.id && b.status === 'confirmed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.timeSlot.localeCompare(b.timeSlot));
  }, [bookings, user]);

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingBookings = myBookings.filter(b => b.date >= todayStr);
  const pastBookings = myBookings.filter(b => b.date < todayStr);

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      cancelBooking(bookingId);
    }
  };

  const BookingCard: React.FC<{ booking: typeof myBookings[0], isUpcoming: boolean }> = ({ booking, isUpcoming }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h4 className="font-bold text-lg text-gray-800 dark:text-white">Court {booking.courtId}</h4>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mt-2 text-sm">
          <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" /> {new Date(booking.date).toDateString()}</span>
          <span className="flex items-center gap-1.5"><ClockIcon className="h-4 w-4" /> {booking.timeSlot}</span>
        </div>
      </div>
      {isUpcoming && (
        <button
          onClick={() => handleCancel(booking.id)}
          className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition"
        >
          Cancel
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Upcoming Reservations</h3>
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map(b => <BookingCard key={b.id} booking={b} isUpcoming={true} />)}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">You have no upcoming reservations.</p>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Past Reservations</h3>
        {pastBookings.length > 0 ? (
          <div className="space-y-4">
            {pastBookings.map(b => <BookingCard key={b.id} booking={b} isUpcoming={false} />)}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">You have no past reservations.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
