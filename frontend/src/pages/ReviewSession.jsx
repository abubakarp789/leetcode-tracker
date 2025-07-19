import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblem, reviewProblem } from '../api';

const ReviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await getProblem(id);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };

    fetchProblem();
  }, [id]);

  const handleReview = async (quality) => {
    try {
      await reviewProblem(id, quality);
      navigate('/review');
    } catch (error) {
      console.error('Error reviewing problem:', error);
    }
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
      <div className="mb-4">
        <p>{problem.description}</p>
      </div>
      {showSolution ? (
        <div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Solution & Notes</h2>
            <pre className="whitespace-pre-wrap">{problem.notes}</pre>
          </div>
          <div className="mt-4 flex justify-around">
            <button onClick={() => handleReview(1)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Hard</button>
            <button onClick={() => handleReview(3)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Medium</button>
            <button onClick={() => handleReview(5)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Easy</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowSolution(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Show Solution & Notes
        </button>
      )}
    </div>
  );
};

export default ReviewSession;
