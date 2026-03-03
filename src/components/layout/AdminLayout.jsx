// import { Outlet } from 'react-router-dom'
// import Sidebar from './Sidebar'
// import Topbar from './Topbar'

// export default function AdminLayout() {
//   return (
//     <div style={{ display: 'flex', height: '100vh', background: '#f1f5f9', overflow: 'hidden' }}>
//       <Sidebar />
//       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
//         <Topbar />
//         <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 28px' }}
//           className="pt-20 md:pt-7"
//         >
//           <div style={{ maxWidth: 1280, margin: '0 auto' }}>
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f1f5f9', overflow: 'hidden' }}>
      <Sidebar />
      {/* Right column: add left margin on large screens to avoid overlap */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}
        className="lg:ml-64"
      >
        <Topbar />
        <main
          style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 28px' }}
          className="pt-20 md:pt-7"
        >
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}