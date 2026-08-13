import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ cartCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/buyer" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            E
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Commerce<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
          <Link
            to="/buyer"
            className={`px-4 py-2 rounded-xl transition-colors ${
              isActive("/buyer")
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Home
          </Link>

          {/* Role Specific Routes */}
          {user?.role === "vendor" && (
            <Link
              to="/vendor"
              className={`px-4 py-2 rounded-xl transition-colors ${
                isActive("/vendor")
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Vendor Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-xl transition-colors ${
                isActive("/admin")
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right Action Icons & User Info */}
        <div className="flex items-center gap-3">
          {/* Cart Icon (Shown for Buyers) */}
          {user?.role === "buyer" && (
            <Link
              to="/cart"
              className={`relative p-2.5 rounded-xl transition flex items-center justify-center ${
                isActive("/cart")
                  ? "bg-blue-50 text-blue-600"
                  : "bg-slate-100/80 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              }`}
              aria-label="Shopping Cart"
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
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Profile Badge & Logout Button */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded mt-0.5">
                  {user.role}
                </span>
              </div>

              <Link to="/profile" className="hidden sm:inline text-xs font-bold text-slate-600 hover:text-blue-600">Profile</Link>

              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-sm"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2">
          {user && (
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Profile</Link>
          )}

          {user && (
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">{user.name}</span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                {user.role}
              </span>
            </div>
          )}

          <Link
            to="/buyer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>

          {user?.role === "buyer" && (
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cart
            </Link>
          )}

          {user?.role === "vendor" && (
            <Link
              to="/vendor"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Vendor Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Admin Panel
            </Link>
          )}

          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
