import React from 'react';
export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
} 