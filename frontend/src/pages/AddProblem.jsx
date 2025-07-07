import React, { useState } from 'react';
import { addProblem } from '../api';
import Card from '../components/Card';

function AddProblem() {
  const [form, setForm] = useState({
    id: '',
    title: '',
    difficulty: 'Easy',
    tags: '',
    status: 'Solved',
    date: '',
    language: 'Python',
    notes: '',
    code: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code) {
      setMessage('❌ Please paste your solution code.');
      return;
    }
    setLoading(true);
    setMessage('');
    
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'password' && key !== 'code') formData.append(key, value);
    });

    // Determine file extension based on language
    const ext = form.language.toLowerCase() === 'python' ? 'py'
      : form.language.toLowerCase() === 'cpp' ? 'cpp'
      : form.language.toLowerCase() === 'java' ? 'java'
      : form.language.toLowerCase() === 'javascript' ? 'js'
      : form.language.toLowerCase() === 'typescript' ? 'ts'
      : form.language.toLowerCase() === 'c' ? 'c'
      : form.language.toLowerCase() === 'go' ? 'go'
      : 'txt';
    const filename = `${form.id}-${form.title.toLowerCase().replace(/\s+/g, '-')}.${ext}`;

    const solutionBlob = new Blob([form.code], { type: 'text/plain' });
    formData.append('solution', solutionBlob, filename);

    try {
      await addProblem(formData, form.password);
      setMessage('✅ Problem added successfully!');
      setForm({ id: '', title: '', difficulty: 'Easy', tags: '', status: 'Solved', date: '', language: 'Python', notes: '', code: '', password: '' });
    } catch (err) {
      setMessage(`❌ Failed to add problem: ${err.message}. Check your password or try again.`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-12">
      <div className="max-w-2xl mx-auto py-8">
        <Card className="p-8 border-t-4 border-blue-400">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-6 text-center">Add New Problem</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Problem ID</label>
                <input name="id" id="id" value={form.id} onChange={handleChange} placeholder="e.g. 001" className="input-field" required />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input name="title" id="title" value={form.title} onChange={handleChange} placeholder="e.g. Two Sum" className="input-field" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                <select name="difficulty" id="difficulty" value={form.difficulty} onChange={handleChange} className="input-field">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
                <input name="tags" id="tags" value={form.tags} onChange={handleChange} placeholder="e.g. Array, Hash Table" className="input-field" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select name="status" id="status" value={form.status} onChange={handleChange} className="input-field">
                  <option>Solved</option>
                  <option>Unsolved</option>
                </select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Solved</label>
                <input name="date" id="date" type="date" value={form.date} onChange={handleChange} className="input-field" required />
              </div>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
              <select name="language" id="language" value={form.language} onChange={handleChange} className="input-field">
                <option>Python</option>
                <option>Cpp</option>
                <option>Java</option>
                <option>JavaScript</option>
                <option>TypeScript</option>
                <option>C</option>
                <option>Go</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
              <textarea name="notes" id="notes" value={form.notes} onChange={handleChange} placeholder="Add any notes about the problem or solution..." className="input-field min-h-[80px]" />
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Solution Code</label>
              <textarea name="code" id="code" value={form.code} onChange={handleChange} placeholder="Paste your solution code here..." className="input-field font-mono min-h-[200px]" required />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Password</label>
              <input name="password" id="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter admin password" className="input-field" required />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out shadow-md" disabled={loading}>
              {loading ? 'Adding Problem...' : 'Add Problem'}
            </button>
            {message && <div className={`mt-4 text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
          </form>
        </Card>
      </div>
      <style>{`
        .input-field {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0; /* Tailwind gray-200 */
          border-radius: 0.5rem; /* Tailwind rounded-lg */
          background-color: #ffffff; /* Tailwind bg-white */
          color: #1a202c; /* Tailwind gray-900 */
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .input-field:focus {
          border-color: #6366f1; /* Tailwind indigo-500 */
          outline: none;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); /* Tailwind ring-indigo-200 */
        }
        .dark .input-field {
          background-color: #2d3748; /* Tailwind gray-800 */
          border-color: #4a5568; /* Tailwind gray-600 */
          color: #e2e8f0; /* Tailwind gray-200 */
        }
        .dark .input-field:focus {
          border-color: #818cf8; /* Tailwind indigo-400 */
          box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.3); /* Tailwind ring-indigo-300 */
        }
      `}</style>
    </div>
  );
}

export default AddProblem; 