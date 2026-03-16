import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api-shridha.houseofresha.com';
const CATEGORY_API_URL = `${API_BASE_URL}/category`;

const AddCategory = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file || null);
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError('Category name is required');
      return false;
    }
    if (!image) {
      setError('Category image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', name.trim());
    // IMPORTANT: The field name for the image must match what your API expects.
    // Based on your GET response, the field is 'imageUrl'. If the API expects 'image', change this line.
    formData.append('imageUrl', image);

    setLoading(true);
    try {
      const response = await fetch(CATEGORY_API_URL, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header – browser will set it with the boundary
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(result.message || `HTTP error ${response.status}`);
      }

      if (result.success) {
        setSuccess('Category added successfully!');
        // Reset form
        setName('');
        setImage(null);
        // Reset file input visually
        e.target.reset();
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/categories'); // Adjust to your category list route
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to add category');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Category</h2>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Category Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Short Kurti"
              required
            />
          </div>

          {/* Category Image */}
          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
              Category Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {image && (
              <p className="text-sm text-gray-500 mt-1">Selected: {image.name}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>

        {/* Debug hint */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <p className="font-semibold">📌 Note:</p>
          <ul className="list-disc list-inside text-yellow-800">
            <li>The image field name used is <code>imageUrl</code> – if your API expects <code>image</code>, change it in <code>formData.append('imageUrl', image)</code>.</li>
            <li>Check browser Network tab if submission fails to see exact error.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;