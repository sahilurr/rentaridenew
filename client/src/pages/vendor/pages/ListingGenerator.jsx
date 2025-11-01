import React, { useState } from 'react';

/**
 * ListingGenerator component
 *
 * This vendor-facing page enables a vendor to generate a persuasive
 * description for their vehicle listing using generative AI. The
 * vendor enters basic facts about the vehicle and clicks a
 * “Generate” button. The generated description is then displayed
 * and can be copied into their listing form.
 */
function ListingGenerator() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    fuel: '',
    seats: '',
    transmission: '',
  });
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.brand || !formData.model || !formData.year) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/listing-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setDescription(data.description);
      } else {
        setDescription(data.message || 'Failed to generate description');
      }
    } catch (err) {
      setDescription('Error generating description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">AI Listing Generator</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Year</label>
          <input
            type="number"
            min="1900"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Fuel</label>
          <input
            type="text"
            name="fuel"
            value={formData.fuel}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Seats</label>
          <input
            type="number"
            min="1"
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Transmission</label>
          <input
            type="text"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Generating…' : '✨ Generate'}
        </button>
      </div>
      {description && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md whitespace-pre-line">
          <h2 className="text-lg font-semibold mb-2">Generated Description</h2>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}

export default ListingGenerator;