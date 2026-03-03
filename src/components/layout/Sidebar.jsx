// // import React, { useState, useEffect } from 'react';

// // const Sidebar = () => {
// //   const [activeIndex, setActiveIndex] = useState(0);
// //   const [isOpen, setIsOpen] = useState(false);

// //   // Close sidebar when screen size becomes large (optional, to avoid double toggles)
// //   useEffect(() => {
// //     const handleResize = () => {
// //       if (window.innerWidth >= 1024) {
// //         setIsOpen(false);
// //       }
// //     };
// //     window.addEventListener('resize', handleResize);
// //     return () => window.removeEventListener('resize', handleResize);
// //   }, []);

// //   const menuItems = [
// //     { name: 'Dashboard', icon: '📊', path: '/dashboard' },
// //     { name: 'Users', icon: '📈', path: '/users' },
// //     { name: 'Settings', icon: '⚙️', path: '/settings' },
// //   ];

// //   const toggleSidebar = () => setIsOpen(!isOpen);

// //   return (
// //     <>
// //       {/* Mobile menu button - visible on small screens */}
// //       <button
// //         onClick={toggleSidebar}
// //         className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#121212] text-[#60A5FA] shadow-lg"
// //         aria-label="Toggle sidebar"
// //       >
// //         <svg
// //           className="w-6 h-6"
// //           fill="none"
// //           stroke="currentColor"
// //           viewBox="0 0 24 24"
// //           xmlns="http://www.w3.org/2000/svg"
// //         >
// //           <path
// //             strokeLinecap="round"
// //             strokeLinejoin="round"
// //             strokeWidth={2}
// //             d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
// //           />
// //         </svg>
// //       </button>

// //       {/* Backdrop for mobile */}
// //       {isOpen && (
// //         <div
// //           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
// //           onClick={toggleSidebar}
// //         />
// //       )}

// //       {/* Sidebar */}
// //       <div
// //         className={`
// //           fixed left-0 top-0 h-full bg-[#121212] text-[#E5E7EB] flex flex-col shadow-xl
// //           transition-transform duration-300 ease-in-out z-50
// //           w-64 lg:translate-x-0
// //           ${isOpen ? 'translate-x-0' : '-translate-x-full'}
// //         `}
// //       >
// //         {/* Logo / Brand */}
// //         <div className="p-6 border-b border-gray-800 flex justify-between items-center">
// //           <h1 className="text-2xl font-bold text-[#60A5FA]">Logo</h1>
// //           {/* Close button for mobile */}
// //           <button
// //             onClick={toggleSidebar}
// //             className="lg:hidden text-gray-400 hover:text-white"
// //             aria-label="Close sidebar"
// //           >
// //             <svg
// //               className="w-5 h-5"
// //               fill="none"
// //               stroke="currentColor"
// //               viewBox="0 0 24 24"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth={2}
// //                 d="M6 18L18 6M6 6l12 12"
// //               />
// //             </svg>
// //           </button>
// //         </div>

// //         {/* Navigation */}
// //         <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
// //           {menuItems.map((item, index) => (
// //             <a
// //               key={index}
// //               href="#"
// //               className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
// //                 activeIndex === index
// //                   ? 'bg-[#1F2937] text-[#60A5FA] border-l-4 border-[#60A5FA]'
// //                   : 'text-[#E5E7EB] hover:bg-[#1F2937]'
// //               }`}
// //               onClick={(e) => {
// //                 e.preventDefault();
// //                 setActiveIndex(index);
// //                 // Close sidebar on mobile after navigation
// //                 if (window.innerWidth < 1024) {
// //                   setIsOpen(false);
// //                 }
// //               }}
// //             >
// //               <span className="text-xl">{item.icon}</span>
// //               <span className="font-medium">{item.name}</span>
// //             </a>
// //           ))}
// //         </nav>

// //         {/* User profile section at bottom */}
// //         <div className="p-4 border-t border-gray-800">
// //           <div className="flex items-center space-x-3 px-2 py-3 rounded-lg hover:bg-[#1F2937] transition-colors cursor-pointer">
// //             <div className="w-8 h-8 rounded-full bg-[#60A5FA] flex items-center justify-center text-[#121212] font-bold">
// //               U
// //             </div>
// //             <div className="flex-1 min-w-0">
// //               <p className="text-sm font-medium truncate">John Doe</p>
// //               <p className="text-xs text-gray-400 truncate">john@example.com</p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default Sidebar;

// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import logo from "../../assets/logo_img.png";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   // Close sidebar when screen size becomes large
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 1024) {
//         setIsOpen(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const menuItems = [
//     { name: "Dashboard", icon: "📊", path: "/dashboard" },
//     { name: "Users", icon: "📈", path: "/users" },
//     { name: "Settings", icon: "⚙️", path: "/settings" },
//   ];

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <>
//       {/* Mobile menu button - visible on small screens */}
//       <button
//         onClick={toggleSidebar}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#121212] text-[#60A5FA] shadow-lg"
//         aria-label="Toggle sidebar"
//       >
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
//           />
//         </svg>
//       </button>

//       {/* Backdrop for mobile */}
//       {isOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={toggleSidebar}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//           fixed left-0 top-0 h-full bg-[#121212] text-[#E5E7EB] flex flex-col shadow-xl
//           transition-transform duration-300 ease-in-out z-50
//           w-64 lg:translate-x-0
//           ${isOpen ? "translate-x-0" : "-translate-x-full"}
//         `}
//       >
//         {/* Logo / Brand */}
//         <div className="p-6 border-b border-gray-800 flex items-center justify-start relative">
//           {/* Logo Image */}
//           <img src={logo} alt="Brand Logo" className="h-16 object-contain" />

//           {/* Close button for mobile */}
//           <button
//             onClick={toggleSidebar}
//             className="lg:hidden absolute right-6 text-gray-400 hover:text-white transition"
//             aria-label="Close sidebar"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
//           {menuItems.map((item, index) => (
//             <NavLink
//               key={index}
//               to={item.path}
//               className={({ isActive }) =>
//                 `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
//                   isActive
//                     ? "bg-[#1F2937] text-[#60A5FA] border-l-4 border-[#60A5FA]"
//                     : "text-[#E5E7EB] hover:bg-[#1F2937]"
//                 }`
//               }
//               onClick={() => {
//                 // Close sidebar on mobile after navigation
//                 if (window.innerWidth < 1024) {
//                   setIsOpen(false);
//                 }
//               }}
//             >
//               <span className="text-xl">{item.icon}</span>
//               <span className="font-medium">{item.name}</span>
//             </NavLink>
//           ))}
//         </nav>

//         {/* User profile section at bottom */}
//         <div className="p-4 border-t border-gray-800">
//           <div className="flex items-center space-x-3 px-2 py-3 rounded-lg hover:bg-[#1F2937] transition-colors cursor-pointer">
//             <div className="w-8 h-8 rounded-full bg-[#60A5FA] flex items-center justify-center text-[#121212] font-bold">
//               U
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium truncate">John Doe</p>
//               <p className="text-xs text-gray-400 truncate">john@example.com</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;


import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // Import logout icon
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/logo_img.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  // Close sidebar when screen size becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Users", icon: "📈", path: "/users" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout(); // Clear auth state
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
    // Navigate to login (will be handled by protected route, but we can explicitly redirect)
    navigate("/login");
  };

  return (
    <>
      {/* Mobile menu button - visible on small screens */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#121212] text-[#60A5FA] shadow-lg"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
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
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
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
                if (window.innerWidth < 1024) {
                  setIsOpen(false);
                }
              }}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 pt-0">
          <button
            onClick={handleLogout}
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