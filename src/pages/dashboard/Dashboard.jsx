import React, { useState, useEffect } from "react";
import { Image, Package } from "lucide-react";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const BANNER_API_URL = `${API_BASE_URL}/banner`;
const PRODUCT_API_URL = `${API_BASE_URL}/product`;

const Dashboard = () => {
  const [bannerCount, setBannerCount] = useState(null);
  const [productCount, setProductCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [bannerRes, productRes] = await Promise.all([
          fetch(BANNER_API_URL),
          fetch(PRODUCT_API_URL)
        ]);

        if (!bannerRes.ok || !productRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const bannerData = await bannerRes.json();
        const productData = await productRes.json();

        if (bannerData.success) {
          setBannerCount(bannerData.count || bannerData.data.length);
        }
        if (productData.success) {
          setProductCount(productData.count || productData.data.length);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Stat card component
  const StatCard = ({ title, value, icon: Icon, bgColor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">
          {loading ? (
            <span className="text-gray-300">—</span>
          ) : (
            value
          )}
        </p>
      </div>
      <div className={`p-3 rounded-full ${bgColor}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="p-6 font-['DM_Sans']">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, Shreedha</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Error message if any */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          ⚠️ Error loading data: {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        <StatCard
          title="Total Banners"
          value={bannerCount}
          icon={Image}
          bgColor="bg-blue-500"
        />
        <StatCard
          title="Total Products"
          value={productCount}
          icon={Package}
          bgColor="bg-green-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;