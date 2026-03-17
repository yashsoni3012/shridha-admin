import React, { useState, useEffect } from "react";
import {
  Image,
  Package,
  Bell,
  Search,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const BANNER_API_URL = `${API_BASE_URL}/banner`;
const PRODUCT_API_URL = `${API_BASE_URL}/product`;

// ── Helpers ──────────────────────────────────────────────
const formatDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatPrice = (price) =>
  price != null ? `₹${Number(price).toLocaleString("en-IN")}` : null;

// Safely extract a string from a field that might be an object
const getString = (val) => {
  if (val == null) return null;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return val.name ?? val.title ?? val._id ?? null;
  return null;
};

// ── Skeletons ────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-xl bg-gray-100" />
      <div className="w-14 h-5 rounded-full bg-gray-100" />
    </div>
    <div className="w-12 h-8 rounded-lg bg-gray-100 mb-2" />
    <div className="w-28 h-3.5 rounded bg-gray-100" />
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center gap-4 py-3.5 animate-pulse">
    <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-40 rounded bg-gray-100" />
      <div className="h-3 w-24 rounded bg-gray-100" />
    </div>
    <div className="h-4 w-16 rounded bg-gray-100" />
  </div>
);

// ── Dashboard ────────────────────────────────────────────
const Dashboard = () => {
  const [bannerCount, setBannerCount] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [bannerRes, productRes] = await Promise.all([
        fetch(BANNER_API_URL),
        fetch(PRODUCT_API_URL),
      ]);
      if (!bannerRes.ok || !productRes.ok)
        throw new Error("Failed to fetch data");
      const bannerData = await bannerRes.json();
      const productData = await productRes.json();
      if (bannerData.success)
        setBannerCount(bannerData.count ?? bannerData.data?.length ?? 0);
      if (productData.success) setProducts(productData.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const productCount = products.length;
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const stats = [
    {
      label: "Total Banners",
      value: bannerCount,
      icon: Image,
      accent: "#3b82f6",
      lightBg: "#eff6ff",
    },
    {
      label: "Total Products",
      value: productCount,
      icon: Package,
      accent: "#10b981",
      lightBg: "#f0fdf4",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Body ── */}
      <main className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {loading
            ? [0, 1].map((i) => <SkeletonCard key={i} />)
            : stats.map(({ label, value, icon: Icon, accent, lightBg }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: lightBg }}
                    >
                      <Icon
                        size={18}
                        style={{ color: accent }}
                        strokeWidth={1.8}
                      />
                    </div>
                    <span
                      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ color: accent, background: lightBg }}
                    >
                      <TrendingUp size={10} />
                      Live
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-800 leading-none mb-1">
                    {value ?? "—"}
                  </p>
                  <p className="text-sm text-gray-400 font-medium">{label}</p>
                </div>
              ))}
        </div>

        {/* ── Recent Products ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table head */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Recent Products
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Latest added to your store
              </p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-50 px-6">
            {loading ? (
              [0, 1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)
            ) : recentProducts.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                No products found.
              </div>
            ) : (
              recentProducts.map((product, i) => {
                const name = getString(product.name) ?? "Unnamed Product";
                const category = getString(product.category) ?? "Uncategorized";
                const price = formatPrice(product.price);
                const imgPath = Array.isArray(product.images)
                  ? product.images[0]
                  : (getString(product.imageUrl) ??
                    getString(product.image) ??
                    null);

                const imgSrc = imgPath ? `${API_BASE_URL}${imgPath}` : null;
                const dateStr = product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })
                  : null;

                return (
                  <div
                    key={product._id ?? i}
                    className="flex items-center gap-4 py-3.5 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={14} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Name + category */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                        {name}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {category}
                      </p>
                    </div>

                    {/* Price + date */}
                    <div className="text-right shrink-0">
                      {price && (
                        <p className="text-sm font-semibold text-gray-800">
                          {price}
                        </p>
                      )}
                      {dateStr && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {dateStr}
                        </p>
                      )}
                    </div>

                    <ArrowUpRight
                      size={14}
                      className="text-gray-200 group-hover:text-gray-400 transition-colors shrink-0"
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {!loading && recentProducts.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/60">
              <p className="text-xs text-gray-400">
                Showing {recentProducts.length} of {productCount} products
              </p>
            </div>
          )}
        </div>

        {/* Mobile date */}
        <div className="md:hidden mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Calendar size={12} />
          {formatDate()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
