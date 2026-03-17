import React, { useState, useEffect, useMemo } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const BANNER_API_URL = `${API_BASE_URL}/banner`;

const ITEMS_PER_PAGE = 8;

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewBanner, setViewBanner] = useState(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch(BANNER_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

  const handleEdit = (banner) => navigate(`/edit-banner/${banner._id}`);
  const handleView = (banner) => setViewBanner(banner);
  const handleCloseModal = () => setViewBanner(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`${BANNER_API_URL}/${id}`, { method: "DELETE" });
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) result = await response.json();
      if (!response.ok) throw new Error(result?.message || `HTTP error ${response.status}`);
      if (result && !result.success) throw new Error(result.message || "Delete failed");
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(`Failed to delete banner: ${err.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return banners;
    return banners.filter((b) =>
      b._id.toLowerCase().includes(q) ||
      formatDate(b.createdAt).toLowerCase().includes(q)
    );
  }, [banners, search]);

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

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p style={{ marginTop: 10, color: "#6b7280", fontSize: 14 }}>Loading banners…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <div style={{ borderRadius: 8, padding: "10px 14px", background: "#fff5f5", border: "1px solid #fecaca", color: "#c0392b", fontSize: 13 }}>
          Error loading banners: {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh",   fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* ─────────── VIEW MODAL ─────────── */}
      {viewBanner && (
        <div
          onClick={handleCloseModal}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(5px)",
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
            <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a1a" }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1f2e" }}>Banner Details</h3>
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

            <div style={{ padding: "20px", overflowY: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px" }}>Desktop Image</p>
                  <img
                    src={`${API_BASE_URL}${viewBanner.imageUrl}`}
                    alt="Desktop banner"
                    style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, border: "1.5px solid #e5e7eb", display: "block" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/340x160?text=Not+Found"; }}
                  />
                </div>
                {viewBanner.mobileImageUrl && (
                  <div>
                    <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px" }}>Mobile Image</p>
                    <img
                      src={`${API_BASE_URL}${viewBanner.mobileImageUrl}`}
                      alt="Mobile banner"
                      style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, border: "1.5px solid #e5e7eb", display: "block" }}
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/340x160?text=Not+Found"; }}
                    />
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, background: "#f9fafb", borderRadius: 10, padding: "14px 16px", border: "1.5px solid #e5e7eb" }}>
                {[
                  { label: "Added", value: formatDate(viewBanner.createdAt) },
                  ...(viewBanner.updatedAt !== viewBanner.createdAt ? [{ label: "Last Updated", value: formatDate(viewBanner.updatedAt) }] : []),
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px" }}>{item.label}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 13, color: "#374151", fontWeight: 500, wordBreak: "break-all" }}>{item.value}</p>
                  </div>
                ))}
              </div>
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
                onClick={() => { handleCloseModal(); handleEdit(viewBanner); }}
                style={{ padding: "9px 22px", border: "none", borderRadius: 8, background: "#1a1a1a", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background .15s", display: "flex", alignItems: "center", gap: 7 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a1a"; }}
              >
                <FaEdit size={13} /> Edit Banner
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
                Banner Management
              </h2>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "#9ca3af" }}>
                {filtered.length} banner{filtered.length !== 1 ? "s" : ""} total
              </p>
            </div>
            <button
              onClick={() => navigate("/add-banner")}
              style={{ padding: "9px 18px", border: "none", borderRadius: 8, background: "#1a1a1a", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "background .15s", display: "flex", alignItems: "center", gap: 6 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#333"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a1a"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Banner
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
                placeholder="Search by ID or date…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 36px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13.5, color: "#374151", background: "#fafafa", outline: "none", fontFamily: "inherit", transition: "border-color .15s" }}
                onFocus={(e) => { e.target.style.borderColor = "#1a1a1a"; e.target.style.background = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
              />
            </div>

            {/* Toggle */}
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
            No banners match your search.
          </div>
        ) : viewMode === "table" ? (

          /* ── TABLE ── */
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  {["#", "Desktop Preview", "Mobile Preview", "Added", "Updated", "Actions"].map((col) => (
                    <th key={col} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((banner, idx) => (
                  <tr
                    key={banner._id}
                    style={{ borderBottom: "1px solid #f3f4f6", transition: "background .1s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#fafafa"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "12px 16px", color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <img
                        src={`${API_BASE_URL}${banner.imageUrl}`}
                        alt="desktop"
                        style={{ width: 90, height: 52, objectFit: "cover", borderRadius: 7, border: "1.5px solid #e5e7eb", display: "block" }}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/90x52?text=N/A"; }}
                      />
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {banner.mobileImageUrl ? (
                        <img
                          src={`${API_BASE_URL}${banner.mobileImageUrl}`}
                          alt="mobile"
                          style={{ width: 90, height: 52, objectFit: "cover", borderRadius: 7, border: "1.5px solid #e5e7eb", display: "block" }}
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/90x52?text=N/A"; }}
                        />
                      ) : (
                        <span style={{ fontSize: 13, color: "#d1d5db" }}>—</span>
                      )}
                    </td>
                    
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151", whiteSpace: "nowrap" }}>
                      {formatDate(banner.createdAt)}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#9ca3af", whiteSpace: "nowrap" }}>
                      {banner.updatedAt !== banner.createdAt ? formatDate(banner.updatedAt) : <span style={{ color: "#d1d5db" }}>—</span>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => handleView(banner)} title="View" style={iconBtn()}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#1a1a1a"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}>
                          <FaEye size={13} />
                        </button>
                        <button onClick={() => handleEdit(banner)} title="Edit" style={iconBtn()}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#1a1a1a"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}>
                          <FaEdit size={13} />
                        </button>
                        <button onClick={() => handleDelete(banner._id)} title="Delete" disabled={deleteLoading} style={iconBtn(true)}
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
          <div style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {paginated.map((banner) => (
              <div
                key={banner._id}
                style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 14, overflow: "hidden", transition: "box-shadow .15s, border-color .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,.09)"; e.currentTarget.style.borderColor = "#d1d5db"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e5e7eb"; }}
              >
                <div style={{ position: "relative", height: 175, background: "#f3f4f6" }}>
                  <img
                    src={`${API_BASE_URL}${banner.imageUrl}`}
                    alt={`Banner ${banner._id}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/400x175?text=Not+Found"; }}
                  />
                  {banner.mobileImageUrl && (
                    <span style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,.6)", color: "#fff", fontSize: 11, fontWeight: 500, padding: "3px 9px", borderRadius: 6 }}>
                      Mobile available
                    </span>
                  )}
                </div>
                <div style={{ padding: "13px 15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, color: "#374151", fontWeight: 500 }}>Added: {formatDate(banner.createdAt)}</p>
                    {banner.updatedAt !== banner.createdAt && (
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>Updated: {formatDate(banner.updatedAt)}</p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => handleView(banner)} title="View" style={iconBtn()}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#1a1a1a"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}>
                      <FaEye size={13} />
                    </button>
                    <button onClick={() => handleEdit(banner)} title="Edit" style={iconBtn()}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; e.currentTarget.style.color = "#1a1a1a"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}>
                      <FaEdit size={13} />
                    </button>
                    <button onClick={() => handleDelete(banner._id)} title="Delete" disabled={deleteLoading} style={iconBtn(true)}
                      onMouseEnter={(e) => { if (!deleteLoading) { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#ef4444"; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#f87171"; }}>
                      <FaTrash size={13} />
                    </button>
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

export default BannerList;