import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProblems } from '../api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProblems().then(res => {
      const found = res.data.find(p => p.id === id);
      setProblem(found);
      if (found) fetchCode(found);
      setLoading(false);
    });
    // eslint-disable-next-line
  }, [id]);

  const fetchCode = async (p) => {
    // Raw GitHub URL for code file
    const repo = import.meta.env.VITE_GITHUB_REPO || 'yourusername/leetcode-tracker';
    const url = `https://raw.githubusercontent.com/${repo}/main/solutions/${p.filename}`;
    try {
      const resp = await fetch(url);
      setCode(await resp.text());
    } catch {
      setCode('// Could not load code');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!problem) return <div>Problem not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
      <div className="mb-2 text-gray-600">{problem.difficulty} | {problem.tags.join(', ')} | {problem.status} | {problem.date}</div>
      {problem.notes && <div className="mb-2 text-gray-800 italic">{problem.notes}</div>}
      <div className="mb-2">Language: <span className="font-mono">{problem.language}</span></div>
      <div className="mb-4">
        <a href={`https://github.com/${import.meta.env.VITE_GITHUB_REPO || 'yourusername/leetcode-tracker'}/blob/main/solutions/${problem.filename}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View on GitHub</a>
      </div>
      <SyntaxHighlighter language={problem.language.toLowerCase()} style={vscDarkPlus} showLineNumbers>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default ProblemDetail; 