import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api-shridha.houseofresha.com';
const BANNER_API_URL = `${API_BASE_URL}/banner`;

const AddBanner = () => {
  const navigate = useNavigate();
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'desktop') {
      setDesktopImage(file);
    } else {
      setMobileImage(file);
    }
  };

  const validateForm = () => {
    if (!desktopImage) {
      setError('Desktop image is required');
      return false;
    }
    if (!mobileImage) {
      setError('Mobile image is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    // Create FormData with field names exactly as your API expects
    const formData = new FormData();
    // IMPORTANT: Use the same keys as in your GET response: 'imageUrl' and 'mobileImageUrl'
    formData.append('imageUrl', desktopImage);
    formData.append('mobileImageUrl', mobileImage);

    // Optional: If API expects additional fields like alt text, add them here
    // formData.append('altText', 'Some description');

    setLoading(true);

    try {
      // Log the FormData entries for debugging (can't directly log, but we can iterate)
      console.log('Uploading files:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1].name);
      }

      const response = await fetch(BANNER_API_URL, {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header, let browser set it with boundary
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        // If response is not ok, throw error with message from API or default
        throw new Error(result.message || `HTTP error ${response.status}`);
      }

      // Check if result indicates success (your API returns { success: true, data: [...] })
      if (result.success) {
        setSuccess('Banner added successfully!');
        // Reset form
        setDesktopImage(null);
        setMobileImage(null);
        // Reset file input visually (optional)
        e.target.reset();
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/banners'); // adjust path as needed
        }, 2000);
      } else {
        throw new Error(result.message || 'Unknown error');
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Banner</h2>

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
          {/* Desktop Image */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Desktop Image (imageUrl) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'desktop')}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {desktopImage && (
              <p className="text-sm text-gray-500 mt-1">Selected: {desktopImage.name}</p>
            )}
          </div>

          {/* Mobile Image */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Mobile Image (mobileImageUrl) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'mobile')}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {mobileImage && (
              <p className="text-sm text-gray-500 mt-1">Selected: {mobileImage.name}</p>
            )}
          </div>

          {/* Submit Button */}
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
              {loading ? 'Uploading...' : 'Add Banner'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddBanner;