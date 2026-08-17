import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

function VendorRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    setMessage("");

    try {
      console.log("VENDOR REGISTER DATA:", formData);

      // Send vendor registration request
      const res = await API.post("/auth/register/vendor", formData);

      setMessage(
        res.data.message || "Vendor registration successful"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log("VENDOR REGISTER ERROR:", err.response?.data);

      if (err.response?.data?.errors?.length) {
        setMessage(err.response.data.errors[0].msg);
      } else {
        setMessage(
          err.response?.data?.message ||
          "Vendor registration failed"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Vendor Registration
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Create your vendor account and start selling products.
        </p>

        {/* Message */}
        {message && (
          <div className="mb-5 p-3 rounded-lg bg-blue-100 text-blue-700">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Vendor Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading
              ? "Creating Vendor Account..."
              : "Register as Vendor"}
          </button>

        </form>

        {/* Normal registration */}
        <p className="mt-6 text-center text-gray-600">
          Want to create a buyer account?

          <Link
            to="/register"
            className="text-blue-600 ml-2 font-semibold hover:underline"
          >
            Register as Buyer
          </Link>
        </p>

        {/* Login */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 ml-2 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>

    </main>
  );
}

export default VendorRegistration;