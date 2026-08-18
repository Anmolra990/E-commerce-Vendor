import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      console.log("Fetched product:", res.data.data);
      setProduct(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async () => {
  // No login
  if (!token || !user) {
    navigate("/login", {
      state: {
        from: `/product/${id}`,
      },
    });
    return;
  }

  // Logged in but wrong role
  if (user.role !== "buyer") {
    alert(
      `You are logged in as ${user.role}. Please logout and login with a buyer account.`
    );
    return;
  }

  try {
    await API.post("/cart", {
      productId: product._id,
      quantity,
    });

    alert("Product added to cart");
    navigate("/cart");
  } catch (error) {
    console.log("ADD TO CART ERROR:", error);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

    alert(
      error.response?.data?.message ||
        "Unable to add product"
    );
  }
};

  if (!product) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  const defaultImage = "https://images.unsplash.com/photo-1513708928738-5dcae1b6e704?auto=format&fit=crop&w=800&q=80";
  const fallbackImage = product.category
    ? `https://source.unsplash.com/featured/500x400/?${encodeURIComponent(product.category)}`
    : defaultImage;

  const getImageUrl = (value) => {
    if (!value) return fallbackImage;
    const trimmed = value.trim();
    if (!trimmed) return fallbackImage;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
    if (/^\/uploads\//.test(trimmed)) {
      return `http://localhost:5000${trimmed}`;
    }
    try {
      return new URL(trimmed, window.location.origin).href;
    } catch {
      return fallbackImage;
    }
  };

  const imageUrl = getImageUrl(product.image);
  const unavailable = product.isAvailable === false || product.stock <= 0;

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10">

        <img
          src={imageUrl}
          alt={product.title}
          onError={(e) => {
            e.target.onerror = null;
            // e.target.src = defaultImage;
          }}
          className="rounded-xl shadow"
        />

        <div>

          <h1 className="text-4xl font-bold">{product.title}</h1>

          <p className="text-gray-600 mt-4">
            {product.description}
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-6">
            ₹ {product.price}
          </h2>

          <p className="mt-4">
            <strong>Category:</strong> {product.category}
          </p>

          <p className="mt-2">
            <strong>Stock:</strong> {product.stock}
          </p>

          {unavailable && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 font-medium text-red-700">
              {product.unavailableReason || "This product is out of stock."}
            </p>
          )}

       

       
  <button
  onClick={addToCart}
  disabled={unavailable}
  className={`mt-8 w-full text-white px-8 py-3 rounded-lg font-semibold ${
    unavailable
      ? "bg-gray-400 cursor-not-allowed"
      : !token || !user
      ? "bg-blue-600 hover:bg-blue-700"
      : user.role !== "buyer"
      ? "bg-gray-500 hover:bg-gray-600"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {unavailable
    ? "Out of Stock"
    : !token || !user
    ? "Login to Add to Cart"
    : user.role !== "buyer"
    ? "Buyers Only"
    : "Add To Cart"}
</button>
        </div>

      </div>
    </>
  );
}

export default ProductDetails;
