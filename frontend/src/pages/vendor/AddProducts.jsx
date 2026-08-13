import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

function AddProducts() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // NORMAL INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setMessage("");
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    let error = "";

    // Allowed image types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      error = "Only JPG, PNG and WEBP images are allowed.";
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      error = "Image size must be less than 5MB.";
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        image: error,
      }));

      setFormData((prev) => ({
        ...prev,
        image: null,
      }));

      setPreview("");

      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setErrors((prev) => ({
      ...prev,
      image: "",
    }));

    // Preview
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // =========================
  // FORM VALIDATION
  // =========================
  const validateForm = () => {
    const newErrors = {};

    // TITLE
    const title = formData.title.trim();

    if (!title) {
      newErrors.title = "Product title is required.";
    } else if (title.length < 3) {
      newErrors.title = "Title must contain at least 3 characters.";
    } else if (title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters.";
    }

    // DESCRIPTION
    const description = formData.description.trim();

    if (!description) {
      newErrors.description = "Product description is required.";
    } else if (description.length < 10) {
      newErrors.description =
        "Description must contain at least 10 characters.";
    } else if (description.length > 500) {
      newErrors.description =
        "Description cannot exceed 500 characters.";
    }

    // PRICE
    if (formData.price === "") {
      newErrors.price = "Price is required.";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    // STOCK
    if (formData.stock === "") {
      newErrors.stock = "Stock is required.";
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative.";
    } else if (!Number.isInteger(Number(formData.stock))) {
      newErrors.stock = "Stock must be a whole number.";
    }

    // CATEGORY
    const category = formData.category.trim();

    if (!category) {
      newErrors.category = "Category is required.";
    } else if (category.length < 2) {
      newErrors.category =
        "Category must contain at least 2 characters.";
    } else if (category.length > 50) {
      newErrors.category =
        "Category cannot exceed 50 characters.";
    }

    // IMAGE
    if (!formData.image) {
      newErrors.image = "Product image is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Validate before API request
    const isValid = validateForm();

    if (!isValid) {
      setMessage("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("price", Number(formData.price));
      data.append("category", formData.category.trim());
      data.append("stock", Number(formData.stock));
      data.append("image", formData.image);

      await API.post("/products", data);

      navigate("/vendor");
    } catch (error) {
      console.log(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8 mb-10">

        <h1 className="text-4xl font-bold mb-6">
          Add New Product
        </h1>

        {/* General message */}
        {message && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* TITLE */}
          <div>
            <label className="block mb-2 font-medium">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
              className={`w-full border rounded-lg p-3 outline-none ${
                errors.title
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter product title"
            />

            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              className={`w-full border rounded-lg p-3 h-28 outline-none ${
                errors.description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter product description"
            />

            <div className="flex justify-between">
              {errors.description ? (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              ) : (
                <span />
              )}

              <p className="text-xs text-gray-400 mt-1">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          {/* PRICE + STOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* PRICE */}
            <div>
              <label className="block mb-2 font-medium">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`w-full border rounded-lg p-3 outline-none ${
                  errors.price
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter price"
              />

              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price}
                </p>
              )}
            </div>

            {/* STOCK */}
            <div>
              <label className="block mb-2 font-medium">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                step="1"
                className={`w-full border rounded-lg p-3 outline-none ${
                  errors.stock
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter stock"
              />

              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stock}
                </p>
              )}
            </div>

          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-2 font-medium">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              maxLength={50}
              className={`w-full border rounded-lg p-3 outline-none ${
                errors.category
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter category"
            />

            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category}
              </p>
            )}
          </div>

          {/* IMAGE */}
          <div>
            <label className="block mb-2 font-medium">
              Product Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className={`w-full border rounded-lg p-3 ${
                errors.image
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />

            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG, WEBP — maximum 5MB
            </p>

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image}
              </p>
            )}
          </div>

       
          {preview && (
            <div className="mt-4">

              <p className="text-sm text-gray-500 mb-2">
                Image Preview
              </p>

              <img
                src={preview}
                alt="Product Preview"
                className="w-full h-64 object-contain rounded-lg border bg-gray-50"
              />

            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>

        </form>
      </div>
    </>
  );
}

export default AddProducts;