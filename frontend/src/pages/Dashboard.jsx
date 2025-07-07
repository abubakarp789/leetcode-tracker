import React, { useState, useEffect } from 'react';
import { getProblems } from '../api';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, eachDayOfInterval, getDay, startOfWeek, addDays, getWeek, getMonth, isLeapYear, getYear } from 'date-fns';

// Helper function to generate calendar data
const getCalendarData = (problems) => {
    const solvedProblems = problems.filter(p => p.status === 'Solved');
    const dateCounts = solvedProblems.reduce((acc, date) => {
        const dateString = format(new Date(date.date), 'yyyy-MM-dd');
        acc[dateString] = (acc[dateString] || 0) + 1;
        return acc;
    }, {});

    const today = new Date();
    const yearStart = subDays(today, isLeapYear(getYear(today)) ? 366 : 365); // Account for leap year
    const days = eachDayOfInterval({ start: yearStart, end: today });

    return days.map(day => {
        const dateString = format(day, 'yyyy-MM-dd');
        return {
            date: dateString,
            count: dateCounts[dateString] || 0,
        };
    });
};

// GitHub-style Calendar Heatmap Component
const CalendarHeatmap = ({ data }) => {
    const today = new Date();
    const yearStart = subDays(today, isLeapYear(getYear(today)) ? 366 : 365);
    const allDays = eachDayOfInterval({ start: yearStart, end: today });
    const weeks = [];
    let currentWeek = [];
    // Pad the beginning to start on a Sunday
    const firstDayInAllDays = allDays[0];
    const dayOfWeekOfFirstDay = getDay(firstDayInAllDays); // 0 for Sunday, 6 for Saturday
    for (let i = 0; i < dayOfWeekOfFirstDay; i++) {
        currentWeek.push(null); // Pad with nulls until Sunday
    }
    allDays.forEach(day => {
        currentWeek.push({
            date: format(day, 'yyyy-MM-dd'),
            count: data.find(d => d.date === format(day, 'yyyy-MM-dd'))?.count || 0,
        });
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    // Add remaining days to the last week and pad with nulls
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }
    // Color scale
    const getColor = (count) => {
        if (count === 0) return 'bg-gray-200 dark:bg-gray-700';
        if (count < 2) return 'bg-green-200 dark:bg-green-800';
        if (count < 4) return 'bg-green-400 dark:bg-green-600';
        return 'bg-green-600 dark:bg-green-400';
    };
    // For legend
    const legend = [
        { label: '0', color: 'bg-gray-200 dark:bg-gray-700' },
        { label: '1', color: 'bg-green-200 dark:bg-green-800' },
        { label: '2-3', color: 'bg-green-400 dark:bg-green-600' },
        { label: '4+', color: 'bg-green-600 dark:bg-green-400' },
    ];
    // Month labels
    const monthLabels = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIndex) => {
        const firstDayInWeek = week.find(day => day !== null);
        if (firstDayInWeek) {
            const month = getMonth(new Date(firstDayInWeek.date));
            if (month !== lastMonth) {
                monthLabels.push({
                    month: format(new Date(firstDayInWeek.date), 'MMM'),
                    weekIndex: weekIndex,
                });
                lastMonth = month;
            }
        }
    });
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
        <div className="overflow-x-auto pb-4">
            <div className="flex flex-col">
                {/* Month Labels */}
                <div className="relative h-6 mb-1">
                    {monthLabels.map((month, index) => {
                        const leftPosition = (month.weekIndex * 18) + 32; // 18px per week column + 32px for ml-8
                        return (
                            <div key={index} className="absolute text-xs text-gray-500 dark:text-gray-400 font-semibold"
                                style={{ left: `${leftPosition}px` }}>
                                {month.month}
                            </div>
                        );
                    })}
                </div>
                <div className="flex">
                    {/* Day Labels */}
                    <div className="flex flex-col mr-1 text-xs text-gray-400 dark:text-gray-500 justify-around">
                        {dayLabels.map((label, i) => (
                            <div key={label} className={`h-4 flex items-center ${i % 2 === 0 ? '' : 'opacity-0'}`}>{label}</div>
                        ))}
                    </div>
                    {/* Heatmap Grid */}
                    <div className="flex flex-row gap-0.5">
                        {weeks.map((week, weekIndex) => (
                            <div key={weekIndex} className="flex flex-col gap-0.5">
                                {week.map((day, dayIndex) => (
                                    <div
                                        key={dayIndex}
                                        className={`w-4 h-4 rounded-sm transition-colors duration-200 border border-transparent hover:border-indigo-400 cursor-pointer ${day ? getColor(day.count) : 'bg-transparent'} ${day && day.count > 0 ? 'hover:scale-110' : ''}`}
                                        title={day ? `${format(new Date(day.date), 'MMM d, yyyy')}: ${day.count} submission${day.count !== 1 ? 's' : ''}` : ''}
                                    >
                                        {/* No number inside cell for cleaner look */}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-2 mt-3 ml-8">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Less</span>
                    {legend.map((l, i) => (
                        <div key={i} className={`w-4 h-4 rounded-sm ${l.color} border border-gray-300 dark:border-gray-600`} title={l.label}></div>
                    ))}
                    <span className="text-xs text-gray-500 dark:text-gray-400">More</span>
                </div>
            </div>
        </div>
    );
};


export default function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await getProblems();
        const sortedProblems = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setProblems(sortedProblems);
      } catch (err) {
        setError('Failed to fetch problems. Please try again later.');
      }
      setLoading(false);
    };
    fetchProblems();
  }, []);

  const solvedCount = problems.filter(p => p.status === 'Solved').length;
  const easyCount = problems.filter(p => p.difficulty === 'Easy' && p.status === 'Solved').length;
  const mediumCount = problems.filter(p => p.difficulty === 'Medium' && p.status === 'Solved').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard' && p.status === 'Solved').length;
  const topics = [...new Set(problems.flatMap(p => p.tags))];
  const recentActivity = problems.slice(0, 5);

  const difficultyData = [
    { name: 'Easy', solved: easyCount },
    { name: 'Medium', solved: mediumCount },
    { name: 'Hard', solved: hardCount },
  ];

  const calendarData = getCalendarData(problems);

  if (loading) return <div className="text-center p-8">Loading dashboard...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-12">
      <div className="max-w-7xl mx-auto py-10 px-4 flex flex-col gap-8">
        <Card className="p-8 border-t-4 border-indigo-400">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                    src="https://avatars.githubusercontent.com/u/101202879?v=4"
                    alt="Abu Bakar avatar"
                    className="w-24 h-24 rounded-full border-4 border-indigo-200 shadow-lg"
                />
                <div className="flex-1">
                    <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-2">LeetCode Progress Tracker</h2>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">
                        Welcome to my personal dashboard for tracking LeetCode problems. This site is a custom solution I built to monitor my progress, analyze my strengths and weaknesses, and keep all my solutions organized in one place.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        It's powered by a simple backend that fetches data from a private GitHub repository where I store my solutions and problem metadata.
                    </p>
                </div>
            </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="flex flex-col items-center justify-center text-center border-t-4 border-green-400">
            <div className="text-5xl font-bold text-green-600 dark:text-green-400">{solvedCount}</div>
            <div className="text-gray-600 dark:text-gray-400 mt-2 font-semibold">Total Solved</div>
          </Card>
          <Card className="flex flex-col items-center justify-center text-center border-t-4 border-yellow-400">
             <div className="flex items-baseline gap-4">
                <div>
                    <div className="text-3xl font-bold text-green-500">{easyCount}</div>
                    <div className="text-sm text-gray-500">Easy</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-yellow-500">{mediumCount}</div>
                    <div className="text-sm text-gray-500">Medium</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-red-500">{hardCount}</div>
                    <div className="text-sm text-gray-500">Hard</div>
                </div>
             </div>
             <div className="text-gray-600 dark:text-gray-400 mt-3 font-semibold">Difficulty Breakdown</div>
          </Card>
          <Card className="flex flex-col items-center justify-center text-center border-t-4 border-blue-400">
            <div className="text-lg font-semibold mb-3">Top Topics</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {topics.slice(0, 7).map(topic => (
                <Tag key={topic}>{topic}</Tag>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Submissions per Difficulty</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={difficultyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(2px)',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                color: '#333'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="solved" name="Solved Problems" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {recentActivity.map(p => (
                        <div key={p.id} className="flex items-center justify-between text-sm">
                            <a href={`/problem/${p.id}`} className="font-semibold text-blue-600 hover:underline">{p.title}</a>
                            <span className="text-gray-500">{format(new Date(p.date), 'MMM dd')}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>

        <Card>
            <h3 className="text-lg font-semibold mb-4">Submission Streak (Last Year)</h3>
            <CalendarHeatmap data={calendarData} />
        </Card>
      </div>
    </div>
  );
}