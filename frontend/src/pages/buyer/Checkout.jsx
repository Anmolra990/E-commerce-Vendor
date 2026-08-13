import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import SavedAddressBook from "../../components/SavedAddressBook";
import { formatDeliveryAddress } from "../../utils/deliveryAddress";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchCart();
    if (location.state?.deliveryAddress) {
      setDeliveryAddress(location.state.deliveryAddress);
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data.data);
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Unable to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart?.items?.length) return;

    setPlacing(true);
    setMessage("");

    try {
      const items = cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      if (!deliveryAddress) {
        setMessage("Please select or add a delivery address.");
        setPlacing(false);
        return;
      }

      await API.post("/orders", {
        items,
        paymentMethod,
        deliveryAddress: formatDeliveryAddress(deliveryAddress),
      });
      alert(`Order placed successfully via ${paymentMethod}.`);
      navigate("/orders");
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Unable to place order.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-16">Loading checkout...</p>;
  }

  const total = cart?.items?.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6">Checkout</h1>

        {message && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{message}</div>
        )}

        {cart?.items?.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cart.items.map((item) => (
              <div key={item.productId._id} className="border rounded-xl p-5 bg-white shadow-sm">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{item.productId.title}</h2>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">₹ {item.productId.price}</p>
                    <p className="text-sm text-gray-500">Subtotal: ₹ {item.productId.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-xl border p-6 bg-slate-50">
              <div className="flex justify-between text-xl font-semibold">
                <span>Total</span>
                <span>₹ {total.toFixed(2)}</span>
              </div>

              <div className="mt-6">
                <label className="block mb-3 font-semibold">Delivery Address</label>
                <SavedAddressBook selectedAddressId={deliveryAddress?._id} onSelect={setDeliveryAddress} />
              </div>

              <div className="mt-6">
                <label className="block mb-2 font-semibold">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="mt-6 w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {placing ? "Placing order..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Checkout;
