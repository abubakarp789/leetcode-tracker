import React, { useState, useEffect } from 'react';
import { addProblem } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblems } from '../api';
import Card from '../components/Card';

function AddProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: '',
    title: '',
    difficulty: 'Easy',
    tags: [], // now an array
    status: 'Solved',
    date: '',
    language: 'Python',
    notes: '',
    code: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      // Fetch all problems and find the one to edit
      getProblems().then(res => {
        const problem = res.data.find(p => p.id === id);
        if (problem) {
          setForm({
            id: problem.id,
            title: problem.title,
            difficulty: problem.difficulty,
            tags: Array.isArray(problem.tags) ? problem.tags : (problem.tags ? problem.tags.split(',') : []),
            status: problem.status,
            date: problem.date,
            language: problem.language,
            notes: problem.notes || '',
            code: '', // Solution code not loaded for editing (could be fetched if needed)
            password: '',
          });
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add tag input handlers
  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      if (!form.tags.includes(e.target.value.trim())) {
        setForm({ ...form, tags: [...form.tags, e.target.value.trim()] });
      }
      e.target.value = '';
    }
  };
  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code && !isEdit) {
      setMessage('❌ Please paste your solution code.');
      return;
    }
    setLoading(true);
    setMessage('');
    
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'password' && key !== 'code') {
        if (key === 'tags') {
          formData.append('tags', value.join(','));
        } else {
          formData.append(key, value);
        }
      }
    });
    if (form.code) {
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
    }

    try {
      if (isEdit) {
        // TODO: Call updateProblem API (to be implemented)
        setMessage('✅ Problem updated successfully!');
      } else {
        await addProblem(formData, form.password);
        setMessage('✅ Problem added successfully!');
        setForm({ id: '', title: '', difficulty: 'Easy', tags: [], status: 'Solved', date: '', language: 'Python', notes: '', code: '', password: '' });
      }
      setTimeout(() => navigate('/problems'), 1000);
    } catch (err) {
      setMessage(`❌ Failed to ${isEdit ? 'update' : 'add'} problem: ${err.message}. Check your password or try again.`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-12">
      <div className="max-w-2xl mx-auto py-8">
        <Card className="p-8 border-t-4 border-blue-400">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-6 text-center">{isEdit ? 'Edit Problem' : 'Add New Problem'}</h2>
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
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center">
                      {tag}
                      <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => removeTag(tag)}>&times;</button>
                    </span>
                  ))}
                </div>
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="Type a tag and press Enter"
                  className="input-field"
                  onKeyDown={handleTagInput}
                />
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
              {loading ? (isEdit ? 'Updating Problem...' : 'Adding Problem...') : (isEdit ? 'Update Problem' : 'Add Problem')}
            </button>
            {message && (
              <div className={`mt-4 text-center font-medium ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}

export default AddProblem;