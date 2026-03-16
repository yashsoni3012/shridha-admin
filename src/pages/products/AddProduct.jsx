import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const PRODUCT_API_URL = `${API_BASE_URL}/product`;
const CATEGORY_API_URL = `${API_BASE_URL}/category`;

// Predefined options
const COLOR_OPTIONS = [
  "Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple",
  "Orange", "Brown", "Gray", "Navy", "Teal", "Maroon", "Gold", "Silver"
];

const SIZE_OPTIONS = ["xs", "s", "m", "l", "xl", "xxl"];

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPercentage: "",
    category: "",
    specification: "",
    description: "",
  });

  // Multi-select state
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(CATEGORY_API_URL);
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Product name is required";
    if (!formData.price || isNaN(formData.price)) return "Valid price is required";
    if (!formData.category) return "Category is required";
    if (imageFiles.length === 0) return "At least one image is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const submitData = new FormData();
    submitData.append("name", formData.name.trim());
    submitData.append("price", formData.price);
    if (formData.discountPercentage) submitData.append("discountPercentage", formData.discountPercentage);
    submitData.append("category", formData.category);
    // Convert arrays to comma-separated strings
    submitData.append("colors", selectedColors.join(","));
    submitData.append(
  "sizes",
  selectedSizes.map(size => size.toLowerCase()).join(",")
);
    submitData.append("specification", formData.specification);
    submitData.append("description", formData.description);

    imageFiles.forEach((file) => {
      submitData.append("images", file);
    });

    setLoading(true);
    try {
      const response = await fetch(PRODUCT_API_URL, {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `HTTP error ${response.status}`);
      if (result.success) {
        setSuccess("Product added successfully!");
        setTimeout(() => navigate("/products"), 2000);
      } else {
        throw new Error(result.message || "Failed to add product");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        )}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Discount %</label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Colors - Multi-select checkboxes */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Colors</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <label key={color} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={color}
                    checked={selectedColors.includes(color)}
                    onChange={() => handleColorToggle(color)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes - Multi-select checkboxes */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Sizes</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SIZE_OPTIONS.map((size) => (
                <label key={size} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={size}
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specification & Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Specification</label>
            <textarea
              name="specification"
              value={formData.specification}
              onChange={handleInputChange}
              rows="3"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Product Images (max 5) *</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border rounded-lg p-2"
            />
            {imageFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview ${idx}`}
                      className="h-16 w-16 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;