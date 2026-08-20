import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function MembershipSuccess() {

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">

        <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md">

          <div className="text-6xl">
            🎉
          </div>

          <h1 className="text-3xl font-black mt-5">
            Payment Successful!
          </h1>

          <p className="text-gray-500 mt-3">
            Your membership payment was successful.
          </p>

          <p className="text-gray-500 mt-2">
            Your membership will be activated shortly.
          </p>

          <button
            onClick={() => navigate("/home")}
            className="mt-7 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Continue Shopping
          </button>

        </div>

      </div>
    </>
  );
}

export default MembershipSuccess;