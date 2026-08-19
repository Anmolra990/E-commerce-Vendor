import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function PaymentSuccess() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-slate-50">
        <section className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Payment successful</h1>
          <p className="mt-3 text-slate-600">
            Thank you. Your payment has been received and your order is being confirmed.
          </p>
          <Link
            to="/orders"
            className="mt-7 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            View my orders
          </Link>
        </section>
      </main>
    </>
  );
}

export default PaymentSuccess;
