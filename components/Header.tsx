
import React, { useContext } from 'react';
import { AuthContext } from '../App';
import { BadmintonLogoIcon } from './icons';

const Header: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BadmintonLogoIcon className="h-8 w-8 text-green-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              SmashBook PH
            </h1>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                />
                <span className="hidden sm:inline font-medium text-gray-700 dark:text-gray-300">
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
