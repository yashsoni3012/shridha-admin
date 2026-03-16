import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const PRODUCT_API_URL = `${API_BASE_URL}/product`;
const CATEGORY_API_URL = `${API_BASE_URL}/category`;

const COLOR_OPTIONS = [
  "Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple",
  "Orange", "Brown", "Gray", "Navy", "Teal", "Maroon", "Gold", "Silver"
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [original, setOriginal] = useState(null);

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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [replaceMap, setReplaceMap] = useState({});

  // Fetch categories
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

  // Helper to safely parse comma-separated string or array into array
  const parseCommaString = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str; // already array
    if (typeof str === 'string') {
      return str.split(',').map(s => s.trim()).filter(s => s !== '');
    }
    return [];
  };

  // Helper to extract category ID (handles both string and object)
  const getCategoryId = (category) => {
    if (!category) return "";
    if (typeof category === "string") return category;
    if (typeof category === "object" && category._id) return category._id;
    return "";
  };

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);
        const res = await fetch(`${PRODUCT_API_URL}/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch product (status ${res.status})`);
        const result = await res.json();
        if (result.success && result.data) {
          const product = Array.isArray(result.data) ? result.data[0] : result.data;
          setOriginal(product);
          setFormData({
            name: product.name || "",
            price: product.price || "",
            discountPercentage: product.discountPercentage || "",
            category: getCategoryId(product.category),
            specification: product.specification || "",
            description: product.description || "",
          });
          setSelectedColors(parseCommaString(product.colors));
         setSelectedSizes(
  parseCommaString(product.sizes).map((s) => s.toUpperCase())
);
          setExistingImages(product.images || []);
        } else {
          throw new Error("Invalid product data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProduct(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

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

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + newImages.length + files.length > 5) {
      setError("Maximum 5 images allowed.");
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
  };

  const markImageForDeletion = (index) => {
    const urlToDelete = existingImages[index];
    setImagesToDelete((prev) => [...prev, urlToDelete]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    if (replaceMap[index]) {
      const newReplaceMap = { ...replaceMap };
      delete newReplaceMap[index];
      setReplaceMap(newReplaceMap);
    }
  };

  const replaceImage = (index, file) => {
    const url = existingImages[index];
    if (imagesToDelete.includes(url)) {
      setImagesToDelete((prev) => prev.filter((u) => u !== url));
    }
    setReplaceMap((prev) => ({ ...prev, [index]: file }));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Safe comparison without mutating state
  const arraysEqual = (a, b) => {
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return JSON.stringify(sortedA) === JSON.stringify(sortedB);
  };

  const textFieldsChanged = () => {
    if (!original) return false;
    return (
      formData.name !== original.name ||
      formData.price !== original.price ||
      formData.discountPercentage !== original.discountPercentage ||
      formData.category !== getCategoryId(original.category) ||
      formData.specification !== original.specification ||
      formData.description !== original.description
    );
  };

  const colorsChanged = () => {
    if (!original) return false;
    const originalColors = parseCommaString(original.colors);
    return !arraysEqual(selectedColors, originalColors);
  };

  const sizesChanged = () => {
    if (!original) return false;
    const originalSizes = parseCommaString(original.sizes);
    return !arraysEqual(selectedSizes, originalSizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const submitData = new FormData();

    if (textFieldsChanged()) {
      submitData.append("name", formData.name);
      submitData.append("price", formData.price);
      if (formData.discountPercentage) submitData.append("discountPercentage", formData.discountPercentage);
      submitData.append("category", formData.category);
      submitData.append("specification", formData.specification);
      submitData.append("description", formData.description);
    }

    // Send colors as separate fields (array) if changed
    if (colorsChanged()) {
      selectedColors.forEach(color => submitData.append("colors", color));
    }

    // Send sizes as separate fields (array) if changed
    if (sizesChanged()) {
      selectedSizes.forEach(size =>
  submitData.append("sizes", size.toLowerCase())
);
    }

    imagesToDelete.forEach((url) => {
      submitData.append("deleteImages", url);
    });

    Object.entries(replaceMap).forEach(([index, file]) => {
      submitData.append("images", file);
      submitData.append("replaceIndexes", index);
    });

    if (newImages.length > 0) {
      newImages.forEach((file) => submitData.append("images", file));
      submitData.append("addImages", "true");
    }

    if (submitData.entries().next().done) {
      setError("No changes detected.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${PRODUCT_API_URL}/${id}`, {
        method: "PATCH",
        body: submitData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `HTTP error ${response.status}`);
      if (result.success) {
        setSuccess("Product updated successfully!");
        setTimeout(() => navigate("/products"), 2000);
      } else {
        throw new Error(result.message || "Update failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories || loadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h2>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        )}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
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

          {/* Images Management */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Current Images</label>
            <div className="flex flex-wrap gap-4 mb-4">
              {existingImages.map((url, idx) => (
                <div key={idx} className="relative border rounded p-1">
                  <img src={`${API_BASE_URL}${url}`} alt={`product ${idx}`} className="h-20 w-20 object-cover" />
                  <div className="absolute top-0 right-0 flex space-x-1">
                    <button
                      type="button"
                      onClick={() => markImageForDeletion(idx)}
                      className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      title="Delete"
                    >
                      ×
                    </button>
                    <label className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer" title="Replace">
                      ↻
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) replaceImage(idx, file);
                        }}
                      />
                    </label>
                  </div>
                  {replaceMap[idx] && (
                    <span className="absolute bottom-0 left-0 bg-green-500 text-white text-xs px-1 rounded">new</span>
                  )}
                </div>
              ))}
            </div>

            {imagesToDelete.length > 0 && (
              <div className="mb-2 text-sm text-red-600">
                {imagesToDelete.length} image(s) will be deleted.
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Add More Images (max 5 total)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddImages}
                className="w-full border rounded-lg p-2"
              />
            </div>

            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newImages.map((file, idx) => (
                  <div key={idx} className="relative">
                    <img src={URL.createObjectURL(file)} alt="new" className="h-16 w-16 object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
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
              disabled={submitting}
              className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {submitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;