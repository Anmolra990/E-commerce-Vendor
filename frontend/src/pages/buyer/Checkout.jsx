import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import SavedAddressBook from "../../components/SavedAddressBook";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("STRIPE");

  // Address object passed from Cart.jsx via navigate("/checkout", { state: { deliveryAddress } })
  // Shape assumed: { _id, street, city, state, pincode } — adjust to match SavedAddressBook's actual fields
  const [deliveryAddress, setDeliveryAddress] = useState(
    location.state?.deliveryAddress || null
  );

  useEffect(() => {
    fetchCart();
  }, []);

  // If the user lands on /checkout directly (e.g. refresh) without state,
  // location.state will be null and deliveryAddress stays null.
  // We warn them and send them back to the cart to pick one.
  useEffect(() => {
    if (!location.state?.deliveryAddress) {
      console.warn(
        "No delivery address found in navigation state. Redirecting to cart."
      );
    }
  }, [location.state]);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");

      setCart(res.data.data);
    } catch (error) {
      console.log("CART ERROR:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const getTotal = () => {
    if (!cart?.items) return 0;

    return cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);
  };

  // Formats the address object into a single string for the order payload.
  // Adjust field names here to match your actual SavedAddressBook/address schema.
  const formatAddress = (address) => {
    if (!address) return "";

    if (typeof address === "string") return address;

    const { street, city, state, pincode } = address;

    return [street, city, state, pincode]
      .filter(Boolean)
      .join(", ");
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "buyer") {
      alert("Only buyers can place orders.");
      return;
    }

    if (!deliveryAddress) {
      alert("Please select a delivery address.");
      navigate("/cart");
      return;
    }

    if (!cart?.items?.length) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setPaymentLoading(true);

      // ==============================
      // STEP 1: CREATE ORDER
      // ==============================

      const orderResponse = await API.post("/orders", {
        items: cart.items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
        })),

        paymentMethod: paymentMethod,

        // Sending both the formatted string and the raw address id in case
        // your backend expects one or the other. Remove whichever isn't needed.
        deliveryAddress: formatAddress(deliveryAddress),
        addressId: deliveryAddress?._id,
      });

      console.log("ORDER RESPONSE:", orderResponse.data);

      const order = orderResponse.data.data;

      // ==============================
      // COD
      // ==============================

      if (paymentMethod === "COD") {
        alert("Order placed successfully!");

        navigate("/orders");

        return;
      }

      // ==============================
      // STRIPE
      // ==============================

      const paymentResponse = await API.post(
        "/payments/create-checkout-session",
        {
          orderId: order._id,
        }
      );

      console.log(
        "STRIPE RESPONSE:",
        paymentResponse.data
      );

      const checkoutUrl =
        paymentResponse.data.data.url;

      if (!checkoutUrl) {
        throw new Error(
          "Stripe checkout URL not received"
        );
      }

      // Redirect buyer to Stripe
      window.location.href = checkoutUrl;

    } catch (error) {
      console.log(
        "CHECKOUT ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Unable to place order"
      );

    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading checkout...
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              Your cart is empty
            </h2>

            <button
              onClick={() => navigate("/home")}
              className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
          Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* =========================
              DELIVERY ADDRESS
          ========================== */}

          <div>

            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-5 mb-6">

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Delivery Address
                </h3>

                <button
                  onClick={() => navigate("/cart")}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Change
                </button>
              </div>

              {deliveryAddress ? (
                 <div className="mt-6">
                <label className="block mb-3 font-semibold">Delivery Address</label>
                <SavedAddressBook selectedAddressId={deliveryAddress?._id} onSelect={setDeliveryAddress} />
              </div>

              ) : (
                <div className="text-sm">
                  <p className="text-rose-600 mb-3">
                    No delivery address selected.
                  </p>

                  <button
                    onClick={() => navigate("/cart")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Select Address
                  </button>
                </div>
              )}

            </div>


            {/* =========================
                PAYMENT METHOD
            ========================== */}

            <div className="bg-white border rounded-3xl p-5">

              <h3 className="text-lg font-semibold mb-4">
                Payment Method
              </h3>

              {/* Stripe */}

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer mb-3">

                <input
                  type="radio"
                  value="STRIPE"
                  checked={paymentMethod === "STRIPE"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div>
                  <p className="font-semibold">
                    Pay Online
                  </p>

                  <p className="text-sm text-gray-500">
                    Secure payment with Stripe
                  </p>
                </div>

              </label>


              {/* COD */}

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer">

                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />

                <div>
                  <p className="font-semibold">
                    Cash on Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay when your order arrives
                  </p>
                </div>

              </label>

            </div>

          </div>


          {/* =========================
              ORDER SUMMARY
          ========================== */}

          <div className="bg-white border rounded-3xl p-6 h-fit">

            <h2 className="text-xl font-bold mb-5">
              Order Summary
            </h2>

            <div className="space-y-4">

              {cart.items.map((item) => (

                <div
                  key={item.productId._id}
                  className="flex justify-between border-b pb-3"
                >

                  <div>

                    <p className="font-medium">
                      {item.productId.title}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  <p className="font-semibold">
                    ₹{" "}
                    {item.productId.price *
                      item.quantity}
                  </p>

                </div>

              ))}

            </div>


            <div className="flex justify-between mt-6 text-xl font-bold">

              <span>Total</span>

              <span>
                ₹ {getTotal()}
              </span>

            </div>


            <button
              onClick={handlePlaceOrder}
              disabled={paymentLoading || !deliveryAddress}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold"
            >

              {paymentLoading
                ? "Processing..."
                : paymentMethod === "STRIPE"
                ? "Pay with Stripe"
                : "Place Order"}

            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default Checkout;
