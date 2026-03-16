import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const CATEGORY_API_URL = `${API_BASE_URL}/category`;

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(CATEGORY_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleView = (category) => {
    console.log("View category:", category);
    // Optional: navigate to detail page or open modal
  };

  const handleEdit = (category) => {
    navigate(`/edit-category/${category._id}`); // adjust route as needed
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`${CATEGORY_API_URL}/${id}`, {
        method: "DELETE",
      });

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      }

      if (!response.ok) {
        throw new Error(result?.message || `HTTP error ${response.status}`);
      }

      if (result && !result.success) {
        throw new Error(result.message || "Delete failed");
      }

      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      alert("Category deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert(`Failed to delete category: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddCategory = () => {
    navigate("/add-category"); // adjust route as needed
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
          <p>Error loading categories: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Category Management
        </h1>
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
        >
          + Add Category
        </button>
      </div>

      {/* Category Grid */}
      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={`${API_BASE_URL}${category.imageUrl}`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Added: {formatDate(category.createdAt)}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleView(category)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="View"
                      disabled={deleteLoading}
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-green-500 hover:text-green-700 transition-colors"
                      title="Edit"
                      disabled={deleteLoading}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                      disabled={deleteLoading}
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
                {category.updatedAt !== category.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Updated: {formatDate(category.updatedAt)}
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

export default CategoryList;