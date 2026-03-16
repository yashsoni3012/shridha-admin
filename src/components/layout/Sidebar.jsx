import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/logo_img.png";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    name: "Banners",
    path: "/banners",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    name: "Products",
    path: "/products",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    name: "Categories",
    path: "/categories",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    name: "Users",
    path: "/users",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    if (window.innerWidth < 1024) setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* ── Mobile toggle ── */}
      <button
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        style={{
          position: "fixed", top: 14, left: 14, zIndex: 60,
          display: "none",
          alignItems: "center", justifyContent: "center",
          width: 40, height: 40, borderRadius: 10,
          background: "#1a1a1a", border: "none",
          color: "#fff", cursor: "pointer",
          boxShadow: "0 4px 14px rgba(0,0,0,.25)",
          transition: "transform .15s, box-shadow .15s",
        }}
        className="sb-toggle"
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        <div style={{ width: 18, height: 18, position: "relative" }}>
          {/* Animated hamburger → X */}
          <span style={{
            position: "absolute", left: 0, top: isOpen ? "50%" : "20%",
            width: "100%", height: 2, background: "#fff", borderRadius: 2,
            transform: isOpen ? "translateY(-50%) rotate(45deg)" : "none",
            transition: "all .25s ease",
          }} />
          <span style={{
            position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
            width: "100%", height: 2, background: "#fff", borderRadius: 2,
            opacity: isOpen ? 0 : 1,
            transition: "opacity .2s ease",
          }} />
          <span style={{
            position: "absolute", left: 0, top: isOpen ? "50%" : "80%",
            width: "100%", height: 2, background: "#fff", borderRadius: 2,
            transform: isOpen ? "translateY(-50%) rotate(-45deg)" : "none",
            transition: "all .25s ease",
          }} />
        </div>
      </button>

      {/* ── Backdrop ── */}
      <div
        onClick={toggleSidebar}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity .3s ease",
        }}
        className="sb-backdrop"
      />

      {/* ── Sidebar panel ── */}
      <div
        style={{
          position: "fixed", left: 0, top: 0,
          height: "100vh", width: 252,
          background: "#111827",
          display: "flex", flexDirection: "column",
          zIndex: 50,
          boxShadow: "4px 0 24px rgba(0,0,0,.18)",
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
          transition: "transform .3s cubic-bezier(.4,0,.2,1)",
        }}
        className="sb-panel"
      >
        {/* ── Logo ── */}
        <div style={{
          padding: "20px 20px 18px",
          borderBottom: "1px solid rgba(255,255,255,.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <img
            src={logo}
            alt="Brand Logo"
            style={{ height: 40, objectFit: "contain", display: "block" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          {/* Fallback text logo */}
          <div style={{
            display: "none", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: "#fff",
            }}>
              A
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#f9fafb", letterSpacing: "-0.3px" }}>
              Admin
            </span>
          </div>

          {/* Mobile close */}
          <button
            onClick={toggleSidebar}
            className="sb-close"
            style={{
              display: "none", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: 7,
              border: "1px solid rgba(255,255,255,.1)",
              background: "rgba(255,255,255,.05)",
              cursor: "pointer", color: "#9ca3af",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.1)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>


        {/* ── Navigation ── */}
        <nav style={{
          flex: 1, padding: "0 10px",
          overflowY: "auto", display: "flex",
          flexDirection: "column", gap: 2,
        }}>
          {menuItems.map((item, i) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) setIsOpen(false); }}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 10,
                fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                color: isActive ? "#fff" : "rgba(255,255,255,.5)",
                background: isActive
                  ? "rgba(255,255,255,.1)"
                  : "transparent",
                textDecoration: "none",
                transition: "all .2s ease",
                animation: mounted ? `fadeSlideIn .3s ease ${i * 0.05}s both` : "none",
                position: "relative",
                overflow: "hidden",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.style.background.includes("0.1")) {
                  e.currentTarget.style.background = "rgba(255,255,255,.06)";
                  e.currentTarget.style.color = "rgba(255,255,255,.85)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.style.background.includes("0.1")) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,.5)";
                }
              }}
            >
              {({ isActive }) => (
                <>
                  {/* Active pill indicator */}
                  {isActive && (
                    <span style={{
                      position: "absolute", left: 0, top: "50%",
                      transform: "translateY(-50%)",
                      width: 3, height: "60%",
                      background: "#fff", borderRadius: "0 3px 3px 0",
                    }} />
                  )}
                  <span style={{
                    display: "flex", flexShrink: 0,
                    color: isActive ? "#fff" : "rgba(255,255,255,.4)",
                    transition: "color .2s",
                  }}>
                    {item.icon}
                  </span>
                  <span style={{ letterSpacing: "0.1px" }}>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom section ── */}
        <div style={{ padding: "10px 10px 16px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "10px 14px", borderRadius: 10,
              border: "none", background: "transparent",
              fontSize: 13.5, fontWeight: 400,
              color: "rgba(255,255,255,.4)",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all .2s ease", textAlign: "left",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,.12)";
              e.currentTarget.style.color = "#f87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,.4)";
            }}
          >
            <LogOut size={17} style={{ flexShrink: 0, transition: "transform .2s" }} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Scrollbar styling inside nav */
        .sb-panel nav::-webkit-scrollbar { width: 3px; }
        .sb-panel nav::-webkit-scrollbar-track { background: transparent; }
        .sb-panel nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 10px; }

        @media (max-width: 1023px) {
          .sb-toggle { display: flex !important; }
          .sb-close  { display: flex !important; }
          .sb-panel  { transform: translateX(-100%); }
          .sb-panel.open { transform: translateX(0); }
        }
        @media (min-width: 1024px) {
          .sb-panel    { transform: translateX(0) !important; }
          .sb-backdrop { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;