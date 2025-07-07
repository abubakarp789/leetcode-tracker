import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-950 dark:to-gray-900 text-gray-700 dark:text-gray-300 py-10 mt-12 shadow-inner dark:shadow-none border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div className="col-span-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">My LeetCode Tracker</h3>
          <p className="text-sm leading-relaxed">
            A personal project to track LeetCode progress, organize solutions, and visualize coding journey. Built with React, Node.js, and GitHub API.
          </p>
        </div>

        {/* Quick Links */}
        <div className="col-span-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/dashboard" className="hover:underline text-blue-600 dark:text-blue-400">Dashboard</Link></li>
            <li><Link to="/problems" className="hover:underline text-blue-600 dark:text-blue-400">Problems</Link></li>
            <li><Link to="/add" className="hover:underline text-blue-600 dark:text-blue-400">Add Problem</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="col-span-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="https://github.com/abubakarp789/leetcode-tracker" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">GitHub Repo</a></li>
            <li><a href="https://leetcode.com/u/abubakarp789/" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400">LeetCode Official</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-xs border-t border-gray-200 dark:border-gray-800 pt-6">
        &copy; {new Date().getFullYear()} My LeetCode Tracker. All rights reserved.
      </div>
    </footer>
  );
} 