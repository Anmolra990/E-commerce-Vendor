import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function MembershipCancelled() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-slate-50">
        <section className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-3xl text-amber-700">
            !
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Payment cancelled</h1>
          <p className="mt-3 text-slate-600">
            No payment was taken. Your order is still pending and can be paid later.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        
            <Link
              to="/home"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Continue shopping
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

export default MembershipCancelled;
