import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const BANNER_API_URL = `${API_BASE_URL}/banner`;

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false); // optional, for button state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch(BANNER_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setBanners(result.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleView = (banner) => {
    console.log("View banner:", banner);
    // You can open a modal or navigate to a detail page here
  };

  const handleEdit = (banner) => {
    navigate(`/edit-banner/${banner._id}`);
  };

  const handleDelete = async (id) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`${BANNER_API_URL}/${id}`, {
        method: "DELETE",
      });

      // Some APIs return 204 No Content, others return JSON
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      }

      if (!response.ok) {
        throw new Error(result?.message || `HTTP error ${response.status}`);
      }

      // Check if API returned success flag (optional)
      if (result && !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      // Remove deleted banner from state
      setBanners((prev) => prev.filter((b) => b._id !== id));
      alert("Banner deleted successfully!"); // Optional feedback
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Failed to delete banner: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddBanner = () => {
    navigate("/add-banner");
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading banners: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Banner Management
        </h1>
        <button
          onClick={handleAddBanner}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
        >
          + Add Banner
        </button>
      </div>

      {/* Banner Grid */}
      {banners.length === 0 ? (
        <p className="text-center text-gray-500">No banners found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={`${API_BASE_URL}${banner.imageUrl}`}
                  alt={`Banner ${banner._id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=Image+Not+Found";
                  }}
                />
                {banner.mobileImageUrl && (
                  <span className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    Mobile version available
                  </span>
                )}
              </div>

              {/* Card Footer with Icons and Date */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">
                    Added: {formatDate(banner.createdAt)}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleView(banner)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View"
                      disabled={deleteLoading} // optional: disable during delete
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(banner)}
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title="Edit"
                      disabled={deleteLoading}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                      disabled={deleteLoading}
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
                {banner.updatedAt !== banner.createdAt && (
                  <p className="text-xs text-gray-400">
                    Updated: {formatDate(banner.updatedAt)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerList;