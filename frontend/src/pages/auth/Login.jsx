import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

function Login() {
 const navigate = useNavigate();
 const location = useLocation();
const { login } = useAuth();

const [formData, setFormData] = useState({ email: "", password: "" });
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const res = await API.post("/auth/login", formData);

console.log(res.data);

const user = res.data.data.user;
const token = res.data.data.token;

login(user, token);

const role = user.role;

if (role === "admin") {
  navigate("/admin");
} else if (role === "vendor") {
  navigate("/vendor");
} else if (role === "buyer") {
  const redirectTo = location.state?.from || "/home";
  navigate(redirectTo);
}

  } catch (err) {
    console.log(err.response?.data);
    setMessage(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login
        </h1>

        {message && (
          <div className="mb-4 bg-red-100 text-red-600 p-3 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-6">
          Don't have an account?
          <Link
            to="/register"
            className="text-blue-600 ml-2 font-semibold"
          >
            Register
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Login;