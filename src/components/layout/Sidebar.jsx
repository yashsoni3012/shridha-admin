import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Image, Package, Users, AlertTriangle, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/logo_img.png";

// ── Logout Confirmation Modal ──────────────────────────────────────────────────
const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ animation: "fadeIn 0.15s ease" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-[90%] max-w-sm rounded-2xl border border-gray-700/60 bg-[#161616] shadow-2xl p-6"
        style={{ animation: "slideUp 0.2s ease" }}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 mx-auto mb-5">
          <LogOut size={24} className="text-red-400" />
        </div>

        {/* Text */}
        <h2 className="text-white text-xl font-semibold text-center mb-2 tracking-tight">
          Sign out?
        </h2>
        <p className="text-gray-400 text-sm text-center mb-7 leading-relaxed">
          You'll be redirected to the login page. Any unsaved changes will be lost.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 bg-transparent text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-lg shadow-red-500/20"
          >
            Yes, Sign out
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)     scale(1);    }
        }
      `}</style>
    </div>
  );
};

// ── Sidebar ────────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  // Close sidebar when screen size becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Banners",   icon: Image,           path: "/banners"   },
    { name: "Products",  icon: Package,          path: "/products"  },
    { name: "Users",     icon: Users,            path: "/users"     },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Opens the modal instead of logging out immediately
  const handleLogoutClick = () => setShowLogoutModal(true);

  // Called when user confirms inside the modal
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    if (window.innerWidth < 1024) setIsOpen(false);
    navigate("/login");
  };

  const handleLogoutCancel = () => setShowLogoutModal(false);

  return (
    <>
      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#121212] text-[#60A5FA] shadow-lg"
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full bg-[#121212] text-[#E5E7EB] flex flex-col shadow-xl
          transition-transform duration-300 ease-in-out z-50
          w-64 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo / Brand */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-start relative">
          <img src={logo} alt="Brand Logo" className="h-16 object-contain" />
          <button
            onClick={toggleSidebar}
            className="lg:hidden absolute right-6 text-gray-400 hover:text-white transition"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-[#1F2937] text-[#60A5FA] border-l-4 border-[#60A5FA]"
                    : "text-[#E5E7EB] hover:bg-[#1F2937]"
                }`
              }
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 pt-0">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#E5E7EB] hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200 group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;