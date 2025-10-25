import React, { useState, useContext } from 'react';
import type { Court, PaymentMethod, Booking } from '../types';
import { AuthContext, BookingContext } from '../App';
import { GCashIcon, MayaIcon, PayMongoIcon, CheckCircleIcon, XCircleIcon, CalendarIcon, ClockIcon, CourtIcon } from './icons';

interface BookingModalProps {
  court: Court;
  timeSlot: string;
  date: string;
  onClose: () => void;
}

const RENTAL_FEE_PHP = 350;

type ModalStep = 'details' | 'payment' | 'confirmation';

const BookingModal: React.FC<BookingModalProps> = ({ court, timeSlot, date, onClose }) => {
  const { user } = useContext(AuthContext);
  const { addBooking } = useContext(BookingContext);

  const [step, setStep] = useState<ModalStep>('details');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleConfirmAndPay = () => {
    if (user?.role === 'Guest') {
        if (!guestEmail || !/^\S+@\S+\.\S+$/.test(guestEmail)) {
            setEmailError('Please enter a valid email address.');
            return;
        }
        setEmailError('');
    }
    setStep('payment');
  };
  
  const handleSelectPayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
  }

  const handleFinalizePayment = () => {
    if (!paymentMethod || !user) return;
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
       const bookingData: Omit<Booking, 'id'> = {
        userId: user.id,
        userName: user.name,
        courtId: court.id,
        date,
        timeSlot,
        status: 'confirmed',
      };

      if (user.role === 'Guest') {
        bookingData.guestEmail = guestEmail;
        // Make guest identifiable in admin view
        bookingData.userName = `Guest (${guestEmail})`;
      }

      const success = addBooking(bookingData);
      
      setBookingSuccess(success);
      setIsProcessing(false);
      setStep('confirmation');
    }, 2000);
  };

  const renderDetails = () => (
    <>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Confirm Your Booking</h3>
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <CourtIcon className="h-6 w-6 text-green-500" />
            <div>
                <p className="font-semibold">{court.name}</p>
                <p className="text-sm">Badminton Court</p>
            </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <CalendarIcon className="h-6 w-6 text-blue-500" />
            <div>
                <p className="font-semibold">{new Date(date).toDateString()}</p>
                <p className="text-sm">Date</p>
            </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <ClockIcon className="h-6 w-6 text-purple-500" />
            <div>
                <p className="font-semibold">{timeSlot}</p>
                <p className="text-sm">Time Slot (1 hour)</p>
            </div>
        </div>
      </div>

       {user?.role === 'Guest' && (
        <div className="mt-6">
            <label htmlFor="guest-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email for Receipt
            </label>
            <div className="mt-1">
                <input
                    type="email"
                    name="email"
                    id="guest-email"
                    className={`block w-full rounded-md shadow-sm sm:text-sm bg-white dark:bg-gray-700 ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'}`}
                    placeholder="you@example.com"
                    value={guestEmail}
                    onChange={(e) => {
                        setGuestEmail(e.target.value);
                        if(emailError) setEmailError('');
                    }}
                    required
                />
            </div>
            {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <span className="text-lg font-bold text-gray-800 dark:text-white">Total:</span>
        <span className="text-xl font-bold text-green-500">₱{RENTAL_FEE_PHP.toFixed(2)}</span>
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Cancel</button>
        <button onClick={handleConfirmAndPay} className="px-6 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 font-semibold">Confirm & Pay</button>
      </div>
    </>
  );
  
  const renderPayment = () => (
     <>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Choose Payment Method</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Total Amount: <span className="font-bold text-green-500">₱{RENTAL_FEE_PHP.toFixed(2)}</span></p>
      <div className="space-y-3">
        {(['GCash', 'Maya', 'PayMongo'] as PaymentMethod[]).map(method => (
           <button key={method} onClick={() => handleSelectPayment(method)} className={`w-full flex items-center p-4 border-2 rounded-lg transition-all ${paymentMethod === method ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
             {method === 'GCash' && <GCashIcon className="h-8 w-auto mr-4" />}
             {method === 'Maya' && <MayaIcon className="h-8 w-auto mr-4" />}
             {method === 'PayMongo' && <PayMongoIcon className="h-8 w-auto mr-4" />}
             <span className="font-semibold">{method}</span>
           </button>
        ))}
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button onClick={() => setStep('details')} className="px-6 py-2 rounded-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold">Back</button>
        <button onClick={handleFinalizePayment} disabled={!paymentMethod || isProcessing} className="px-6 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
            {isProcessing ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </>
            ) : `Pay with ${paymentMethod || ''}`}
        </button>
      </div>
     </>
  );

  const renderConfirmation = () => (
     <div className="text-center">
        {bookingSuccess ? (
            <>
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Confirmed!</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Your reservation for {court.name} on {new Date(date).toDateString()} at {timeSlot} is successful.</p>
                {user?.role === 'Guest' && (
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        A confirmation receipt will be sent to <strong>{guestEmail}</strong>.
                    </p>
                )}
            </>
        ) : (
            <>
                <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Failed</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Unfortunately, the slot was booked by someone else. Please try another slot.</p>
            </>
        )}
        <div className="mt-8">
            <button onClick={onClose} className="w-full px-6 py-3 rounded-md text-white bg-green-500 hover:bg-green-600 font-semibold">Done</button>
        </div>
     </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md transform transition-all">
          {step === 'details' && renderDetails()}
          {step === 'payment' && renderPayment()}
          {step === 'confirmation' && renderConfirmation()}
      </div>
    </div>
  );
};

export default BookingModal;