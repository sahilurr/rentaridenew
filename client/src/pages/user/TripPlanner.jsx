import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

/**
 * TripPlanner component
 *
 * This user-facing page allows a renter to input a destination and
 * the length of the trip (in days). When submitted, it sends a
 * request to the backend AI endpoint to generate a detailed
 * itinerary and recommends an appropriate vehicle type. The
 * generated output is displayed below the form.
 */
function TripPlanner() {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination || !duration) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         credentials: 'include',
        body: JSON.stringify({ destination, duration }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.message);
      } else {
        setResult(data.message || 'Something went wrong');
      }
    } catch (err) {
      setResult('Error calling AI service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">AI Trip Planner</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="destination" className="block text-gray-700 font-medium">
            Destination
          </label>
          <input
            id="destination"
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Goa"
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-gray-700 font-medium">
            Trip length (days)
          </label>
          <input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Number of days"
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Itinerary'}
        </button>
      </form>
      {result && (
        <div className="mt-8 bg-gray-100 p-4 rounded-md whitespace-pre-line">
          <h2 className="text-xl font-semibold mb-2">Suggested Itinerary & Vehicle</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default TripPlanner;