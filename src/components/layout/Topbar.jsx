import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, ChevronDown, X, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../lib/utils';

/* ─── close on outside click ─── */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function Topbar() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState('');
  const [focused,    setFocused]    = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const [bellOpen,   setBellOpen]   = useState(false);

  const dropRef   = useRef(null);
  const bellRef   = useRef(null);
  const searchRef = useRef(null);
  const inputRef  = useRef(null);

  useClickOutside(dropRef,   () => setDropOpen(false));
  useClickOutside(bellRef,   () => setBellOpen(false));
  useClickOutside(searchRef, () => { setSearchOpen(false); setSearchVal(''); setFocused(false); });

  /* auto-focus input when search expands */
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [searchOpen]);

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/dashboard'))  return 'Dashboard';
    if (p.includes('/users'))      return 'Users';
    if (p.includes('/banners'))    return 'Banners';
    if (p.includes('/products'))   return 'Products';
    if (p.includes('/categories')) return 'Categories';
    return 'Dashboard';
  };

  const notifications = [
    { id: 1, title: 'New user registered', sub: '2 minutes ago',  dot: '#60A5FA' },
    { id: 2, title: 'Banner updated',      sub: '15 minutes ago', dot: '#34d399' },
    { id: 3, title: 'Product stock low',   sub: '1 hour ago',     dot: '#f97316' },
  ];

  /* ── shared icon-button style ── */
  const iconBtn = (active) => ({
    width: 36, height: 36, borderRadius: 10,
    background: active ? '#1a2744' : '#161616',
    border: `1.5px solid ${active ? '#3b82f6' : '#1f2937'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: active ? '#60A5FA' : '#9ca3af',
    cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
    outline: 'none',
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes bellRing {
          0%,100% { transform:rotate(0) }
          20%     { transform:rotate(-14deg) }
          40%     { transform:rotate(14deg)  }
          60%     { transform:rotate(-8deg)  }
          80%     { transform:rotate(6deg)   }
        }
        @keyframes dropIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }

        /* ── Inline search expand (width + opacity) ── */
        @keyframes searchExpand {
          from { opacity:0; max-width:0; }
          to   { opacity:1; max-width:360px; }
        }
        @keyframes searchCollapse {
          from { opacity:1; max-width:360px; }
          to   { opacity:0; max-width:0; }
        }

        .tb-bell:hover svg { animation: bellRing 0.5s ease; }
        .tb-drop   { animation: dropIn 0.18s ease; }
        .tb-notif  { animation: dropIn 0.18s ease; }

        .tb-input { outline:none; background:transparent; width:100%; border:none; }
        .tb-input::placeholder { color:#6b7280; }

        .search-pill {
          display:flex; align-items:center; gap:8px;
          padding:0 14px;
          height:36px;
          border-radius:10px;
          background:#1a1a2e;
          border:1.5px solid #3b82f6;
          box-shadow: 0 0 0 3px rgba(96,165,250,0.12);
          overflow:hidden;
          animation: searchExpand 0.26s cubic-bezier(0.34,1.26,0.64,1) forwards;
          max-width:360px;
        }

        .notif-scroll::-webkit-scrollbar { width:4px; }
        .notif-scroll::-webkit-scrollbar-track { background:transparent; }
        .notif-scroll::-webkit-scrollbar-thumb { background:#374151; border-radius:4px; }

        /* Responsive helpers */
        @media (max-width:639px) {
          .hide-xs { display:none !important; }
        }
        @media (max-width:767px) {
          .hide-mobile { display:none !important; }
        }
        @media (min-width:768px) {
          .show-mobile-only { display:none !important; }
        }
        @media (min-width:640px) {
          .show-xs-only { display:none !important; }
        }
      `}</style>

      <header style={{
        height: 64,
        flexShrink: 0,
        background: '#0e0e0e',
        borderBottom: '1px solid #1f2937',
        display: 'flex',
        alignItems: 'center',
        padding: '0 clamp(16px, 4vw, 32px)',
        gap: 8,
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
        boxSizing: 'border-box',
        width: '100%',
      }}>

        {/* ── Mobile hamburger spacer (sidebar toggle lives here in layout) ── */}
        <div className="show-mobile-only" style={{ width: 40, flexShrink: 0 }} />

        {/* ── Page title — hides when search is open on small screens ── */}
        {!searchOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flexShrink: 0 }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: '#F9FAFB',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              margin: 0,
            }}>
              {getPageTitle()}
            </h1>
            <span className="hide-xs" style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: '#4b5563',
              whiteSpace: 'nowrap',
            }}>
            </span>
          </div>
        )}

        {/* ── Spacer ── */}
        <div style={{ flex: 1, minWidth: 0 }} />

        {/* ══════════ RIGHT SECTION ══════════ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

          {/* ── Inline Search pill (expands in topbar) ── */}
          {searchOpen ? (
            <div ref={searchRef} className="search-pill">
              <Search size={14} color="#60A5FA" style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                className="tb-input"
                type="text"
                placeholder="Search anything…"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: '#E5E7EB',
                  minWidth: 0,
                  flex: 1,
                  /* clamp width on small screens */
                  width: 'min(220px, 40vw)',
                }}
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchVal(''); }}
                style={{ color: '#6b7280', display: 'flex', cursor: 'pointer', background: 'none', border: 'none', padding: 0, flexShrink: 0 }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            /* ── Search icon button ── */
            <button
              onClick={() => setSearchOpen(true)}
              style={iconBtn(false)}
              aria-label="Open search"
            >
              <Search size={15} />
            </button>
          )}

          {/* ── Bell ── */}
          <div style={{ position: 'relative' }} ref={bellRef}>
            <button
              className="tb-bell"
              onClick={() => setBellOpen(v => !v)}
              style={{ ...iconBtn(bellOpen), position: 'relative' }}
              aria-label="Notifications"
            >
              <Bell size={15} />
              <span style={{
                position: 'absolute', top: 7, right: 7,
                width: 8, height: 8, borderRadius: '50%',
                background: 'linear-gradient(135deg,#60A5FA,#3b82f6)',
                border: '2px solid #0e0e0e',
                boxShadow: '0 0 6px rgba(96,165,250,0.7)',
              }} />
            </button>

            {bellOpen && (
              <div className="tb-notif" style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: 'min(300px, 90vw)',
                background: '#111827',
                border: '1px solid #1f2937',
                borderRadius: 14,
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                zIndex: 99,
              }}>
                <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#F9FAFB' }}>Notifications</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#60A5FA', cursor: 'pointer' }}>Mark all read</span>
                </div>
                <div className="notif-scroll" style={{ maxHeight: 220, overflowY: 'auto' }}>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 16px', borderBottom: '1px solid #1a1a1a', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.dot, flexShrink: 0, marginTop: 5, boxShadow: `0 0 6px ${n.dot}` }} />
                      <div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#E5E7EB', margin: 0, lineHeight: 1.4 }}>{n.title}</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6b7280', margin: '3px 0 0', lineHeight: 1 }}>{n.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '10px 16px', textAlign: 'center' }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#60A5FA', cursor: 'pointer' }}>View all notifications →</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Divider (hidden on xs) ── */}
          <div className="hide-xs" style={{ width: 1, height: 24, background: '#1f2937', margin: '0 2px', flexShrink: 0 }} />

          {/* ── User pill ── */}
          <div style={{ position: 'relative' }} ref={dropRef}>
            <button
              onClick={() => setDropOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '5px 8px 5px 5px',
                borderRadius: 12,
                background: dropOpen ? '#1a2744' : '#161616',
                border: `1.5px solid ${dropOpen ? '#3b82f6' : '#1f2937'}`,
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                boxShadow: dropOpen ? '0 4px 20px rgba(96,165,250,0.12)' : 'none',
                flexShrink: 0,
                outline: 'none',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#60A5FA 0%,#2563eb 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Syne', sans-serif",
                fontSize: 11, fontWeight: 700, color: 'white',
                boxShadow: '0 2px 10px rgba(96,165,250,0.4)',
              }}>
                {getInitials(user?.name)}
              </div>

              {/* Name + role — hidden on xs */}
              <div className="hide-xs" style={{ textAlign: 'left' }}>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, fontWeight: 600,
                  color: '#F9FAFB', whiteSpace: 'nowrap', lineHeight: 1,
                }}>
                  {user?.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e' }} />
                  <span style={{ fontFamily: "'DM Sans', monospace", fontSize: 9.5, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {user?.role}
                  </span>
                </div>
              </div>

              <ChevronDown
                size={12}
                color={dropOpen ? '#60A5FA' : '#6b7280'}
                style={{ transition: 'transform 0.2s, color 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0)' }}
              />
            </button>

            {/* User dropdown */}
            {dropOpen && (
              <div className="tb-drop" style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: 200,
                background: '#111827',
                border: '1px solid #1f2937',
                borderRadius: 14,
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                zIndex: 99,
              }}>
                <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #1f2937' }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#F9FAFB', margin: 0 }}>{user?.name}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#6b7280', margin: '3px 0 0' }}>{user?.email || 'admin@example.com'}</p>
                </div>

                {[
                  { icon: <Settings size={14} />, label: 'Settings' },
                  { icon: <LogOut size={14} />,   label: 'Sign out', danger: true },
                ].map((item, i) => (
                  <button
                    key={i}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 16px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: item.danger ? '#f87171' : '#D1D5DB',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                      transition: 'background 0.15s, color 0.15s',
                      borderBottom: i === 0 ? '1px solid #1a1a1a' : 'none',
                      outline: 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,0.08)' : '#1f2937';
                      e.currentTarget.style.color = item.danger ? '#f87171' : '#F9FAFB';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = item.danger ? '#f87171' : '#D1D5DB';
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}