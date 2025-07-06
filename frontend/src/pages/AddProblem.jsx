import { useState } from 'react';
import { addProblem } from '../api';

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
    password: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'password') formData.append(key, value);
    });
    if (file) formData.append('solution', file);
    try {
      await addProblem(formData, form.password);
      setMessage('✅ Problem added successfully!');
      setForm({ id: '', title: '', difficulty: 'Easy', tags: '', status: 'Solved', date: '', language: 'Python', notes: '', password: '' });
      setFile(null);
    } catch (err) {
      setMessage('❌ Failed to add problem. Check your password or try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add New Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input name="id" value={form.id} onChange={handleChange} placeholder="ID (e.g. 001)" className="input" required />
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="input" required />
        </div>
        <div className="flex gap-4">
          <select name="difficulty" value={form.difficulty} onChange={handleChange} className="input">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="input" required />
        </div>
        <div className="flex gap-4">
          <select name="status" value={form.status} onChange={handleChange} className="input">
            <option>Solved</option>
            <option>Unsolved</option>
          </select>
          <input name="date" type="date" value={form.date} onChange={handleChange} className="input" required />
        </div>
        <div className="flex gap-4">
          <select name="language" value={form.language} onChange={handleChange} className="input">
            <option>Python</option>
            <option>Cpp</option>
            <option>Java</option>
            <option>JavaScript</option>
            <option>TypeScript</option>
            <option>C</option>
            <option>Go</option>
            <option>Other</option>
          </select>
          <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes (optional)" className="input" />
        </div>
        <div>
          <input type="file" accept=".py,.cpp,.js,.ts,.java,.c,.go,.md,.txt" onChange={handleFile} required />
        </div>
        <div>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Admin Password" className="input" required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Uploading...' : 'Add Problem'}</button>
        {message && <div className="mt-2 text-center">{message}</div>}
      </form>
      <style>{`.input{border:1px solid #ddd;padding:0.5rem 0.75rem;border-radius:0.375rem;width:100%;}`}</style>
    </div>
  );
}

export default AddProblem; 