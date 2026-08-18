import { useEffect, useState } from "react";
import API from "../../api/axios";
import Navbar from "../../components/Navbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    "Out for Delivery": "bg-orange-100 text-orange-700",
    Delivered: "bg-green-100 text-green-700",
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      const orderData = Array.isArray(res.data?.data) ? res.data.data : [];
      setOrders(orderData);
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const orderId = order?._id || "unknown";
              const orderStatus = order?.status || "Pending";
              const items = Array.isArray(order?.items) ? order.items : [];

              return (
                <div key={orderId} className="border rounded-xl p-5 shadow-sm bg-white">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-semibold">Order #{String(orderId).slice(-6)}</h2>
                      <p className="text-sm text-gray-500">Placed on: {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹ {Number(order?.totalAmount || 0).toFixed(2)}</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${statusColors[orderStatus] || 'bg-slate-100 text-slate-700'}`}>
                        {orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-slate-200 p-4 bg-slate-50">
                    <p className="font-semibold">Delivery Status</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {orderStatus === 'Pending' && 'Your order has been placed and is awaiting confirmation.'}
                      {orderStatus === 'Confirmed' && 'Your order has been confirmed and is being prepared.'}
                      {orderStatus === 'Shipped' && 'Your order is on the way and out for delivery.'}
                      {orderStatus === 'Out for Delivery' && 'Your order is out for delivery and arriving soon.'}
                      {orderStatus === 'Delivered' && 'Your order has been delivered successfully.'}
                    </p>
                    <p className="mt-3 text-sm text-slate-700">
                      <span className="font-semibold">Delivery Location:</span>{' '}
                      {order.deliveryAddress || 'Not provided'}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {items.length === 0 ? (
                      <div className="border rounded-lg p-4 bg-slate-50 text-gray-600">
                        No items found for this order.
                      </div>
                    ) : (
                      items.map((item, index) => (
                        <div key={`${orderId}-${index}`} className="border rounded-lg p-4 bg-slate-50">
                          <p className="font-semibold">{item?.productId?.title || "Product"}</p>
                          <p>Quantity: {item?.quantity || 0}</p>
                          <p>Price: ₹ {Number(item?.productId?.price || 0).toFixed(2)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;