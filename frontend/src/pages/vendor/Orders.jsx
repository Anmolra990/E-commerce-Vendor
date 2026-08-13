import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/vendor/my-orders");
        setOrders(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      await API.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status } : order))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId("");
    }
  };

  const handlePaymentStatusChange = async (orderId, paymentStatus) => {
    try {
      setUpdatingId(orderId);
      await API.put(`/orders/${orderId}`, { paymentStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, paymentStatus } : order
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not update payment status");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Vendor Orders</h1>
            <p className="text-gray-500 mt-2">Orders for your products</p>
          </div>
          <Link to="/vendor" className="text-blue-600 font-semibold">
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No orders found yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-xl p-5 shadow-sm bg-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-semibold">Order ID: {order._id}</p>
                    <p className="text-gray-600">Buyer: {order.userId?.name || "Unknown"}</p>
                    <p className="text-gray-600">Total: ₹ {order.totalAmount}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Status: {order.status}</p>
                    <p>Payment: {order.paymentStatus}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(order._id, status)}
                      disabled={updatingId === order._id}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                        order.status === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {updatingId === order._id ? 'Updating...' : status}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {['Pending', 'Paid'].map((paymentStatus) => (
                    <button
                      key={paymentStatus}
                      onClick={() => handlePaymentStatusChange(order._id, paymentStatus)}
                      disabled={updatingId === order._id}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                        order.paymentStatus === paymentStatus
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {updatingId === order._id ? 'Updating...' : paymentStatus}
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                </div>

                <div className="mt-4 space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-lg">
                      <p className="font-medium">{item.productId?.title || "Product"}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} | Price: ₹ {item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;
