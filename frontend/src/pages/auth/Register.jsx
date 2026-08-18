import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useToast } from "../../context/ToastContext";

function Register() {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
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
      console.log("REGISTER DATA:", formData);

      // Send data directly to backend
      const res = await API.post("/auth/register", formData);

      console.log("REGISTER RESPONSE:", res.data);

      // Backend success message
      toast.success(
        res.data.message || "Registration successful"
      );

      // Go to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data);

      const responseData = err.response?.data;

      // ==============================
      // BACKEND VALIDATION ERRORS
      // ==============================
      if (
        responseData?.errors &&
        responseData.errors.length > 0
      ) {
        // Show backend validation messages
        responseData.errors.forEach((error) => {
          toast.error(error.msg);
        });

        return;
      }

      // ==============================
      // BACKEND NORMAL ERROR
      // ==============================
      toast.error(
        responseData?.message || "Registration failed"
      );

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

          {/* NAME */}
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

          {/* EMAIL */}
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
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

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {/* LOGIN */}
        <p className="mt-5 text-center">
          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 ml-2 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        {/* VENDOR REGISTRATION */}
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