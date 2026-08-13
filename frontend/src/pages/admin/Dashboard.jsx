import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

function Dashboard() {
  const [data, setData] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, prodRes, vendorRes] = await Promise.all([
          API.get("/dashboard/admin"),
          API.get("/products?includeInactive=true"),
          API.get("/admin/vendors"),
        ]);   

        setData(dashRes.data.data);
        setProducts(prodRes.data.data || []);
        setVendors(vendorRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleFreezeToggle = async (vendorId, isFrozen) => {
    setError("");

    try {
      await API.put(`/admin/vendors/${vendorId}/freeze`, { isFrozen });

      setVendors((prev) =>
        prev.map((vendor) =>
          vendor._id === vendorId ? { ...vendor, isFrozen } : vendor
        )
      );

      setProducts((prev) =>
        prev.map((product) =>
          product.vendorId?._id === vendorId
            ? { ...product, status: isFrozen ? "Inactive" : "Active" }
            : product
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update vendor status");
    }
  };

  if (loading) return <p className="text-center mt-16">Loading admin dashboard...</p>;

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Admin Console</h1>
          <div className="text-sm text-gray-600">Welcome, {data?.user?.name}</div>
        </div>

        {error && <div className="mt-4 text-red-500">{error}</div>}

        <div className="mt-6">
          <div className="flex gap-3">
            <button
              onClick={() => setTab("overview")}
              className={`px-4 py-2 rounded ${tab === "overview" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Overview
            </button>

            <button
              onClick={() => setTab("vendors")}
              className={`px-4 py-2 rounded ${tab === "vendors" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Vendors
            </button>

            <button
              onClick={() => setTab("products")}
              className={`px-4 py-2 rounded ${tab === "products" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              All Products
            </button>
          </div>

          <div className="mt-6">
            {tab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-white rounded-lg shadow">
                  <div className="text-sm text-gray-500">Users</div>
                  <div className="text-2xl font-bold">{data?.stats?.users ?? "-"}</div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                  <div className="text-sm text-gray-500">Orders</div>
                  <div className="text-2xl font-bold">{data?.stats?.orders ?? "-"}</div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                  <div className="text-sm text-gray-500">Payments</div>
                  <div className="text-2xl font-bold">{data?.stats?.payments ?? "-"}</div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow">
                  <div className="text-sm text-gray-500">Products</div>
                  <div className="text-2xl font-bold">{data?.stats?.products ?? "-"}</div>
                </div>
              </div>
            )}

            {tab === "vendors" && (
              <div>
                {vendors.length === 0 ? (
                  <p className="text-gray-600">No vendors found.</p>
                ) : (
                  <div className="space-y-6">
                    {vendors.map((vendor) => (
                      <div key={vendor._id} className="p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold">{vendor.name || "Unknown Vendor"}</h3>
                            <p className="text-sm text-gray-500">{vendor.email}</p>
                            <p className="text-sm mt-1">Products: {vendor.productCount}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${vendor.isFrozen ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                              {vendor.isFrozen ? "Frozen" : "Active"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => handleFreezeToggle(vendor._id, !vendor.isFrozen)}
                            className={`px-4 py-2 rounded text-white ${vendor.isFrozen ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                          >
                            {vendor.isFrozen ? "Unfreeze Vendor" : "Freeze Vendor"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "products" && (
              <div>
                {products.length === 0 ? (
                  <p className="text-gray-600">No products available.</p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-3 mt-4">
                    {products.map((p) => (
                      <div key={p._id} className="border rounded-xl p-4 bg-white shadow">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold">{p.title}</h3>
                            <p className="text-sm text-gray-500">{p.category}</p>
                            <div className="mt-2 font-bold text-green-600">₹ {p.price}</div>
                            <div className="mt-2 text-xs text-gray-500">Vendor: {p.vendorId?.name || "Unknown"}</div>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${p.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {p.status || "Active"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;