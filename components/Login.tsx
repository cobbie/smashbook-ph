import React, { useContext } from 'react';
import { AuthContext } from '../App';
import type { User } from '../types';
import { UserRole } from '../types';
import { GoogleIcon } from './icons';

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);

  const handleLogin = (role: UserRole) => {
    let user: User;

    switch (role) {
      case UserRole.Guest:
        user = {
          id: 'guest-session',
          name: 'Guest',
          email: '',
          role: UserRole.Guest,
          avatar: `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3e%3c/path%3e%3ccircle cx='12' cy='7' r='4'%3e%3c/circle%3e%3c/svg%3e`,
        };
        break;
      case UserRole.Admin: // Logic remains for potential future use
        user = {
          id: 'admin-001',
          name: 'Admin User',
          email: 'admin@smashbook.ph',
          role: UserRole.Admin,
          avatar: 'https://i.pravatar.cc/150?u=admin',
        };
        break;
      case UserRole.Customer:
      default:
        user = {
          id: `customer-${Date.now()}`,
          name: 'Customer User', // Name is now generic
          email: 'customer.user@email.com',
          role: UserRole.Customer,
          avatar: 'https://i.pravatar.cc/150?u=customer',
        };
        break;
    }
    login(user);
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Welcome to SmashBook!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your premier destination for badminton court reservations in the Philippines.
        </p>
        <div className="space-y-4 pt-4">
          <button
            onClick={() => handleLogin(UserRole.Customer)}
            type="button"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
          >
            <GoogleIcon className="w-5 h-5 mr-3" />
            Sign in with Google
          </button>
           <p className="text-xs text-gray-500 dark:text-gray-400">
            (Login is simulated for this demo)
          </p>
        </div>
         <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or
            </span>
          </div>
        </div>
        <div>
          <button
            onClick={() => handleLogin(UserRole.Guest)}
            className="w-full px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;