import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://api-shridha.houseofresha.com';
const CATEGORY_API_URL = `${API_BASE_URL}/category`;

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${CATEGORY_API_URL}/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch category (status ${response.status})`);
        const result = await response.json();
        if (result.success && result.data) {
          const categoryData = Array.isArray(result.data) ? result.data[0] : result.data;
          setName(categoryData.name || '');
          setExistingImageUrl(categoryData.imageUrl || '');
        } else {
          throw new Error('Invalid category data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCategory();
  }, [id]);

  const handleImageChange = (e) => setImage(e.target.files[0] || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    const formData = new FormData();
    if (name.trim() !== '') formData.append('name', name.trim());
    if (image) formData.append('imageUrl', image);

    if (formData.entries().next().done) {
      setError('No changes detected. Please modify the name or select a new image.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${CATEGORY_API_URL}/${id}`, { method: 'PATCH', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `HTTP error ${response.status}`);
      if (result.success) {
        setSuccess('Category updated successfully!');
        setTimeout(() => navigate('/categories'), 2000);
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const UploadIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#1a1a1a' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 12l3-3 3 3" />
      <line x1="12" y1="9" x2="12" y2="16" />
    </svg>
  );

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p style={{ marginTop: 10, color: '#6b7280', fontSize: 14 }}>Loading category…</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px 16px', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', background: '#fff', borderRadius: 14, boxShadow: '0 1px 12px rgba(0,0,0,.07)', overflow: 'hidden' }}>

        {/* ── Header ── */}
        <div style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8, border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all .15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1a1f2e', letterSpacing: '-0.2px' }}>
            Edit Category
          </h2>
        </div>
        <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />

        {/* ── Body ── */}
        <div style={{ padding: '24px' }}>

          {/* Alerts */}
          {error && (
            <div style={{ marginBottom: 18, borderRadius: 8, padding: '10px 14px', background: '#fff5f5', border: '1px solid #fecaca', color: '#c0392b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div style={{ marginBottom: 18, borderRadius: 8, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckIcon /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ width: '100%', margin: '0 auto' }}>

              {/* ── Category Name ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13.5, fontWeight: 600, color: '#374151' }}>
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Category name"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    border: `1.5px solid ${focusedField === 'name' ? '#1a1a1a' : '#e5e7eb'}`,
                    borderRadius: 10, padding: '10px 14px',
                    fontSize: 13.5, color: '#374151',
                    background: focusedField === 'name' ? '#fff' : '#fafafa',
                    outline: 'none', fontFamily: 'inherit',
                    transition: 'border-color .15s, background .15s',
                  }}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                />
              </div>

              {/* ── Current Image Preview ── */}
              {existingImageUrl && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: 13.5, fontWeight: 600, color: '#374151' }}>
                    Current Image
                  </label>
                  <div style={{ marginBottom: 0 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Current
                    </p>
                    <img
                      src={`${API_BASE_URL}${existingImageUrl}`}
                      alt="Current category"
                      style={{ height: 90, width: 'auto', maxWidth: '100%', objectFit: 'cover', borderRadius: 8, border: '1.5px solid #e5e7eb', display: 'block' }}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/200x90?text=Preview+Error'; }}
                    />
                  </div>
                </div>
              )}

              {/* ── Replace Image ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 13.5, fontWeight: 600, color: '#374151' }}>
                  Replace Image <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>(optional)</span>
                </label>

                <label
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    border: `1.5px ${image ? 'solid #1a1a1a' : 'dashed #d1d5db'}`,
                    borderRadius: 10, padding: '13px 16px',
                    cursor: 'pointer', background: image ? '#f9f9f9' : '#fafafa',
                    transition: 'all .15s',
                  }}
                >
                  <span style={{ flexShrink: 0 }}>
                    <UploadIcon active={!!image} />
                  </span>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ margin: 0, fontSize: 13.5, color: image ? '#1a1a1a' : '#6b7280', fontWeight: image ? 500 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {image ? image.name : 'Click to replace category image'}
                    </p>
                    {!image && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9ca3af' }}>PNG, JPG, WEBP up to 10MB</p>}
                  </div>
                  {image && (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', background: '#1a1a1a', color: '#fff', flexShrink: 0 }}>
                      <CheckIcon />
                    </span>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              </div>

            </div>
          </form>
        </div>

        {/* ── Footer ── */}
        <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e5e7eb' }} />
        <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ padding: '9px 22px', border: '1.5px solid #e5e7eb', borderRadius: 8, background: '#fff', color: '#6b7280', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#d1d5db'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '9px 26px', border: 'none', borderRadius: 8,
              background: submitting ? '#555' : '#1a1a1a', color: '#fff',
              fontSize: 13.5, fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'background .15s',
              display: 'flex', alignItems: 'center', gap: 8,
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
            ) : 'Update Category'}
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

export default EditCategory;