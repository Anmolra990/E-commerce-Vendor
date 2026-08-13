import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const [oldImage, setOldImage] = useState("");
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // GET PRODUCT
  // =========================
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);

      const product = res.data.data;

      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        stock: product.stock || "",
        image: null,
      });

      // Store existing image separately
      setOldImage(product.image || "");
      setPreview(product.image || "");
    } catch (error) {
      console.log(error);

      setMessage(
        error.response?.data?.message || "Unable to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // NORMAL INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check image type
    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file");
      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size should be less than 5MB");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    // New image preview
    setPreview(URL.createObjectURL(file));

    setMessage("");
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", Number(formData.price));
      data.append("category", formData.category);
      data.append("stock", Number(formData.stock));

      // Only send image if user selected a NEW image
      if (formData.image) {
        data.append("image", formData.image);
      }

      await API.put(`/products/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/vendor/products");
    } catch (error) {
      console.log(error);

      setMessage(
        error.response?.data?.message || "Unable to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">
            Loading product...
          </p>
        </div>
      </>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">

        <h1 className="text-4xl font-bold mb-6">
          Edit Product
        </h1>

        {message && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
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
              required
              className="w-full border rounded-lg p-3"
              placeholder="Enter product title"
            />
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
              required
              className="w-full border rounded-lg p-3 h-28"
              placeholder="Enter product description"
            />
          </div>

          {/* PRICE + STOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block mb-2 font-medium">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3"
                placeholder="Enter stock"
              />
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
              required
              className="w-full border rounded-lg p-3"
              placeholder="Enter category"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block mb-2 font-medium">
              Product Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-lg p-3"
            />

            <p className="text-sm text-gray-500 mt-2">
              Select a new image only if you want to change it.
            </p>
          </div>

          {/* IMAGE PREVIEW */}
          {preview && (
            <div className="mt-4">

              <p className="text-sm text-gray-500 mb-2">
                Image Preview
              </p>

              <img
                src={preview}
                alt="Product Preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=Image+Not+Found";
                }}
                className="w-full h-64 object-cover rounded-lg border"
              />

            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Update Product"}
          </button>

        </form>
      </div>
    </>
  );
}

export default EditProduct;