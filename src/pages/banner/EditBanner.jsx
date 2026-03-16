import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api-shridha.houseofresha.com';
const BANNER_API_URL = `${API_BASE_URL}/banner`;

const EditBanner = () => {
  const { id } = useParams(); // Get banner ID from URL (e.g., /edit-banner/:id)
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [desktopImage, setDesktopImage] = useState(null);      // new file for desktop
  const [mobileImage, setMobileImage] = useState(null);        // new file for mobile
  const [existingDesktopUrl, setExistingDesktopUrl] = useState('');
  const [existingMobileUrl, setExistingMobileUrl] = useState('');

  // Fetch existing banner data
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BANNER_API_URL}/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch banner (status ${response.status})`);
        }
        const result = await response.json();
        if (result.success && result.data) {
          // Handle both single object or array response
          const bannerData = Array.isArray(result.data) ? result.data[0] : result.data;
          setExistingDesktopUrl(bannerData.imageUrl);
          setExistingMobileUrl(bannerData.mobileImageUrl);
        } else {
          throw new Error('Invalid banner data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBanner();
    }
  }, [id]);

  const handleDesktopChange = (e) => {
    setDesktopImage(e.target.files[0] || null);
  };

  const handleMobileChange = (e) => {
    setMobileImage(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Build FormData with only changed fields (PATCH semantics)
    const formData = new FormData();
    if (desktopImage) formData.append('imageUrl', desktopImage);
    if (mobileImage) formData.append('mobileImageUrl', mobileImage);

    // If nothing changed, warn but allow submission (API might ignore empty)
    if (formData.entries().next().done) {
      setError('No changes detected. Please select new images or cancel.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${BANNER_API_URL}/${id}`, {
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
        setSuccess('Banner updated successfully!');
        // Redirect back to banner list after 2 seconds
        setTimeout(() => {
          navigate('/banner'); // Adjust to your banner list route
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
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Banner</h2>

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
          {/* Current Desktop Image Preview */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Current Desktop Image
            </label>
            {existingDesktopUrl ? (
              <img
                src={`${API_BASE_URL}${existingDesktopUrl}`}
                alt="Current desktop"
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

          {/* New Desktop Image (optional) */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Replace Desktop Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleDesktopChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {desktopImage && (
              <p className="text-sm text-gray-500 mt-1">Selected: {desktopImage.name}</p>
            )}
          </div>

          {/* Current Mobile Image Preview */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Current Mobile Image
            </label>
            {existingMobileUrl ? (
              <img
                src={`${API_BASE_URL}${existingMobileUrl}`}
                alt="Current mobile"
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

          {/* New Mobile Image (optional) */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Replace Mobile Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMobileChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {mobileImage && (
              <p className="text-sm text-gray-500 mt-1">Selected: {mobileImage.name}</p>
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
              {submitting ? 'Updating...' : 'Update Banner'}
            </button>
          </div>
        </form>

        
      </div>
    </div>
  );
};

export default EditBanner;