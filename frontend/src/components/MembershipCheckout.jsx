import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import API from "../api/axios";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

function MembershipCheckout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { token, user } = useAuth();

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  /*
    Get selected membership plan from URL.

    Examples:

    /membership/checkout?plan=silver
    /membership/checkout?plan=gold
  */

  const selectedPlan =
    searchParams.get("plan")?.toLowerCase() || "silver";


  /*
    MEMBERSHIP PLANS

    Important:
    These prices are only for displaying
    on the frontend.

    The backend must decide the real price
    before creating the Stripe payment.
  */

  const plans = {
    silver: {
      name: "Silver Membership",
      price: 499,
      icon: "🥈",

      benefits: [
        "5% exclusive member discount",
        "Free delivery on selected orders",
        "Access to member-only offers",
        "Special reward coupons",
      ],
    },

    gold: {
      name: "Gold Membership",
      price: 999,
      icon: "🥇",

      benefits: [
        "10% exclusive member discount",
        "Free delivery on all eligible orders",
        "Early access to sales and deals",
        "Priority customer support",
        "Premium-only offers and rewards",
      ],
    },
  };


  /*
    Get selected plan.

    If an invalid plan is passed in the URL,
    Silver will be used as fallback.
  */

  const plan =
    plans[selectedPlan] || plans.silver;


  /*
    START MEMBERSHIP PAYMENT
  */

  const handleMembershipPayment = async () => {

    /*
      Check login
    */

    if (!token) {

      navigate(
        `/login?redirect=/membership/checkout?plan=${selectedPlan}`
      );

      return;
    }


    /*
      Only buyers can purchase membership
    */

    if (user?.role !== "buyer") {

      alert(
        "Only buyers can purchase membership."
      );

      return;
    }


    try {

      setPaymentLoading(true);


      /*
        STEP 1

        Create Membership in backend.

        We send only the plan.

        Backend should decide:

        silver = 499
        gold = 999
      */

      const membershipResponse =
        await API.post(
          "/membership/create",
          {
            plan: selectedPlan,
          }
        );


      console.log(
        "MEMBERSHIP RESPONSE:",
        membershipResponse.data
      );


      /*
        Get membership from backend response.

        Expected response:

        {
          success: true,
          data: {
            membership: {
              _id: "..."
            }
          }
        }
      */

      const membership =
        membershipResponse.data?.data?.membership;


      /*
        Check membership ID
      */

      if (!membership?._id) {

        throw new Error(
          "Membership ID not received from server"
        );
      }


      /*
        STEP 2

        Create Stripe Checkout Session
      */

      const paymentResponse =
        await API.post(
          "/payments/create-membership-checkout-session",
          {
            membershipId: membership._id,
          }
        );


      console.log(
        "STRIPE RESPONSE:",
        paymentResponse.data
      );


      /*
        Get Stripe Checkout URL
      */

      const checkoutUrl =
        paymentResponse.data?.data?.url;


      if (!checkoutUrl) {

        throw new Error(
          "Stripe checkout URL not received"
        );
      }


      /*
        STEP 3

        Redirect user to Stripe Checkout
      */

      window.location.href =
        checkoutUrl;


    } catch (error) {

      console.error(
        "MEMBERSHIP CHECKOUT ERROR:",
        error.response?.data || error
      );


      alert(
        error.response?.data?.message ||
        error.message ||
        "Unable to start membership payment"
      );


    } finally {

      setPaymentLoading(false);

    }

  };


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 py-12 px-6">

        <div className="max-w-5xl mx-auto">


          {/* PAGE TITLE */}

          <div className="mb-8">

            <button
              onClick={() => navigate("/membership")}
              className="text-sm text-purple-700 font-semibold hover:underline mb-4"
            >
              ← Back to Membership Plans
            </button>


            <h1 className="text-3xl font-black text-slate-900">

              Membership Checkout

            </h1>


            <p className="text-slate-500 mt-2">

              Review your membership and continue
              with secure card payment.

            </p>

          </div>


          <div className="grid md:grid-cols-2 gap-8">


            {/* ============================= */}
            {/* LEFT SIDE */}
            {/* ============================= */}

            <div>


              {/* MEMBERSHIP DETAILS */}

              <div
                className={`bg-white border rounded-3xl p-7 shadow-sm ${
                  selectedPlan === "gold"
                    ? "border-amber-400"
                    : "border-slate-300"
                }`}
              >


                <div className="text-center">


                  {/* ICON */}

                  <div className="text-6xl mb-4">

                    {plan.icon}

                  </div>


                  {/* PLAN NAME */}

                  <h2 className="text-2xl font-black text-slate-900">

                    {plan.name}

                  </h2>


                  <p className="text-slate-500 mt-2">

                    Unlock exclusive benefits for
                    one full year.

                  </p>


                  {/* PRICE */}

                  <div className="mt-5">

                    <span className="text-4xl font-black text-slate-900">

                      ₹{plan.price}

                    </span>

                    <span className="text-slate-500 ml-1">

                      /year

                    </span>

                  </div>


                </div>


                {/* BENEFITS */}

                <div className="mt-8 space-y-4">

                  {plan.benefits.map(
                    (benefit, index) => (

                      <div
                        key={index}
                        className="flex items-start gap-3"
                      >

                        <span className="text-green-500 font-bold">

                          ✓

                        </span>


                        <span className="text-slate-700">

                          {benefit}

                        </span>

                      </div>

                    )
                  )}

                </div>


              </div>


              {/* ============================= */}
              {/* PAYMENT METHOD */}
              {/* ============================= */}

              <div className="bg-white border border-slate-200 rounded-3xl p-6 mt-6 shadow-sm">


                <h3 className="text-lg font-bold text-slate-900 mb-4">

                  Payment Method

                </h3>


                <label
                  className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition ${
                    selectedPlan === "gold"
                      ? "border-amber-400 bg-amber-50"
                      : "border-purple-500 bg-purple-50"
                  }`}
                >


                  <input
                    type="radio"
                    name="paymentMethod"
                    value="STRIPE"
                    checked
                    readOnly
                    className="w-4 h-4"
                  />


                  <div className="text-2xl">

                    💳

                  </div>


                  <div className="flex-1">


                    <p className="font-bold text-slate-900">

                      Pay with Card

                    </p>


                    <p className="text-sm text-slate-500 mt-1">

                      Secure card payment powered by Stripe

                    </p>


                  </div>


                  <div className="text-right">


                    <p className="font-bold text-slate-700">

                      Stripe

                    </p>


                    <p className="text-xs text-slate-500">

                      Card Payment

                    </p>


                  </div>


                </label>


              </div>


              {/* SECURITY */}

              <div className="mt-6 bg-slate-200/60 rounded-2xl p-4">

                <p className="text-sm text-slate-600 text-center">

                  🔒 Your payment details are securely
                  processed by Stripe.

                </p>

              </div>


            </div>


            {/* ============================= */}
            {/* RIGHT SIDE */}
            {/* MEMBERSHIP SUMMARY */}
            {/* ============================= */}

            <div className="bg-white border border-slate-200 rounded-3xl p-7 h-fit shadow-sm">


              <h2 className="text-xl font-black text-slate-900 mb-6">

                Membership Summary

              </h2>


              {/* PLAN */}

              <div className="border-b border-slate-200 pb-5">


                <div className="flex justify-between gap-4">


                  <div>


                    <p className="font-bold text-slate-900">

                      {plan.icon} {plan.name}

                    </p>


                    <p className="text-sm text-slate-500 mt-1">

                      Valid for 1 year

                    </p>


                  </div>


                  <p className="font-bold text-slate-900">

                    ₹{plan.price}

                  </p>


                </div>


              </div>


              {/* TOTAL */}

              <div className="flex justify-between items-center mt-6 text-xl font-black text-slate-900">


                <span>

                  Total

                </span>


                <span>

                  ₹{plan.price}

                </span>


              </div>


              {/* PAYMENT BUTTON */}

              <button
                onClick={handleMembershipPayment}
                disabled={paymentLoading}
                className={`w-full mt-7 py-4 rounded-xl font-black transition
                  disabled:bg-slate-400
                  disabled:text-white
                  disabled:cursor-not-allowed
                  ${
                    selectedPlan === "gold"
                      ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                      : "bg-purple-700 hover:bg-purple-800 text-white"
                  }`}
              >

                {paymentLoading
                  ? "Redirecting to Stripe..."
                  : `💳 Pay ₹${plan.price} with Card`
                }

              </button>


              <p className="text-center text-xs text-slate-500 mt-4">

                🔒 Secure card payment powered by Stripe

              </p>


              {/* CHANGE PLAN */}

              <button
                onClick={() => navigate("/membership")}
                disabled={paymentLoading}
                className="w-full text-center mt-5 text-sm font-semibold text-purple-700 hover:underline disabled:text-slate-400"
              >

                Change Membership Plan

              </button>


            </div>


          </div>

        </div>

      </div>
    </>
  );
}

export default MembershipCheckout;