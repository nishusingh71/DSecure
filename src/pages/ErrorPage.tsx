import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="w-24 h-24 flex items-center justify-center bg-red-100 rounded-full mb-8">
        <AlertTriangle className="w-12 h-12 text-red-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg text-gray-600 max-w-md mb-8">
        We're sorry for the inconvenience. An unexpected error occurred. Please try refreshing the page.
      </p>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleReload}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh Page</span>
        </button>
        <a
          href="/"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
