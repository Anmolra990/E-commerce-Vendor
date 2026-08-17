import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      console.log("REGISTER DATA:", formData);

      // Backend handles validation
      const res = await API.post("/auth/register", formData);

      console.log("REGISTER RESPONSE:", res.data);

      // Success toast
      toast.success(
        res.data.message || "Registration successful"
      );

      // Go to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data);

      /*
        Backend validation response:

        {
          success: false,
          errors: [
            {
              msg: "Name is required",
              path: "name"
            }
          ]
        }
      */

      if (err.response?.data?.errors?.length) {

        // Show every backend validation error
        err.response.data.errors.forEach((error) => {
          toast.error(error.msg);
        });

      } else {
        // Normal backend error
        toast.error(
          err.response?.data?.message ||
          "Registration failed"
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Register
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>
            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Name"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
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
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Register */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {/* Login */}
        <p className="mt-5 text-center">
          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 ml-2 font-semibold"
          >
            Login
          </Link>
        </p>

        {/* Vendor Registration */}
        <p className="mt-5 text-center text-gray-600">
          Want to sell products?

          <Link
            to="/vendor-registration"
            className="text-blue-600 ml-2 font-semibold hover:underline"
          >
            Register as Vendor
          </Link>
        </p>

      </div>

    </main>
  );
}

export default Register;