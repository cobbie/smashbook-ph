
import React from 'react';
import CourtGrid from './CourtGrid';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage all court reservations.
        </p>
      </div>
      <CourtGrid />
    </div>
  );
};

export default AdminDashboard;
