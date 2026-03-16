import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api-shridha.houseofresha.com';
const CATEGORY_API_URL = `${API_BASE_URL}/category`;

const EditCategory = () => {
  const { id } = useParams(); // Get category ID from URL (e.g., /edit-category/:id)
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);           // new image file (optional)
  const [existingImageUrl, setExistingImageUrl] = useState('');

  // Fetch existing category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${CATEGORY_API_URL}/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch category (status ${response.status})`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          // Handle both single object or array response
          const categoryData = Array.isArray(result.data) ? result.data[0] : result.data;
          setName(categoryData.name || '');
          setExistingImageUrl(categoryData.imageUrl || '');
        } else {
          throw new Error('Invalid category data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Build FormData with only changed fields (PATCH semantics)
    const formData = new FormData();

    if (name.trim() !== '') {
      // Only send name if it's not empty (API might require it even if unchanged? We'll send if it's different from original? But we don't have original name in state easily. We'll send always if not empty, API should handle.)
      formData.append('name', name.trim());
    }

    if (image) {
      // The field name must match what your API expects – from GET response it's 'imageUrl'
      formData.append('imageUrl', image);
    }

    // If nothing changed, warn but allow submission (API might ignore empty)
    if (formData.entries().next().done) {
      setError('No changes detected. Please modify the name or select a new image.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${CATEGORY_API_URL}/${id}`, {
        method: 'PATCH',
        body: formData,
        // Do NOT set Content-Type header – browser sets it with boundary
      });

      const result = await response.json();
      console.log('Update response:', result);

      if (!response.ok) {
        throw new Error(result.message || `HTTP error ${response.status}`);
      }

      if (result.success) {
        setSuccess('Category updated successfully!');
        // Redirect back to category list after a short delay
        setTimeout(() => {
          navigate('/categories'); // Adjust to your category list route
        }, 2000);
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Category</h2>

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
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category name"
            />
          </div>

          {/* Current Image Preview */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Current Image</label>
            {existingImageUrl ? (
              <img
                src={`${API_BASE_URL}${existingImageUrl}`}
                alt="Current category"
                className="h-32 w-auto object-cover border rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200x100?text=Preview+Error';
                }}
              />
            ) : (
              <p className="text-gray-500">No image</p>
            )}
          </div>

          {/* New Image (optional) */}
          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
              Replace Image (optional)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              disabled={submitting}
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <p className="font-semibold">📌 Note:</p>
          <ul className="list-disc list-inside text-yellow-800">
            <li>The image field name used is <code>imageUrl</code> – if your API expects something else (e.g., <code>image</code>), change it in <code>formData.append('imageUrl', image)</code>.</li>
            <li>Only changed fields are sent (PATCH).</li>
            <li>Check browser Network tab if update fails.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;