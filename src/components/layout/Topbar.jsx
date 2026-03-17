// import { useState } from 'react'
// import { Bell, Search, ChevronDown } from 'lucide-react'
// import { useAuthStore } from '../../store/authStore'
// import { getInitials } from '../../lib/utils'

// export default function Topbar() {
//   const user = useAuthStore((s) => s.user)
//   const [focused, setFocused]   = useState(false)
//   const [bellHov, setBellHov]   = useState(false)
//   const [userHov, setUserHov]   = useState(false)

//   return (
//     <>
//       <style>{`
//         @keyframes bellRing {
//           0%,100% { transform: rotate(0deg); }
//           20%      { transform: rotate(-15deg); }
//           40%      { transform: rotate(15deg); }
//           60%      { transform: rotate(-10deg); }
//           80%      { transform: rotate(8deg); }
//         }
//         .bell-btn:hover svg { animation: bellRing 0.5s ease; }
//         .topbar-input { outline: none; }
//         .topbar-input::placeholder { color: #94a3b8; }
//       `}</style>

//       <header style={{
//         height: 64, flexShrink: 0,
//         background: 'rgba(255,255,255,0.96)',
//         backdropFilter: 'blur(20px)',
//         borderBottom: '1px solid rgba(0,0,0,0.07)',
//         display: 'flex', alignItems: 'center',
//         padding: '0 24px',
//         gap: 14,
//         boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.05)',
//         position: 'sticky', top: 0, zIndex: 30,
//       }}>

//         {/* Mobile spacer for hamburger */}
//         <div style={{ width: 50, flexShrink: 0 }} className="md:hidden" />

//         {/* ── Search ── */}
//         <div style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
//           <div style={{
//             position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
//             color: focused ? '#f97316' : '#94a3b8', transition: 'color 0.2s',
//             display: 'flex', alignItems: 'center',
//           }}>
//             <Search size={15} />
//           </div>
//           <input
//             className="topbar-input"
//             type="text"
//             placeholder="Search anything…"
//             onFocus={() => setFocused(true)}
//             onBlur={() => setFocused(false)}
//             style={{
//               width: '100%',
//               padding: '9px 44px 9px 38px',
//               fontFamily: "'DM Sans',sans-serif", fontSize: 13.5,
//               background: focused ? '#ffffff' : '#f8fafc',
//               border: focused
//                 ? '1.5px solid rgba(249,115,22,0.55)'
//                 : '1.5px solid rgba(0,0,0,0.08)',
//               borderRadius: 12, color: '#1e293b',
//               boxShadow: focused
//                 ? '0 0 0 4px rgba(249,115,22,0.09), 0 2px 16px rgba(0,0,0,0.08)'
//                 : '0 1px 4px rgba(0,0,0,0.04)',
//               transition: 'all 0.22s ease',
//             }}
//           />
//           {!focused && (
//             <div style={{
//               position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
//               display: 'flex', gap: 3,
//             }}>
//               {['⌘', 'K'].map(k => (
//                 <span key={k} style={{
//                   fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#cbd5e1',
//                   background: '#f1f5f9', border: '1px solid #e2e8f0',
//                   borderRadius: 5, padding: '1px 5px', lineHeight: '16px',
//                 }}>{k}</span>
//               ))}
//             </div>
//           )}
//         </div>

//         <div style={{ flex: 1 }} />

//         {/* ── Right actions ── */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

//           {/* Bell */}
//           <button
//             className="bell-btn"
//             onMouseEnter={() => setBellHov(true)}
//             onMouseLeave={() => setBellHov(false)}
//             style={{
//               position: 'relative', width: 40, height: 40, borderRadius: 11,
//               background: bellHov ? '#fff7ed' : '#f8fafc',
//               border: bellHov ? '1.5px solid #fed7aa' : '1.5px solid rgba(0,0,0,0.08)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               cursor: 'pointer', color: bellHov ? '#f97316' : '#64748b',
//               transition: 'all 0.2s', boxShadow: bellHov ? '0 4px 16px rgba(249,115,22,0.15)' : 'none',
//             }}
//           >
//             <Bell size={17} />
//             {/* Badge */}
//             <div style={{
//               position: 'absolute', top: 9, right: 9,
//               width: 8, height: 8, borderRadius: '50%',
//               background: 'linear-gradient(135deg,#f97316,#ea580c)',
//               border: '2px solid white',
//               boxShadow: '0 0 8px rgba(249,115,22,0.8)',
//             }} />
//           </button>

