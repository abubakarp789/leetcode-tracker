import React from 'react';
import { useEffect, useState } from 'react';
import { getProblems } from '../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { format, parseISO, eachDayOfInterval } from 'date-fns';

const COLORS = ['#22c55e', '#facc15', '#ef4444', '#3b82f6', '#a21caf', '#f97316', '#14b8a6', '#eab308'];

function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProblems().then(res => {
      setProblems(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  // Total solved
  const totalSolved = problems.filter(p => p.status === 'Solved').length;

  // Difficulty breakdown
  const diffCounts = ['Easy', 'Medium', 'Hard'].map(d => ({
    name: d,
    value: problems.filter(p => p.difficulty === d && p.status === 'Solved').length,
  }));

  // Pie chart of topics
  const tagCounts = {};
  problems.forEach(p => {
    if (p.status === 'Solved') {
      p.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  const tagData = Object.entries(tagCounts).map(([name, value]) => ({ name, value }));

  // Calendar heatmap (streaks)
  const dateCounts = {};
  problems.forEach(p => {
    if (p.status === 'Solved') {
      dateCounts[p.date] = (dateCounts[p.date] || 0) + 1;
    }
  });
  // Get all dates in range
  const allDates = problems.length
    ? eachDayOfInterval({
        start: parseISO(problems.reduce((a, b) => (a < b.date ? a : b.date), problems[0].date)),
        end: parseISO(problems.reduce((a, b) => (a > b.date ? a : b.date), problems[0].date)),
      })
    : [];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-4xl font-bold">{totalSolved}</div>
          <div className="text-gray-600">Total Solved</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="font-semibold mb-2">By Difficulty</div>
          <BarChart width={250} height={120} data={diffCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="font-semibold mb-2">Topics Solved</div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={tagData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={45} label>
                {tagData.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow mb-8">
        <div className="font-semibold mb-2">Daily Streak (Calendar Heatmap)</div>
        <div className="flex flex-wrap gap-1">
          {allDates.map(date => {
            const count = dateCounts[format(date, 'yyyy-MM-dd')] || 0;
            const color = count === 0 ? '#e5e7eb' : count === 1 ? '#a7f3d0' : count === 2 ? '#34d399' : '#059669';
            return (
              <div
                key={date}
                title={`${format(date, 'MMM d')}: ${count} solved`}
                style={{ width: 16, height: 16, background: color, borderRadius: 3 }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 