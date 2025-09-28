import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 flex flex-col ${className}`}>
      {(title || actions) && (
        <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {title && <h3 className="text-lg font-semibold text-gray-800 flex-shrink-0">{title}</h3>}
          {actions && <div className="w-full sm:w-auto">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;