//           {/* Divider */}
//           <div style={{ width: 1, height: 26, background: 'rgba(0,0,0,0.08)', margin: '0 2px' }} />

//           {/* User pill */}
//           <button
//             onMouseEnter={() => setUserHov(true)}
//             onMouseLeave={() => setUserHov(false)}
//             style={{
//               display: 'flex', alignItems: 'center', gap: 9,
//               padding: '5px 12px 5px 5px', borderRadius: 12,
//               background: userHov ? '#fff7ed' : '#f8fafc',
//               border: userHov ? '1.5px solid #fed7aa' : '1.5px solid rgba(0,0,0,0.08)',
//               cursor: 'pointer', transition: 'all 0.22s ease',
//               boxShadow: userHov ? '0 4px 20px rgba(249,115,22,0.15)' : 'none',
//             }}
//           >
//             {/* Avatar */}
//             <div style={{
//               width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
//               background: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontFamily: "'DM Sans',sans-serif",
//               fontSize: 12, fontWeight: 700, color: 'white',
//               boxShadow: userHov ? '0 2px 16px rgba(249,115,22,0.55)' : '0 2px 8px rgba(249,115,22,0.35)',
//               transition: 'box-shadow 0.2s',
//             }}>
//               {getInitials(user?.name)}
//             </div>

//             {/* Name + role — hidden on small mobile */}
//             <div style={{ display: 'none' }} className="sm:block">
//               <div style={{
//                 fontFamily: "'DM Sans',sans-serif", fontSize: 13,
//                 fontWeight: 600, color: '#1e293b',
//                 whiteSpace: 'nowrap', lineHeight: 1,
//               }}>
//                 {user?.name}
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2.5 }}>
//                 <div style={{
//                   width: 5, height: 5, borderRadius: '50%',
//                   background: '#22c55e', boxShadow: '0 0 5px #22c55e',
//                 }} />
//                 <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: '#94a3b8' }}>
//                   {user?.role}
//                 </span>
//               </div>
//             </div>

//             <ChevronDown
//               size={13}
//               color={userHov ? '#f97316' : '#94a3b8'}
//               style={{ transition: 'color 0.2s', transform: userHov ? 'rotate(180deg)' : 'rotate(0)', transitionProperty: 'color,transform' }}
//             />
//           </button>
//         </div>
//       </header>
//     </>
//   )
// }

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getInitials } from '../../lib/utils';

