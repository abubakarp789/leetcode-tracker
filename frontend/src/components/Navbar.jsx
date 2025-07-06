import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-4 py-3 mb-6 rounded-lg flex gap-6">
      <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      <Link to="/problems" className="hover:underline">Problems</Link>
      <Link to="/add" className="hover:underline">Add</Link>
    </nav>
  );
}
export default Navbar; 