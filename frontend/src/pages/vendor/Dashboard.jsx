import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/dashboard/vendor");

      console.log("Vendor dashboard:", response.data);

      setData(response.data.data);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Could not load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Vendor Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your products and orders
            </p>
          </div>

          <Link
            to="/vendor/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            Manage Products
          </Link>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* User Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">

              <h2 className="text-2xl font-bold mb-5">
                Vendor Information
              </h2>

              <div className="grid md:grid-cols-3 gap-5">

                <div>
                  <p className="text-gray-500">
                    Name
                  </p>

                  <p className="font-semibold text-lg">
                    {data.user?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Email
                  </p>

                  <p className="font-semibold text-lg">
                    {data.user?.email || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Role
                  </p>

                  <p className="font-semibold text-lg capitalize">
                    {data.user?.role || "N/A"}
                  </p>
                </div>

              </div>

            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-gray-500">
                  Total Products
                </p>

                <p className="text-4xl font-bold mt-2">
                  {data.stats?.products || 0}
                </p>

                <Link
                  to="/vendor/products"
                  className="inline-block mt-4 text-blue-600 font-semibold"
                >
                  View Products →
                </Link>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-gray-500">
                  Total Orders
                </p>

                <p className="text-4xl font-bold mt-2">
                  {data.stats?.orders || 0}
                </p>

                <Link
                  to="/vendor/orders"
                  className="inline-block mt-4 text-blue-600 font-semibold"
                >
                  View Orders →
                </Link>
              </div>

            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default Dashboard;