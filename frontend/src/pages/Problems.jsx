import { useEffect, useState } from 'react';
import { getProblems } from '../api';

function Problems() {
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState({ difficulty: '', tag: '', status: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProblems().then(res => {
      setProblems(res.data);
      setLoading(false);
    });
  }, []);

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const statuses = ['Solved', 'Unsolved'];
  const allTags = Array.from(new Set(problems.flatMap(p => p.tags)));

  const filtered = problems.filter(p =>
    (!filter.difficulty || p.difficulty === filter.difficulty) &&
    (!filter.status || p.status === filter.status) &&
    (!filter.tag || p.tags.includes(filter.tag))
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Problems</h2>
      <div className="flex gap-4 mb-4">
        <select value={filter.difficulty} onChange={e => setFilter(f => ({ ...f, difficulty: e.target.value }))} className="input">
          <option value="">All Difficulties</option>
          {difficulties.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))} className="input">
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filter.tag} onChange={e => setFilter(f => ({ ...f, tag: e.target.value }))} className="input">
          <option value="">All Tags</option>
          {allTags.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Difficulty</th>
                <th className="p-2 border">Tags</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Language</th>
                <th className="p-2 border">Solution</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{p.id}</td>
                  <td className="p-2 border text-blue-700 underline cursor-pointer" onClick={() => window.location.href = `/problem/${p.id}`}>{p.title}</td>
                  <td className="p-2 border">{p.difficulty}</td>
                  <td className="p-2 border">{p.tags.join(', ')}</td>
                  <td className="p-2 border">{p.status}</td>
                  <td className="p-2 border">{p.date}</td>
                  <td className="p-2 border">{p.language}</td>
                  <td className="p-2 border"><a href={`https://github.com/${import.meta.env.VITE_GITHUB_REPO || 'yourusername/leetcode-tracker'}/blob/main/solutions/${p.filename}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style>{`.input{border:1px solid #ddd;padding:0.5rem 0.75rem;border-radius:0.375rem;}`}</style>
    </div>
  );
}

export default Problems; 