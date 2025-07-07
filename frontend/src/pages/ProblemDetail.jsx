import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProblems, getProblem } from '../api';
import Card from '../components/Card';
import Tag from '../components/Tag';
import { FiExternalLink } from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solutionCode, setSolutionCode] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await getProblem(id);
        const currentProblem = res.data;
        if (currentProblem) {
          setProblem(currentProblem);
          // Fetch solution code from GitHub
          const codeRes = await fetch(`https://raw.githubusercontent.com/${process.env.REACT_APP_GITHUB_REPO}/main/solutions/${currentProblem.filename}`);
          if (codeRes.ok) {
            const code = await codeRes.text();
            setSolutionCode(code);
          } else {
            setSolutionCode('Could not load solution code.');
          }
        } else {
          setError('Problem not found.');
        }
      } catch (err) {
        setError('Failed to fetch problem details.');
      }
      setLoading(false);
    };
    fetchProblem();
  }, [id]);

  if (loading) return <div className="text-center p-8 text-lg font-semibold">Loading problem details...</div>;
  if (error) return <div className="text-center p-8 text-lg font-semibold text-red-500">{error}</div>;
  if (!problem) return null;

  const isDarkMode = document.documentElement.classList.contains('dark');
  const codeStyle = isDarkMode ? dracula : oneLight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-12">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <Card className="p-8 border-t-4 border-blue-400 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white leading-tight">{problem.title}</h1>
            <span className={`px-4 py-1 rounded-full text-md font-semibold ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {Array.isArray(problem.tags) && problem.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base mb-6 bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            <div><strong>Status:</strong> <span className={`font-semibold ${problem.status === 'Solved' ? 'text-green-600' : 'text-gray-500'}`}>{problem.status}</span></div>
            <div><strong>Date Solved:</strong> {new Date(problem.date).toLocaleDateString()}</div>
            <div><strong>Language:</strong> {problem.language}</div>
          </div>

          {problem.notes && (
            <div className="mb-6 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-3 text-gray-700 dark:text-gray-300">Notes</h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">{problem.notes}</p>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-700 dark:text-gray-300">Solution Code</h2>
            <div className="rounded-lg overflow-hidden shadow-md">
              <SyntaxHighlighter language={problem.language.toLowerCase()} style={codeStyle} showLineNumbers>
                {solutionCode}
              </SyntaxHighlighter>
            </div>
            <a 
              href={`https://github.com/${process.env.REACT_APP_GITHUB_REPO}/blob/main/solutions/${problem.filename}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out shadow-md font-medium"
            >
              View on GitHub <FiExternalLink />
            </a>
          </div>
        </Card>
        <div className="mt-8 text-center">
          <Link to="/problems" className="text-blue-600 hover:underline text-lg font-medium">← Back to All Problems</Link>
        </div>
      </div>
    </div>
  );
}