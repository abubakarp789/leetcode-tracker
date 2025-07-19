import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import AddProblem from './pages/AddProblem';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReviewQueue from './pages/ReviewQueue';
import ReviewSession from './pages/ReviewSession';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto px-4 py-6 min-h-[80vh] bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          <Route path="/add" element={<AddProblem />} />
          <Route path="/review" element={<ReviewQueue />} />
          <Route path="/review/:id" element={<ReviewSession />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App; 