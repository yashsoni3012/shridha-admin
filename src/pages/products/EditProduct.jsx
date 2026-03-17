import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const PRODUCT_API_URL = `${API_BASE_URL}/product`;
const CATEGORY_API_URL = `${API_BASE_URL}/category`;

const COLOR_OPTIONS = [
  "Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple",
  "Orange", "Brown", "Gray", "Navy", "Teal", "Maroon", "Gold", "Silver",
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

// ── Shared style helpers ──
const labelStyle = {
  display: "block", marginBottom: 6,
  fontSize: 13.5, fontWeight: 600, color: "#374151",
};

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  border: "1.5px solid #e5e7eb", borderRadius: 10,
  padding: "10px 14px", fontSize: 13.5,
  color: "#374151", background: "#fafafa",
  outline: "none", fontFamily: "inherit",
  transition: "border-color .15s, background .15s",
};

const fieldDesc = { margin: "5px 0 0", fontSize: 12.5, color: "#9ca3af" };

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
  const [focusedField, setFocusedField] = useState("");

  const [formData, setFormData] = useState({
    name: "", price: "", discountPercentage: "",
    category: "", specification: "", description: "",
  });

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
        if (result.success && Array.isArray(result.data)) setCategories(result.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const parseCommaString = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    if (typeof str === "string") return str.split(",").map((s) => s.trim()).filter((s) => s !== "");
    return [];
  };

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
          setSelectedSizes(parseCommaString(product.sizes).map((s) => s.toUpperCase()));
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

  const handleColorToggle = (color) =>
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );

  const handleSizeToggle = (size) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );

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
    if (imagesToDelete.includes(url)) setImagesToDelete((prev) => prev.filter((u) => u !== url));
    setReplaceMap((prev) => ({ ...prev, [index]: file }));
  };

  const removeNewImage = (index) => setNewImages((prev) => prev.filter((_, i) => i !== index));

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
    return !arraysEqual(selectedColors, parseCommaString(original.colors));
  };

  const sizesChanged = () => {
    if (!original) return false;
    return !arraysEqual(selectedSizes, parseCommaString(original.sizes));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    const submitData = new FormData();
    if (textFieldsChanged()) {
      submitData.append("name", formData.name);
      submitData.append("price", formData.price);
      if (formData.discountPercentage) submitData.append("discountPercentage", formData.discountPercentage);
      submitData.append("category", formData.category);
      submitData.append("specification", formData.specification);
      submitData.append("description", formData.description);
    }
    if (colorsChanged()) selectedColors.forEach((color) => submitData.append("colors", color));
    if (sizesChanged()) selectedSizes.forEach((size) => submitData.append("sizes", size.toLowerCase()));
    imagesToDelete.forEach((url) => submitData.append("deleteImages", url));
    Object.entries(replaceMap).forEach(([index, file]) => {
      submitData.append("images", file);
      submitData.append("replaceIndexes", index);
    });
    if (newImages.length > 0) {
      newImages.forEach((file) => submitData.append("images", file));
      submitData.append("addImages", "true");
    }
    if (submitData.entries().next().done) { setError("No changes detected."); return; }

    setSubmitting(true);
    try {
      const response = await fetch(`${PRODUCT_API_URL}/${id}`, { method: "PATCH", body: submitData });
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

  const focusStyle = (name) =>
    focusedField === name ? { borderColor: "#1a1a1a", background: "#fff" } : {};

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const totalImages = existingImages.length + newImages.length;

  // ── Loading ──
  if (loadingCategories || loadingProduct) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p style={{ marginTop: 10, color: "#6b7280", fontSize: 14 }}>Loading product…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5",  fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", background: "#fff", borderRadius: 14, boxShadow: "0 1px 12px rgba(0,0,0,.07)", overflow: "hidden" }}>

        {/* ── Header ── */}
        <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate("/products")}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", flexShrink: 0, transition: "all .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a1f2e", letterSpacing: "-0.2px" }}>
            Edit Product
          </h2>
        </div>
        <hr style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }} />

        {/* ── Body ── */}
        <div style={{ padding: "24px" }}>

          {/* Alerts */}
          {error && (
            <div style={{ marginBottom: 18, borderRadius: 8, padding: "10px 14px", background: "#fff5f5", border: "1px solid #fecaca", color: "#c0392b", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginBottom: 18, borderRadius: 8, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckIcon /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{  width: '100%', margin: "0 auto" }}>

              {/* ── Product Name ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Product Name</label>
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  style={{ ...inputStyle, ...focusStyle("name") }}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                />
              </div>

              {/* ── Price & Discount ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Price (₹)</label>
                  <input
                    type="number" name="price" value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    style={{ ...inputStyle, ...focusStyle("price") }}
                    onFocus={() => setFocusedField("price")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Discount %</label>
                  <input
                    type="number" name="discountPercentage" value={formData.discountPercentage}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0" max="100"
                    style={{ ...inputStyle, ...focusStyle("discount") }}
                    onFocus={() => setFocusedField("discount")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
              </div>

              {/* ── Category ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Category</label>
                <select
                  name="category" value={formData.category}
                  onChange={handleInputChange}
                  style={{ ...inputStyle, ...focusStyle("category"), cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 40 }}
                  onFocus={() => setFocusedField("category")}
                  onBlur={() => setFocusedField("")}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* ── Colors ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Colors</label>
                <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", background: "#fafafa" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {COLOR_OPTIONS.map((color) => {
                      const active = selectedColors.includes(color);
                      return (
                        <button
                          key={color} type="button"
                          onClick={() => handleColorToggle(color)}
                          style={{
                            padding: "5px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                            cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
                            border: `1.5px solid ${active ? "#1a1a1a" : "#e5e7eb"}`,
                            background: active ? "#1a1a1a" : "#fff",
                            color: active ? "#fff" : "#374151",
                          }}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                  {selectedColors.length > 0 && (
                    <p style={{ margin: "10px 0 0", fontSize: 12, color: "#6b7280" }}>
                      Selected: {selectedColors.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Sizes ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Sizes</label>
                <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", background: "#fafafa" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SIZE_OPTIONS.map((size) => {
                      const active = selectedSizes.includes(size);
                      return (
                        <button
                          key={size} type="button"
                          onClick={() => handleSizeToggle(size)}
                          style={{
                            minWidth: 52, height: 40, padding: "0 10px", borderRadius: 8,
                            fontSize: 13, fontWeight: 700, cursor: "pointer",
                            fontFamily: "inherit", transition: "all .15s",
                            border: `1.5px solid ${active ? "#1a1a1a" : "#e5e7eb"}`,
                            background: active ? "#1a1a1a" : "#fff",
                            color: active ? "#fff" : "#374151",
                            textTransform: "uppercase",
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSizes.length > 0 && (
                    <p style={{ margin: "10px 0 0", fontSize: 12, color: "#6b7280" }}>
                      Selected: {selectedSizes.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Specification ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Specification</label>
                <textarea
                  name="specification" value={formData.specification}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter product specifications…"
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, ...focusStyle("specification") }}
                  onFocus={() => setFocusedField("specification")}
                  onBlur={() => setFocusedField("")}
                />
              </div>

              {/* ── Description ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Description</label>
                <textarea
                  name="description" value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter product description…"
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, ...focusStyle("description") }}
                  onFocus={() => setFocusedField("description")}
                  onBlur={() => setFocusedField("")}
                />
              </div>

              {/* ── Existing Images ── */}
              {existingImages.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={labelStyle}>Current Images</label>
                    {imagesToDelete.length > 0 && (
                      <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 500 }}>
                        {imagesToDelete.length} image{imagesToDelete.length > 1 ? "s" : ""} will be deleted
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {existingImages.map((url, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img
                          src={`${API_BASE_URL}${url}`}
                          alt={`product ${idx}`}
                          style={{
                            width: 80, height: 80, objectFit: "cover", borderRadius: 8,
                            border: replaceMap[idx] ? "2px solid #1a1a1a" : "1.5px solid #e5e7eb",
                            display: "block",
                          }}
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/80x80?text=Error"; }}
                        />

                        {/* Replace badge */}
                        {replaceMap[idx] && (
                          <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "center", padding: "2px 0", borderRadius: "0 0 7px 7px" }}>
                            replaced
                          </span>
                        )}

                        {/* Action buttons */}
                        <div style={{ position: "absolute", top: -6, right: -6, display: "flex", gap: 3 }}>
                          {/* Replace */}
                          <label
                            title="Replace image"
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "#1a1a1a", cursor: "pointer" }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
                              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                            </svg>
                            <input type="file" accept="image/*" style={{ display: "none" }}
                              onChange={(e) => { const file = e.target.files[0]; if (file) replaceImage(idx, file); }}
                            />
                          </label>

                          {/* Delete */}
                          <button
                            type="button"
                            title="Delete image"
                            onClick={() => markImageForDeletion(idx)}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "none", cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 700, lineHeight: 1 }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={fieldDesc}>Click × to delete · Click ↺ to replace an existing image</p>
                </div>
              )}

              {/* ── Add More Images ── */}
              <div style={{ marginBottom: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={labelStyle}>Add More Images</label>
                  <span style={{ fontSize: 12.5, color: "#9ca3af" }}>{totalImages}/5</span>
                </div>

                <label
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    border: `1.5px ${newImages.length > 0 ? "solid #1a1a1a" : "dashed #d1d5db"}`,
                    borderRadius: 10, padding: "13px 16px",
                    cursor: totalImages >= 5 ? "not-allowed" : "pointer",
                    background: newImages.length > 0 ? "#f9f9f9" : "#fafafa",
                    transition: "all .15s", opacity: totalImages >= 5 ? 0.5 : 1,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={newImages.length > 0 ? "#1a1a1a" : "#9ca3af"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M9 12l3-3 3 3" /><line x1="12" y1="9" x2="12" y2="16" />
                  </svg>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13.5, color: totalImages >= 5 ? "#9ca3af" : "#6b7280" }}>
                      {totalImages >= 5 ? "Maximum 5 images reached" : "Click to add more images"}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>PNG, JPG, WEBP</p>
                  </div>
                  <input
                    type="file" accept="image/*" multiple
                    onChange={handleAddImages}
                    disabled={totalImages >= 5}
                    style={{ display: "none" }}
                  />
                </label>

                {/* New image previews */}
                {newImages.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                    {newImages.map((file, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`new ${idx}`}
                          style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1.5px solid #1a1a1a", display: "block" }}
                        />
                        <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "center", padding: "2px 0", borderRadius: "0 0 7px 7px" }}>
                          new
                        </span>
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", lineHeight: 1 }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </form>
        </div>

        {/* ── Footer ── */}
        <hr style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }} />
        <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ padding: "9px 22px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#6b7280", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#d1d5db"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: "9px 26px", border: "none", borderRadius: 8,
              background: submitting ? "#555" : "#1a1a1a", color: "#fff",
              fontSize: 13.5, fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "background .15s",
              display: "flex", alignItems: "center", gap: 8,
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "#333"; }}
            onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = "#1a1a1a"; }}
          >
            {submitting ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Updating…
              </>
            ) : "Update Product"}
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 1; }
      `}</style>
    </div>
  );
};

export default EditProduct;