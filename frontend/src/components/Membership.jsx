import { Link } from "react-router-dom";

function Membership() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}

      <section className="bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 text-white">

        <div className="max-w-6xl mx-auto px-6 py-20 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-amber-300 text-sm font-bold mb-6">
            👑 E-Commerce Membership
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Shop More.
            <span className="text-amber-400">
              {" "}Save More.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mt-5 text-slate-300 text-lg">
            Choose the membership plan that gives you the best shopping
            benefits and exclusive offers.
          </p>

        </div>

      </section>


      {/* MEMBERSHIP PLANS */}

      <section className="bg-white py-16">

        <div className="max-w-5xl mx-auto px-6">


          {/* SECTION HEADER */}

          <div className="text-center mb-10">

            <h2 className="text-3xl font-black text-slate-900">
              Choose Your Membership
            </h2>

            <p className="text-slate-500 mt-2">
              Select the plan that works best for you.
            </p>

          </div>


          {/* PLANS */}

          <div className="grid md:grid-cols-2 gap-8">


            {/* ================================= */}
            {/* SILVER MEMBERSHIP */}
            {/* ================================= */}

            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">

              <div className="text-center">

                <div className="text-5xl mb-4">
                  🥈
                </div>

                <h3 className="text-2xl font-black">
                  Silver Membership
                </h3>

                <div className="mt-5">

                  <span className="text-5xl font-black">
                    ₹499
                  </span>

                  <span className="text-slate-400">
                    /year
                  </span>

                </div>

                <p className="text-slate-400 mt-3">
                  Great benefits for everyday shopping.
                </p>

              </div>


              {/* SILVER BENEFITS */}

              <div className="mt-8 space-y-4">

                <div className="flex gap-3">
                  <span className="text-green-400">
                    ✓
                  </span>

                  <span>
                    5% exclusive member discount
                  </span>
                </div>


                <div className="flex gap-3">
                  <span className="text-green-400">
                    ✓
                  </span>

                  <span>
                    Free delivery on selected orders
                  </span>
                </div>


                <div className="flex gap-3">
                  <span className="text-green-400">
                    ✓
                  </span>

                  <span>
                    Access to member-only offers
                  </span>
                </div>


                <div className="flex gap-3">
                  <span className="text-green-400">
                    ✓
                  </span>

                  <span>
                    Special reward coupons
                  </span>
                </div>

              </div>


              {/* SILVER BUTTON */}

              <Link
                to="/membership/checkout?plan=silver"
                className="block text-center mt-8 py-4 rounded-xl
                           bg-white text-slate-900 font-black
                           hover:bg-slate-200 transition"
              >
                🥈 Choose Silver
              </Link>


            </div>


          
            <div className="relative bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-3xl p-8 text-slate-950 shadow-xl">


           

              <div className="absolute -top-3 left-1/2 -translate-x-1/2">

                <span className="px-4 py-1 rounded-full bg-slate-950 text-white text-xs font-black">
                  BEST VALUE
                </span>

              </div>


              <div className="text-center pt-4">

                <div className="text-5xl mb-4">
                  🥇
                </div>

                <h3 className="text-2xl font-black">
                  Gold Membership
                </h3>

                <div className="mt-5">

                  <span className="text-5xl font-black">
                    ₹999
                  </span>

                  <span className="text-slate-700">
                    /year
                  </span>

                </div>

                <p className="text-slate-800 mt-3">
                  Maximum savings and premium benefits.
                </p>

              </div>


              {/* GOLD BENEFITS */}

              <div className="mt-8 space-y-4">

                <div className="flex gap-3">
                  <span className="font-bold">
                    ✓
                  </span>

                  <span>
                    10% exclusive member discount
                  </span>
                </div>


                <div className="flex gap-3">
                  <span className="font-bold">
                    ✓
                  </span>

                  <span>
                    Free delivery on all eligible orders
                  </span>
                </div>


                <div className="flex gap-3">
                  <span className="font-bold">
                    ✓
                  </span>

                  <span>
                    Early access to sales and deals
                  </span>
                </div>


                <div className="flex gap-3">
                  <span className="font-bold">
                    ✓
                  </span>

                  <span>
                    Priority customer support
                  </span>
                </div>


                <div className="flex gap-3">
                  <span className="font-bold">
                    ✓
                  </span>

                  <span>
                    Premium-only offers and rewards
                  </span>
                </div>

              </div>


              {/* GOLD BUTTON */}

              <Link
                to="/membership/checkout?plan=gold"
                className="block text-center mt-8 py-4 rounded-xl
                           bg-slate-950 text-white font-black
                           hover:bg-slate-800 transition"
              >
                🥇 Choose Gold
              </Link>


            </div>


          </div>

        </div>

      </section>


      {/* BOTTOM SECTION */}

      <section className="bg-gradient-to-r from-purple-700 to-indigo-700">

        <div className="max-w-5xl mx-auto px-6 py-12 text-center text-white">

          <h2 className="text-3xl font-black">
            Start Saving Today
          </h2>

          <p className="text-purple-200 mt-2">
            Choose Silver or Gold and unlock exclusive benefits.
          </p>

        </div>

      </section>


    </div>
  );
}

export default Membership;