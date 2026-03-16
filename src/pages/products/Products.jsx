import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const PRODUCT_API_URL = `${API_BASE_URL}/product`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(PRODUCT_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleView = (product) => {
    console.log("View product:", product);
    // Navigate to product detail page or open modal
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`${PRODUCT_API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      // Some APIs return 204 No Content, no JSON
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddProduct = () => navigate("/add-product");

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

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
          <p>Error loading products: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Product Management</h1>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition transform hover:scale-105"
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* First image as thumbnail */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? `${API_BASE_URL}${product.images[0]}`
                      : "https://via.placeholder.com/400x200?text=No+Image"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x200?text=Image+Error";
                  }}
                />
                {product.images && product.images.length > 1 && (
                  <span className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    +{product.images.length - 1} more
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-gray-600 mb-2">₹{product.price}</p>
                {product.discountPercentage > 0 && (
                  <p className="text-sm text-green-600 mb-2">{product.discountPercentage}% off</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Added: {formatDate(product.createdAt)}</div>
                  <div className="flex space-x-3">
                    <button onClick={() => handleView(product)} className="text-blue-500 hover:text-blue-700" title="View" disabled={deleteLoading}>
                      <FaEye size={18} />
                    </button>
                    <button onClick={() => handleEdit(product)} className="text-green-500 hover:text-green-700" title="Edit" disabled={deleteLoading}>
                      <FaEdit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700" title="Delete" disabled={deleteLoading}>
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;