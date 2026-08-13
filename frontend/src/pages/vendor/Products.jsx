import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorProducts();
  }, []);

  const fetchVendorProducts = async () => {
    try {
      const res = await API.get("/products/vendor/my-products");
      setProducts(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">My Products</h1>
          <Link
            to="/vendor/add-product"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Product
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products found. Add your first product.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product._id} className="border rounded-xl p-5 shadow-sm">
                <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-2">{product.category}</p>
                <p className="text-green-600 font-bold mb-4">₹ {product.price}</p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/vendor/edit-product/${product._id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    onClick={async () => {
                      if (!window.confirm("Delete this product?")) return;

                      try {
                        await API.delete(`/products/${product._id}`);
                        fetchVendorProducts();
                      } catch (error) {
                        console.log(error);
                        alert(error.response?.data?.message || "Unable to delete product");
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Products;