export default function Topbar() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const [focused, setFocused] = useState(false);
  const [bellHov, setBellHov] = useState(false);
  const [userHov, setUserHov] = useState(false);

  // Determine page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/users')) return 'Users';
    if (path.includes('/banners')) return 'Banners';
    if (path.includes('/products')) return 'Products';
    if (path.includes('/categories')) return 'Categories';
    return 'Dashboard'; // fallback
  };

  return (
    <>
      <style>{`
        @keyframes bellRing {
          0%,100% { transform: rotate(0deg); }
          20%      { transform: rotate(-15deg); }
          40%      { transform: rotate(15deg); }
          60%      { transform: rotate(-10deg); }
          80%      { transform: rotate(8deg); }
        }
        .bell-btn:hover svg { animation: bellRing 0.5s ease; }
        .topbar-input { outline: none; }
        .topbar-input::placeholder { color: #94a3b8; }
      `}</style>

      <header
        style={{
          height: 64,
          flexShrink: 0,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 14,
          boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Left section: mobile spacer + page title */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Spacer for mobile hamburger (hidden on md+) */}
          <div style={{ width: 50, flexShrink: 0 }} className="md:hidden" />
          <h1
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 20,
              fontWeight: 600,
              color: '#1e293b',
              letterSpacing: '-0.02em',
            }}
          >
            {getPageTitle()}
          </h1>
        </div>

        {/* Spacer that pushes everything to the right */}
        <div style={{ flex: 1 }} />

        {/* Right section: search + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', width: 280 }}>
            <div
              style={{
                position: 'absolute',
                left: 13,
                top: '50%',
                transform: 'translateY(-50%)',
                color: focused ? '#f97316' : '#94a3b8',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search size={15} />
            </div>
            <input
              className="topbar-input"
              type="text"
              placeholder="Search anything…"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                width: '100%',
                padding: '9px 44px 9px 38px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13.5,
                background: focused ? '#ffffff' : '#f8fafc',
                border: focused
                  ? '1.5px solid rgba(249,115,22,0.55)'
                  : '1.5px solid rgba(0,0,0,0.08)',
                borderRadius: 12,
                color: '#1e293b',
                boxShadow: focused
                  ? '0 0 0 4px rgba(249,115,22,0.09), 0 2px 16px rgba(0,0,0,0.08)'
                  : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.22s ease',
              }}
            />
            {!focused && (
              <div
                style={{
                  position: 'absolute',
                  right: 11,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  gap: 3,
                }}
              >
               
              </div>
            )}
          </div>

          {/* Bell */}
          <button
            className="bell-btn"
            onMouseEnter={() => setBellHov(true)}
            onMouseLeave={() => setBellHov(false)}
            style={{
              position: 'relative',
              width: 40,
              height: 40,
              borderRadius: 11,
              background: bellHov ? '#fff7ed' : '#f8fafc',
              border: bellHov
                ? '1.5px solid #fed7aa'
                : '1.5px solid rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: bellHov ? '#f97316' : '#64748b',
              transition: 'all 0.2s',
              boxShadow: bellHov
                ? '0 4px 16px rgba(249,115,22,0.15)'
                : 'none',
            }}
          >
            <Bell size={17} />
            {/* Badge */}
            <div
              style={{
                position: 'absolute',
                top: 9,
                right: 9,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#f97316,#ea580c)',
                border: '2px solid white',
                boxShadow: '0 0 8px rgba(249,115,22,0.8)',
              }}
            />
          </button>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 26,
              background: 'rgba(0,0,0,0.08)',
              margin: '0 2px',
            }}
          />

          {/* User pill */}
          <button
            onMouseEnter={() => setUserHov(true)}
            onMouseLeave={() => setUserHov(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '5px 12px 5px 5px',
              borderRadius: 12,
              background: userHov ? '#fff7ed' : '#f8fafc',
              border: userHov
                ? '1.5px solid #fed7aa'
                : '1.5px solid rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'all 0.22s ease',
              boxShadow: userHov
                ? '0 4px 20px rgba(249,115,22,0.15)'
                : 'none',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: 'white',
                boxShadow: userHov
                  ? '0 2px 16px rgba(249,115,22,0.55)'
                  : '0 2px 8px rgba(249,115,22,0.35)',
                transition: 'box-shadow 0.2s',
              }}
            >
              {getInitials(user?.name)}
            </div>

            {/* Name + role — hidden on small mobile */}
            <div style={{ display: 'none' }} className="sm:block">
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#1e293b',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                }}
              >
                {user?.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 2.5,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 5px #22c55e',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9.5,
                    color: '#94a3b8',
                  }}
                >
                  {user?.role}
                </span>
              </div>
            </div>

            <ChevronDown
              size={13}
              color={userHov ? '#f97316' : '#94a3b8'}
              style={{
                transition: 'color 0.2s, transform 0.2s',
                transform: userHov ? 'rotate(180deg)' : 'rotate(0)',
              }}
            />
          </button>
        </div>
      </header>
    </>
  );
}