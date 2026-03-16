import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import AdminLayout from './components/layout/AdminLayout'
import LoginPage from './pages/auth/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import UsersPage from './pages/users/UsersPage'
import Banner from './pages/banner/Banner'
import AddBanner from './pages/banner/AddBanner'
import EditBanner from './pages/banner/EditBanner'
import Category from './pages/category/Category'
import AddCategory from './pages/category/Addcategory'
import EditCategory from './pages/category/EditCategory'

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Private Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersPage />} />

          {/* Banner */}
          <Route path="/banner" element={<Banner />} />
          <Route path="/add-banner" element={<AddBanner />} />
          <Route path="/edit-banner/:id" element={<EditBanner />} />


          {/* Category */}
          <Route path="/category" element={<Category />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/edit-category/:id" element={<EditCategory />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}