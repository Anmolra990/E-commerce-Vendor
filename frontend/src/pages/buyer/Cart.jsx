import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import SavedAddressBook from "../../components/SavedAddressBook";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");

      console.log("CART RESPONSE:", res.data);
      console.log("CART ITEMS:", res.data.data?.items);

      setCart(res.data.data);
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = async (productId, quantity, stock) => {
    try {
      // Prevent quantity below 1
      if (quantity < 1) {
        quantity = 1;
      }

      // Prevent quantity above stock
      if (quantity > stock) {
        quantity = stock;
      }

      await API.put(`/cart/${productId}`, {
        quantity,
      });

      await fetchCart();
    } catch (error) {
      console.error("Update quantity error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update quantity"
      );
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);

      await fetchCart();
    } catch (error) {
      console.error("Remove item error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to remove item"
      );
    }
  };

  // =========================
  // TOTAL PRICE
  // =========================
  const total =
    cart?.items?.reduce((sum, item) => {
      const price = item.productId?.price || 0;

      return sum + price * item.quantity;
    }, 0) || 0;

 
  const totalItemsCount =
    cart?.items?.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">

      <Navbar />

      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

     
        <div className="mb-8">

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {totalItemsCount > 0
              ? `You have ${totalItemsCount} item${
                  totalItemsCount > 1 ? "s" : ""
                } in your cart.`
              : "Review your selected items before checkout."}
          </p>

        </div>

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 flex flex-col gap-4">

              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse flex items-center gap-4"
                >
                  <div className="w-20 h-20 bg-slate-200 rounded-xl shrink-0" />

                  <div className="grow space-y-2">

                    <div className="h-4 bg-slate-200 rounded w-1/2" />

                    <div className="h-3 bg-slate-200 rounded w-1/4" />

                    <div className="h-4 bg-slate-200 rounded w-1/6" />

                  </div>

                </div>
              ))}

            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 h-64 animate-pulse" />

          </div>
        )}

        {!loading &&
          (!cart?.items || cart.items.length === 0) && (

            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">

              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🛒
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Your cart is empty
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Looks like you haven't added anything to your cart yet.
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
              >
                Start Shopping
              </button>

            </div>
          )}

        {/* =========================
            CART ITEMS
        ========================= */}
        {!loading && cart?.items?.length > 0 && (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* =========================
                PRODUCTS
            ========================= */}
            <div className="lg:col-span-2 space-y-4">

              {cart.items.map((item) => {

                const product = item.productId || {};

                const itemTitle =
                  product.title ||
                  product.name ||
                  "Product";

                const itemPrice = product.price || 0;

                const fallbackImage = "";

                // =========================
                // IMAGE URL
                // =========================
                const getImageUrl = (value) => {

                  if (!value) return fallbackImage;

                  const trimmed = value.trim();

                  if (!trimmed) return fallbackImage;

                  if (/^https?:\/\//i.test(trimmed)) {
                    return trimmed;
                  }

                  if (/^\/\//.test(trimmed)) {
                    return `https:${trimmed}`;
                  }

                  if (/^\/uploads\//.test(trimmed)) {
                    return `http://localhost:5000${trimmed}`;
                  }

                  try {
                    return new URL(
                      trimmed,
                      window.location.origin
                    ).href;
                  } catch {
                    return fallbackImage;
                  }
                };

                const imageUrl =
                  getImageUrl(product.image);

                return (

                  <div
                    key={product._id || item._id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >

                    
                    <div className="flex items-center gap-4 w-full sm:w-auto">

                      <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">

                        {product.image ? (

                          <img
                            src={imageUrl || product.image}
                            alt={itemTitle}
                            className="w-full h-full object-cover"
                          />

                        ) : (

                          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                            No Image
                          </div>

                        )}

                      </div>

                      <div>

                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {product.category || "General"}
                        </span>

                        <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
                          {itemTitle}
                        </h3>

                        <p className="text-slate-900 font-extrabold text-sm mt-1">
                          ₹{itemPrice.toLocaleString()}
                        </p>

                      </div>

                    </div>

                   
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">

               
                      <div className="flex flex-col">

                        <label className="font-semibold text-sm mb-1">
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="1"
                          max={product.stock || 1}
                          value={item.quantity}
                          onChange={(e) => {

                            let newQuantity =
                              Number(e.target.value);

                        
                            if (
                              !newQuantity ||
                              newQuantity < 1
                            ) {
                              newQuantity = 1;
                            }

                      
                            if (
                              newQuantity >
                              product.stock
                            ) {
                              newQuantity =
                                product.stock;
                            }

                            updateQuantity(
                              product._id,
                              newQuantity,
                              product.stock
                            );

                          }}
                          className="border border-slate-300 rounded-lg p-2 w-24 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <span className="text-xs text-slate-500 mt-1">
                          Available: {product.stock || 0}
                        </span>

                      </div>

                 
                      <button
                        onClick={() =>
                          removeItem(product._id)
                        }
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Remove Item"
                      >

                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >

                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />

                        </svg>

                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

            
            <div className="space-y-6">

              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5">

                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Delivery Address
                </h3>

                <SavedAddressBook
                  selectedAddressId={
                    deliveryAddress?._id
                  }
                  onSelect={setDeliveryAddress}
                />

              </div>

           
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm sticky top-8">

                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm">

                  <div className="flex justify-between text-slate-600">

                    <span>
                      Subtotal ({totalItemsCount} items)
                    </span>

                    <span className="font-semibold text-slate-900">
                      ₹{total.toLocaleString()}
                    </span>

                  </div>

                  <div className="flex justify-between text-slate-600">

                    <span>
                      Estimated Delivery
                    </span>

                    <span className="text-emerald-600 font-medium">
                      Free
                    </span>

                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">

                    <span className="text-base font-bold text-slate-900">
                      Total
                    </span>

                    <span className="text-2xl font-extrabold text-blue-600">
                      ₹{total.toLocaleString()}
                    </span>

                  </div>

                </div>

                {/* CHECKOUT */}
                <button
                  onClick={() => {

                    if (!deliveryAddress) {
                      alert(
                        "Please select or add a delivery address."
                      );

                      return;
                    }

                    navigate("/checkout", {
                      state: {
                        deliveryAddress,
                      },
                    });

                  }}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Checkout

                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />

                  </svg>

                </button>

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

export default Cart;