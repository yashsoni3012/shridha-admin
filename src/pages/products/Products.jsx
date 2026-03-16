import React, { useState, useEffect, useMemo } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const PRODUCT_API_URL = `${API_BASE_URL}/product`;

const ITEMS_PER_PAGE = 8;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleEdit = (product) => navigate(`/edit-product/${product._id}`);
  const handleView = (product) => setViewProduct(product);
  const handleCloseModal = () => setViewProduct(null);
  const handleAddProduct = () => navigate("/add-product");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`${PRODUCT_API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  const getThumb = (product) =>
    product.images && product.images.length > 0
      ? `${API_BASE_URL}${product.images[0]}`
      : "https://via.placeholder.com/400x200?text=No+Image";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p._id || "").toLowerCase().includes(q) ||
        String(p.price || "").includes(q)
    );
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [search]);

  const iconBtn = (danger = false) => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 32, height: 32, borderRadius: 7,
    border: `1.5px solid ${danger ? "#fee2e2" : "#e5e7eb"}`,
    background: "#fff",
    cursor: deleteLoading ? "not-allowed" : "pointer",
    color: danger ? "#f87171" : "#6b7280",
    transition: "all .15s",
    flexShrink: 0,
  });

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p style={{ marginTop: 10, color: "#6b7280", fontSize: 14 }}>Loading products…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <div style={{ borderRadius: 8, padding: "10px 14px", background: "#fff5f5", border: "1px solid #fecaca", color: "#c0392b", fontSize: 13 }}>
          Error loading products: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "24px 16px", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ─────────── VIEW MODAL ─────────── */}
      {viewProduct && (
        <div
          onClick={handleCloseModal}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(7px)",
            WebkitBackdropFilter: "blur(7px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
            animation: "fadeIn .2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 16, width: "100%", maxWidth: 700,
              boxShadow: "0 24px 60px rgba(0,0,0,.22)",
              overflow: "hidden", animation: "slideUp .22s ease",
              maxHeight: "90vh", display: "flex", flexDirection: "column",
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a1a" }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1f2e" }}>Product Details</h3>
              </div>
              <button
                onClick={handleCloseModal}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", color: "#6b7280", transition: "all .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#1a1a1a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <hr style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }} />

            {/* Modal Body */}
            <div style={{ padding: "20px", overflowY: "auto" }}>

              {/* Images row */}
              {viewProduct.images && viewProduct.images.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    Images ({viewProduct.images.length})
                  </p>
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                    {viewProduct.images.map((img, i) => (
                      <img
                        key={i}
                        src={`${API_BASE_URL}${img}`}
                        alt={`Product image ${i + 1}`}
                        style={{ width: 140, height: 100, objectFit: "cover", borderRadius: 10, border: "1.5px solid #e5e7eb", flexShrink: 0 }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/140x100?text=Error"; }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Product info grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: "#f9fafb", borderRadius: 10, padding: "14px 16px", border: "1.5px solid #e5e7eb", marginBottom: 12 }}>
                {[
                  { label: "Product Name", value: viewProduct.name || "—" },
                  { label: "Price", value: viewProduct.price ? `₹${viewProduct.price}` : "—" },
                  { label: "Discount", value: viewProduct.discountPercentage > 0 ? `${viewProduct.discountPercentage}% off` : "No discount" },
                  { label: "Added", value: formatDate(viewProduct.createdAt) },
                  ...(viewProduct.updatedAt !== viewProduct.createdAt ? [{ label: "Last Updated", value: formatDate(viewProduct.updatedAt) }] : []),
                  { label: "Product ID", value: viewProduct._id },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px" }}>{item.label}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 13, color: "#374151", fontWeight: 500, wordBreak: "break-all" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Description if available */}
              {viewProduct.description && (
                <div style={{ background: "#f9fafb", borderRadius: 10, padding: "14px 16px", border: "1.5px solid #e5e7eb" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px" }}>Description</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{viewProduct.description}</p>
                </div>
              )}
            </div>

            <hr style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }} />
            <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <button
                onClick={handleCloseModal}
                style={{ padding: "9px 22px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#6b7280", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
              >
                Close
              </button>
              <button
                onClick={() => { handleCloseModal(); handleEdit(viewProduct); }}
                style={{ padding: "9px 22px", border: "none", borderRadius: 8, background: "#1a1a1a", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background .15s", display: "flex", alignItems: "center", gap: 7 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a1a"; }}
              >
                <FaEdit size={13} /> Edit Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────── MAIN CARD ─────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", background: "#fff", borderRadius: 14, boxShadow: "0 1px 12px rgba(0,0,0,.07)", overflow: "hidden" }}>

        {/* ── Header ── */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1a1f2e", letterSpacing: "-0.3px" }}>
                Product Management
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "#9ca3af" }}>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} total
              </p>
            </div>
            <button
              onClick={handleAddProduct}
              style={{ padding: "9px 18px", border: "none", borderRadius: 8, background: "#1a1a1a", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background .15s", display: "flex", alignItems: "center", gap: 6 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a1a"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Product
            </button>
          </div>

          {/* Search + Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, ID or price…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 36px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13.5, color: "#374151", background: "#fafafa", outline: "none", fontFamily: "inherit", transition: "border-color .15s" }}
                onFocus={(e) => { e.target.style.borderColor = "#1a1a1a"; e.target.style.background = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
              />
            </div>

            {/* View toggle */}
            <div style={{ display: "flex", border: "1.5px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
              {[
                {
                  mode: "table",
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="3" y1="15" x2="21" y2="15" />
                      <line x1="9" y1="9" x2="9" y2="21" />
                    </svg>
                  ),
                },
                {
                  mode: "grid",
                  icon: (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  ),
                },
              ].map(({ mode, icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, border: "none", cursor: "pointer", background: viewMode === mode ? "#1a1a1a" : "#fff", color: viewMode === mode ? "#fff" : "#6b7280", transition: "all .15s" }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        {paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af", fontSize: 15 }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px", display: "block" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            No products match your search.
          </div>
        ) : viewMode === "table" ? (

          /* ── TABLE ── */
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {["#", "Image", "Name", "Price", "Discount", "Added", "Actions"].map((col) => (
                    <th key={col} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((product, idx) => (
                  <tr
                    key={product._id}
                    style={{ borderBottom: "1px solid #f3f4f6", transition: "background .1s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    {/* # */}
                    <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>

                    {/* Image */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={getThumb(product)}
                          alt={product.name}
                          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1.5px solid #e5e7eb", display: "block" }}
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/56x56?text=N/A"; }}
                        />
                        {product.images && product.images.length > 1 && (
                          <span style={{ position: "absolute", bottom: -4, right: -4, background: "#1a1a1a", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 5px" }}>
                            +{product.images.length - 1}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td style={{ padding: "12px 16px", fontSize: 13.5, color: "#1a1f2e", fontWeight: 600, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {product.name || "—"}
                    </td>

                    {/* Price */}
                    <td style={{ padding: "12px 16px", fontSize: 13.5, color: "#374151", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {product.price ? `₹${product.price}` : "—"}
                    </td>

                    {/* Discount */}
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      {product.discountPercentage > 0 ? (
                        <span style={{ display: "inline-flex", alignItems: "center", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: 12, fontWeight: 600, borderRadius: 6, padding: "3px 8px" }}>
                          {product.discountPercentage}% off
                        </span>
                      ) : (
                        <span style={{ color: "#d1d5db", fontSize: 13 }}>—</span>
                      )}
                    </td>

                    {/* Added */}
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>
                      {formatDate(product.createdAt)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => handleView(product)} title="View" style={iconBtn()}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#1a1a1a"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}>
                          <FaEye size={13} />
                        </button>
                        <button onClick={() => handleEdit(product)} title="Edit" style={iconBtn()}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#1a1a1a"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}>
                          <FaEdit size={13} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} title="Delete" disabled={deleteLoading} style={iconBtn(true)}
                          onMouseEnter={(e) => { if (!deleteLoading) { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#ef4444"; } }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#f87171"; }}>
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        ) : (

          /* ── GRID ── */
          <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
            {paginated.map((product) => (
              <div
                key={product._id}
                style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 14, overflow: "hidden", transition: "box-shadow .15s, border-color .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,.09)"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 175, background: "#f3f4f6" }}>
                  <img
                    src={getThumb(product)}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x175?text=Not+Found"; }}
                  />
                  {product.images && product.images.length > 1 && (
                    <span style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,.6)", color: "#fff", fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 6 }}>
                      +{product.images.length - 1} more
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span style={{ position: "absolute", top: 8, right: 8, background: "#15803d", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6 }}>
                      {product.discountPercentage}% off
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: "13px 15px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 14.5, fontWeight: 700, color: "#1a1f2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {product.name || "Unnamed Product"}
                  </p>
                  <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, color: "#374151" }}>
                    {product.price ? `₹${product.price}` : "—"}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                      {formatDate(product.createdAt)}
                    </p>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleView(product)} title="View" style={iconBtn()}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#1a1a1a"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}>
                        <FaEye size={13} />
                      </button>
                      <button onClick={() => handleEdit(product)} title="Edit" style={iconBtn()}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#1a1a1a"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}>
                        <FaEdit size={13} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} title="Delete" disabled={deleteLoading} style={iconBtn(true)}
                        onMouseEnter={(e) => { if (!deleteLoading) { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#ef4444"; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#f87171"; }}>
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <>
            <hr style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }} />
            <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div style={{ display: "flex", gap: 5 }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer", color: currentPage === 1 ? "#d1d5db" : "#374151", transition: "all .15s" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === "..." ? (
                      <span key={`dots-${i}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, color: "#9ca3af", fontSize: 13 }}>…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${currentPage === item ? "#1a1a1a" : "#e5e7eb"}`, background: currentPage === item ? "#1a1a1a" : "#fff", color: currentPage === item ? "#fff" : "#374151", fontSize: 13.5, fontWeight: currentPage === item ? 700 : 500, cursor: "pointer", transition: "all .15s" }}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer", color: currentPage === totalPages ? "#d1d5db" : "#374151", transition: "all .15s" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ProductList;