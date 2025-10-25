import React, { useState, useContext, useMemo } from 'react';
import type { Booking, Court } from '../types';
import { AuthContext, BookingContext } from '../App';
import { UserRole } from '../types';
import BookingModal from './BookingModal';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const courts: Court[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `Court ${i + 1}`,
}));

const timeSlots: string[] = Array.from({ length: 15 }, (_, i) => {
  const hour = 8 + i;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const getTodayString = () => new Date().toISOString().split('T')[0];

const CourtGrid: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { bookings, cancelBooking } = useContext(BookingContext);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [bookingSlot, setBookingSlot] = useState<{ court: Court; timeSlot: string } | null>(null);

  const filteredBookings = useMemo(() =>
    bookings.filter(b => b.date === selectedDate && b.status === 'confirmed'),
    [bookings, selectedDate]
  );

  const handleDateChange = (offset: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + offset);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const isSlotBooked = (courtId: number, timeSlot: string): Booking | undefined => {
    return filteredBookings.find(b => b.courtId === courtId && b.timeSlot === timeSlot);
  };
  
  const handleSlotClick = (court: Court, timeSlot: string) => {
    const booking = isSlotBooked(court.id, timeSlot);

    // Admin can cancel any booking or book an empty slot
    if (user?.role === UserRole.Admin) {
      if (booking) {
        if (window.confirm(`Cancel booking for ${booking.userName} on ${court.name} at ${timeSlot}?`)) {
          cancelBooking(booking.id);
        }
      } else {
        setBookingSlot({ court, timeSlot });
      }
      return;
    }

    // Customers and Guests can only book an available slot
    if (!booking) {
      setBookingSlot({ court, timeSlot });
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Court Availability</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => handleDateChange(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            min={getTodayString()}
          />
          <button onClick={() => handleDateChange(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${timeSlots.length}, minmax(80px, 1fr))`}}>
          <div className="sticky left-0 bg-white dark:bg-gray-800 p-2 font-semibold z-10">Court</div>
          {timeSlots.map(slot => (
            <div key={slot} className="p-2 text-center font-semibold text-sm">{slot}</div>
          ))}
          
          {courts.map(court => (
            <React.Fragment key={court.id}>
              <div className="sticky left-0 bg-white dark:bg-gray-800 p-2 font-semibold z-10 flex items-center justify-center">{court.name}</div>
              {timeSlots.map(timeSlot => {
                const booking = isSlotBooked(court.id, timeSlot);
                const isMyBooking = user && booking && booking.userId === user.id;
                
                let slotClass = "border border-gray-200 dark:border-gray-700 rounded-md text-center p-2 text-xs transition-all duration-200 ease-in-out cursor-pointer";
                let content = "Available";
                
                if (booking) {
                  if (isMyBooking) {
                    slotClass += " bg-blue-500 text-white hover:bg-blue-600";
                    content = "My Booking";
                  } else if (user?.role === UserRole.Admin) {
                    slotClass += " bg-yellow-500 text-white hover:bg-yellow-600";
                    content = booking.userName;
                  } else {
                    slotClass += " bg-red-400 dark:bg-red-600 text-white cursor-not-allowed";
                    content = "Booked";
                  }
                } else {
                  slotClass += " bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700";
                }

                return (
                  <div key={`${court.id}-${timeSlot}`} onClick={() => handleSlotClick(court, timeSlot)} className={slotClass}>
                    <span className="font-semibold">{content}</span>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
       {bookingSlot && (
        <BookingModal
          court={bookingSlot.court}
          timeSlot={bookingSlot.timeSlot}
          date={selectedDate}
          onClose={() => setBookingSlot(null)}
        />
      )}
    </div>
  );
};

export default CourtGrid;