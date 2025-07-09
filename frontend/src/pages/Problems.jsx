import React, { useState, useEffect } from 'react';
import { getProblems } from '../api';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { Link, useNavigate } from 'react-router-dom';

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ difficulty: '', status: '', tag: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await getProblems();
        setProblems(res.data);
      } catch (err) {
        setError('Failed to fetch problems. Please try again later.');
      }
      setLoading(false);
    };
    fetchProblems();
  }, []);

  const filtered = problems.filter(p =>
    (!filter.difficulty || p.difficulty === filter.difficulty) &&
    (!filter.status || p.status === filter.status) &&
    (!filter.tag || (Array.isArray(p.tags) && p.tags.includes(filter.tag)))
  );

  if (loading) return <div className="text-center p-8 text-lg font-semibold">Loading problems...</div>;
  if (error) return <div className="text-center p-8 text-lg font-semibold text-red-500">{error}</div>;

  // Add delete handler (to be implemented)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    // TODO: Call delete API
    // await deleteProblem(id);
    setProblems(problems => problems.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="mb-8 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Filter Problems</h2>
          <div className="flex flex-wrap items-center gap-4">
            <select value={filter.difficulty} onChange={e => setFilter(f => ({ ...f, difficulty: e.target.value }))} className="form-select">
              <option value="">All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} className="form-select">
              <option value="">All Statuses</option>
              <option>Solved</option>
              <option>Unsolved</option>
            </select>
            <select value={filter.tag} onChange={e => setFilter(f => ({ ...f, tag: e.target.value }))} className="form-select">
              <option value="">All Tags</option>
              {[...new Set(problems.flatMap(p => p.tags))].map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </Card>

        {filtered.length === 0 ? (
          <div className="text-center p-10 text-gray-600 dark:text-gray-400 text-lg">
            No problems found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <Card key={p.id} className="flex flex-col justify-between p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <Link to={`/problem/${p.id}`} className="text-xl font-bold text-blue-700 dark:text-blue-300 hover:underline leading-tight">
                      {p.id}. {p.title}
                    </Link>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : p.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {p.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(p.tags) && p.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="font-medium">Language: {p.language}</span>
                  <span className={`font-bold ${p.status === 'Solved' ? 'text-green-600' : 'text-gray-500'}`}>{p.status}</span>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 font-semibold text-xs"
                    onClick={() => navigate(`/edit/${p.id}`)}
                  >Edit</button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 font-semibold text-xs"
                    onClick={() => handleDelete(p.id)}
                  >Delete</button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .form-select {
          display: block;
          width: auto;
          padding: 0.6rem 1rem;
          border: 1px solid #e2e8f0; /* Tailwind gray-200 */
          border-radius: 0.5rem; /* Tailwind rounded-lg */
          background-color: #ffffff; /* Tailwind bg-white */
          color: #1a202c; /* Tailwind gray-900 */
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          appearance: none; /* Remove default arrow */
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='292.4' height='292.4'%3E%3Cpath fill='%236b7280' d='M287 69.4a17.6 17.6 0 0 0-13-5.4H18.4c-6.5 0-12.3 3.2-16.1 8.1-3.8 4.9-4.9 11-3.1 16.9l128 160c3.9 4.9 9.7 7.9 16.1 7.9s12.2-3 16.1-7.9l128-160c2.2-2.8 3.3-6.4 3.3-9.9z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.7rem top 50%;
          background-size: 0.65rem auto;
        }
        .dark .form-select {
          background-color: #2d3748; /* Tailwind gray-800 */
          border-color: #4a5568; /* Tailwind gray-600 */
          color: #e2e8f0; /* Tailwind gray-200 */
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='292.4' height='292.4'%3E%3Cpath fill='%239ca3af' d='M287 69.4a17.6 17.6 0 0 0-13-5.4H18.4c-6.5 0-12.3 3.2-16.1 8.1-3.8 4.9-4.9 11-3.1 16.9l128 160c3.9 4.9 9.7 7.9 16.1 7.9s12.2-3 16.1-7.9l128-160c2.2-2.8 3.3-6.4 3.3-9.9z'/%3E%3C/svg%3E");
        }
        .form-select:focus {
          border-color: #6366f1; /* Tailwind indigo-500 */
          outline: none;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); /* Tailwind ring-indigo-200 */
        }
        .dark .form-select:focus {
          border-color: #818cf8; /* Tailwind indigo-400 */
          box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.3); /* Tailwind ring-indigo-300 */
        }
      `}</style>
    </div>
  );
} 