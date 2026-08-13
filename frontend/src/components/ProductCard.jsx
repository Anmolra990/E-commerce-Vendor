import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const unavailable = product.isAvailable === false || product.stock <= 0;
  const defaultImage = "https://images.unsplash.com/photo-1513708928738-5dcae1b6e704?auto=format&fit=crop&w=800&q=80";
  const fallbackImage = product.category
    ? `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(product.category)}`
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

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 transition ${unavailable ? "opacity-75" : "hover:shadow-lg"}`}>
      <img
        src={imageUrl}
        alt={product.title}
        onError={(e) => {
          e.target.onerror = null;
          // e.target.src = defaultImage;
        }}
        className="rounded-lg w-full h-48 object-cover"
      />

      <h2 className="text-xl font-bold mt-4">
        {product.title}
      </h2>

      <p className="text-gray-500 mt-2">
        {product.category}
      </p>

      {unavailable && (
        <p className="mt-3 inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
          Out of stock
        </p>
      )}

      <p className="text-2xl font-bold text-green-600 mt-3">
        ₹ {product.price}
      </p>

      <Link
        to={`/product/${product._id}`}
        className={`block text-center text-white mt-4 py-2 rounded-lg ${unavailable ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        View Details
      </Link>

    </div>
  );
}

export default ProductCard;
