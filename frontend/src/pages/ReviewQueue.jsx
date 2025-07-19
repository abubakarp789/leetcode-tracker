import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReviewQueue } from '../api';
import Card from '../components/Card';

const ReviewQueue = () => {
  const [reviewQueue, setReviewQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewQueue = async () => {
      try {
        const response = await getReviewQueue();
        setReviewQueue(response.data);
      } catch (error) {
        console.error('Error fetching review queue:', error);
      }
      setLoading(false);
    };

    fetchReviewQueue();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Review Queue</h1>
      {reviewQueue.length > 0 ? (
        <div>
          <p className="mb-4">You have {reviewQueue.length} problems to review today.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewQueue.map(problem => (
              <Card key={problem.id} problem={problem} />
            ))}
          </div>
        </div>
      ) : (
        <p>Your review queue is empty. Great job!</p>
      )}
    </div>
  );
};

export default ReviewQueue;
