import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // Send login data to backend
      const res = await API.post("/auth/login", formData);

      console.log("LOGIN RESPONSE:", res.data);

      const user = res.data.data.user;
      const token = res.data.data.token;

      // Save authentication
      login(user, token);

      // Success toast
      toast.success("Login successful!");

      // Redirect according to role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "vendor") {
        navigate("/vendor");
      } else if (user.role === "buyer") {
        const redirectTo = location.state?.from || "/home";
        navigate(redirectTo);
      }

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);

      const responseData = err.response?.data;

      /*
        Backend validation response:

        {
          success: false,
          errors: [
            {
              msg: "Please enter a valid email"
            }
          ]
        }
      */

      if (responseData?.errors?.length > 0) {
        // Get first backend validation error
        const validationMessage = responseData.errors[0].msg;

        toast.error(validationMessage);
      } else {
        // Login error such as:
        // Invalid email or password
        toast.error(
          responseData?.message || "Login failed"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="text"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
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
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold disabled:bg-gray-400"
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