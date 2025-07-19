import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/problems', label: 'Problems' },
  { to: '/add', label: 'Add' },
  { to: '/review', label: 'Review' },
];

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur shadow-md dark:shadow-lg px-4 py-3 mb-8 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-extrabold text-2xl">
        <span role="img" aria-label="logo">💡</span>
        <span>My LeetCode Tracker</span>
      </div>
      <div className="hidden md:flex gap-6 items-center">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-3 py-1 rounded transition-all duration-200 font-semibold text-lg ${location.pathname.startsWith(link.to)
                ? 'bg-blue-600 text-white shadow-lg' // More visible active state
                : 'text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200'
            }`}
          >
            {link.label}
          </Link>
        ))}
        <ThemeToggle />
      </div>
      <button className="md:hidden text-gray-700 dark:text-gray-300 text-2xl" onClick={() => setOpen(!open)}>
        <span className="material-icons">{open ? 'close' : 'menu'}</span>
      </button>
      {open && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 flex flex-col gap-4 md:hidden border border-gray-200 dark:border-gray-700">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-lg font-semibold px-3 py-1 rounded ${location.pathname.startsWith(link.to)
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700'
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      )}
    </nav>
  );
}
export default Navbar;