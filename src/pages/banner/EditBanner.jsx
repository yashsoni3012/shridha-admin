import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api-shridha.houseofresha.com';
const BANNER_API_URL = `${API_BASE_URL}/banner`;

const EditBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [existingDesktopUrl, setExistingDesktopUrl] = useState('');
  const [existingMobileUrl, setExistingMobileUrl] = useState('');

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BANNER_API_URL}/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch banner (status ${response.status})`);
        const result = await response.json();
        if (result.success && result.data) {
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
    if (id) fetchBanner();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    if (desktopImage) formData.append('imageUrl', desktopImage);
    if (mobileImage) formData.append('mobileImageUrl', mobileImage);

    if (formData.entries().next().done) {
      setError('No changes detected. Please select new images or cancel.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${BANNER_API_URL}/${id}`, {
        method: 'PATCH',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `HTTP error ${response.status}`);
      if (result.success) {
        setSuccess('Banner updated successfully!');
        setTimeout(() => navigate('/banners'), 2000);
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Icons ──
  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const UploadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 12l3-3 3 3" />
      <line x1="12" y1="9" x2="12" y2="16" />
    </svg>
  );

  // ── Upload field with current image preview ──
  const UploadField = ({ label, fieldKey, file, existingUrl, onChange }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', marginBottom: 6, fontSize: 15, fontWeight: 600, color: '#374151' }}>
        {label}
      </label>

      {/* Current image preview */}
      {existingUrl && (
        <div style={{ marginBottom: 8 }}>
          <p style={{ margin: '0 0 5px', fontSize: 13, color: '#9ca3af', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Current
          </p>
          <img
            src={`${API_BASE_URL}${existingUrl}`}
            alt={`Current ${fieldKey}`}
            style={{
              height: 80,
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'cover',
              borderRadius: 8,
              border: '1.5px solid #e5e7eb',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/200x80?text=Preview+Error';
            }}
          />
        </div>
      )}

      {/* Upload zone */}
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: `1.5px ${file ? 'solid #1a1a1a' : 'dashed #d1d5db'}`,
          borderRadius: 10,
          padding: '12px 14px',
          cursor: 'pointer',
          background: file ? '#f9f9f9' : '#fafafa',
          transition: 'all .15s',
        }}
      >
        <span style={{ color: file ? '#1a1a1a' : '#9ca3af', flexShrink: 0 }}>
          <UploadIcon />
        </span>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={{ margin: 0, fontSize: 15, color: file ? '#1a1a1a' : '#6b7280', fontWeight: file ? 500 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {file ? file.name : `Click to replace ${fieldKey === 'desktop' ? 'desktop' : 'mobile'} image (optional)`}
          </p>
          {!file && <p style={{ margin: '2px 0 0', fontSize: 13, color: '#9ca3af' }}>PNG, JPG, WEBP up to 10MB</p>}
        </div>
        {file && (
          <span style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 20, height: 20, borderRadius: '50%',
            background: '#1a1a1a', color: '#fff', flexShrink: 0,
          }}>
            <CheckIcon />
          </span>
        )}
        <input type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
      </label>

    </div>
  );

  // ── Loading state ──
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#f0f2f5',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p style={{ marginTop: 10, color: '#6b7280', fontSize: 14 }}>Loading banner…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f2f5',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      {/* max-w-7xl card */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: 14,
        boxShadow: '0 1px 12px rgba(0,0,0,.07)',
        overflow: 'hidden',
      }}>

        {/* ── Header ── */}
        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate('/banners')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 34, height: 34, borderRadius: 8,
              border: '1.5px solid #e5e7eb',
              background: '#fff', cursor: 'pointer',
              flexShrink: 0, transition: 'all .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1a1f2e', letterSpacing: '-0.2px' }}>
            Edit Banner
          </h2>
        </div>

        {/* Divider below header */}
        <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />

        {/* ── Body ── */}
        <div style={{ padding: '24px 24px 20px' }}>

          {/* Alerts */}
          {error && (
            <div style={{
              marginBottom: 16, borderRadius: 8, padding: '10px 14px',
              background: '#fff5f5', border: '1px solid #fecaca',
              color: '#c0392b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              marginBottom: 16, borderRadius: 8, padding: '10px 14px',
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#15803d', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <CheckIcon /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Fields — centered narrow column */}
            <div style={{ width: "100%", margin: '0 auto' }}>

              <UploadField
                label="Desktop Image (imageUrl)"
                fieldKey="desktop"
                file={desktopImage}
                existingUrl={existingDesktopUrl}
                onChange={(e) => setDesktopImage(e.target.files[0] || null)}
              />

              <UploadField
                label="Mobile Image (mobileImageUrl)"
                fieldKey="mobile"
                file={mobileImage}
                existingUrl={existingMobileUrl}
                onChange={(e) => setMobileImage(e.target.files[0] || null)}
              />

            </div>
          </form>
        </div>

        {/* ── Footer ── */}
        <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />
        <div style={{
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Cancel — left */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '9px 22px',
              border: '1.5px solid #e5e7eb',
              borderRadius: 8,
              background: '#fff',
              color: '#6b7280',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#d1d5db'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
          >
            Cancel
          </button>

          {/* Update Banner — right, black */}
          <button
            type="submit"
            disabled={submitting}
            onClick={handleSubmit}
            style={{
              padding: '9px 26px',
              border: 'none',
              borderRadius: 8,
              background: submitting ? '#555' : '#1a1a1a',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'background .15s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#333'; }}
            onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.background = '#1a1a1a'; }}
          >
            {submitting ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Updating…
              </>
            ) : 'Update Banner'}
          </button>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default EditBanner;