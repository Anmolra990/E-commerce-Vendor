import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-8 mb-8">
            <h1 className="text-4xl font-bold text-blue-600">Welcome to Our Store</h1>
            <p className="mt-4 text-gray-600 text-lg">
              Browse products, view details, and order them after a quick login.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/home" className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700">
                Browse Products
              </Link>
              <Link to="/login" className="border border-blue-600 text-blue-600 px-5 py-3 rounded-lg font-semibold hover:bg-blue-50">
                Login to Buy
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold">Discover</h2>
              <p className="text-gray-600 mt-2">Explore all available products before signing in.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold">Secure Checkout</h2>
              <p className="text-gray-600 mt-2">Verify your identity only when you are ready to buy.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold">Track Orders</h2>
              <p className="text-gray-600 mt-2">View your orders after login and payment confirmation.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
