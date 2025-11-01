import React, { useState } from 'react';

/**
 * ReviewSummarizer component
 *
 * This admin-facing page allows an administrator to paste or fetch
 * multiple reviews for a vendor and receive a concise summary of
 * sentiments and recurring themes. The admin enters the vendor ID
 * and a list of reviews (one per line). When submitted, the
 * component calls the backend AI endpoint and displays the summary.
 */
function ReviewSummarizer() {
  const [vendorId, setVendorId] = useState('');
  const [reviewsText, setReviewsText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviews = reviewsText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r);
    if (!vendorId || reviews.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/review-summarizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ vendorId, reviews }),
      });
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary);
      } else {
        setSummary(data.message || 'Failed to summarize reviews');
      }
    } catch (err) {
      setSummary('Error summarizing reviews');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Review Summarizer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="vendorId" className="block text-gray-700 font-medium">
            Vendor ID
          </label>
          <input
            id="vendorId"
            type="text"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="reviews" className="block text-gray-700 font-medium">
            Reviews (one per line)
          </label>
          <textarea
            id="reviews"
            rows="8"
            value={reviewsText}
            onChange={(e) => setReviewsText(e.target.value)}
            className="w-full border rounded-md p-2"
            placeholder="Copy & paste customer reviews here..."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Summarizing…' : 'Summarize Reviews'}
        </button>
      </form>
      {summary && (
        <div className="mt-8 bg-gray-100 p-4 rounded-md whitespace-pre-line">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default ReviewSummarizer;