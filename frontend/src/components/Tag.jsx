import React from 'react';
export default function Tag({ children }) {
  return (
    <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold">
      {children}
    </span>
  );
} 