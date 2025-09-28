import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-4">
      <div className="w-24 h-24 flex items-center justify-center bg-blue-100 rounded-full mb-8">
        <SearchX className="w-12 h-12 text-blue-600" />
      </div>
      <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
