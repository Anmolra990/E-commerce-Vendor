
import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import API from "../../api/axios";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [currentSlide, setCurrentSlide] = useState(0);

 

  const slides = [
    {
      title: "Discover Amazing Products",
      subtitle: "Everything you need in one place",
      description:
        "Explore products from trusted vendors and find the perfect item for you.",
      button: "Shop Now",
      gradient:
        "from-blue-700 via-blue-600 to-indigo-700",
    },
    {
      title: "Quality Products",
      subtitle: "Shop with confidence",
      description:
        "Find great products at competitive prices from our marketplace.",
      button: "Explore Products",
      gradient:
        "from-indigo-700 via-purple-600 to-pink-600",
    },
    {
      title: "Great Deals Await",
      subtitle: "Find something you love",
      description:
        "Browse our latest collection and discover amazing products every day.",
      button: "View Collection",
      gradient:
        "from-cyan-600 via-blue-600 to-indigo-700",
    },
  ];


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/products");

      console.log("Products response:", res.data);

      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Products error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products. Please check your connection."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
      easing: "ease-out-cubic",
    });

    AOS.refresh();
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);



  const categories = useMemo(() => {
    const categoryMap = {};

    products.forEach((product) => {
      if (product.category) {
        const category = product.category.trim();

        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }

        categoryMap[category]++;
      }
    });

    return [
      {
        name: "All",
        count: products.length,
      },
      ...Object.entries(categoryMap).map(
        ([name, count]) => ({
          name,
          count,
        })
      ),
    ];
  }, [products]);


  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const title = String(product.title || "").toLowerCase();
      const description = String(
        product.description || ""
      ).toLowerCase();
      const category = String(
        product.category || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        title.includes(search) ||
        description.includes(search) ||
        category.includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);



  const scrollToProducts = () => {
    document
      .getElementById("products-section")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };


  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />


      <section className="relative overflow-hidden">

        <div
          className={`relative min-h-[520px] md:min-h-[600px] bg-gradient-to-r ${slide.gradient} text-white transition-all duration-700`}
        >

          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="absolute top-20 right-[20%] w-24 h-24 rounded-full bg-white/10 animate-pulse" />

          <div className="absolute bottom-20 right-[35%] w-16 h-16 rounded-full bg-white/10 animate-bounce" />


          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28">

            <div
              key={currentSlide}
              data-aos="fade-up"
              className="max-w-3xl"
            >

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Fresh Arrivals
              </span>

              <p className="mt-6 text-blue-100 text-lg font-medium">
                {slide.subtitle}
              </p>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mt-3 leading-tight">
                {slide.title}
              </h1>

              <p className="mt-5 text-blue-100 text-base md:text-lg max-w-2xl leading-relaxed">
                {slide.description}
              </p>

              <button
                onClick={scrollToProducts}
                className="mt-8 bg-white text-blue-700 px-7 py-3 rounded-xl font-bold shadow-xl hover:scale-105 hover:bg-blue-50 transition"
              >
                {slide.button}
              </button>

            </div>


            <div
              data-aos="fade-left"
              className="mt-12 flex flex-wrap gap-4"
            >

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
                <p className="text-3xl font-extrabold">
                  {products.length}
                </p>

                <p className="text-sm text-blue-100">
                  Products
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
                <p className="text-3xl font-extrabold">
                  {categories.length - 1}
                </p>

                <p className="text-sm text-blue-100">
                  Categories
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4">
                <p className="text-3xl font-extrabold">
                  100%
                </p>

                <p className="text-sm text-blue-100">
                  Secure Shopping
                </p>
              </div>

            </div>

          </div>



          <div className="absolute bottom-7 left-0 right-0 z-20 flex justify-center gap-2">

            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index
                    ? "w-10 bg-white"
                    : "w-2 bg-white/40"
                }`}
              />
            ))}

          </div>

        </div>

      </section>

      

      <section className="bg-white py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div
            data-aos="fade-up"
            className="text-center mb-10"
          >

            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">
              Shop by category
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              Explore Categories
            </h2>

            <p className="text-slate-500 mt-3">
              Browse products based on their categories.
            </p>

          </div>


          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

            {categories.map((category, index) => (

              <button
                key={category.name}
                type="button"
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSearchTerm("");
                  scrollToProducts();
                }}
                data-aos="zoom-in"
                data-aos-delay={index * 70}
                className={`group relative overflow-hidden rounded-2xl p-5 min-h-[150px] text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  selectedCategory === category.name
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-slate-50 border border-slate-200 text-slate-800 hover:border-blue-300"
                }`}
              >


                <div
                  className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition group-hover:scale-110 ${
                    selectedCategory === category.name
                      ? "bg-white/20"
                      : "bg-blue-100"
                  }`}
                >
                  {category.name === "All"
                     }
                </div>

                <h3 className="font-bold mt-4 truncate">
                  {category.name}
                </h3>

                <p
                  className={`text-xs mt-1 ${
                    selectedCategory === category.name
                      ? "text-blue-100"
                      : "text-slate-500"
                  }`}
                >
                  {category.count} products
                </p>

              </button>

            ))}

          </div>

        </div>

      </section>



      <section className="max-w-7xl mx-auto px-6 py-10">

        <div
          data-aos="fade-up"
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 md:p-12 text-white"
        >

          <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

            <div>

              <span className="text-yellow-300 font-bold text-sm uppercase tracking-widest">
                Special Offer
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold mt-2">
                Discover your next favorite product
              </h2>

              <p className="text-slate-300 mt-3">
                Shop products from our trusted vendors.
              </p>

            </div>

            <button
              onClick={scrollToProducts}
              className="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-black px-7 py-3 rounded-xl font-bold transition hover:scale-105"
            >
              Shop Now
            </button>

          </div>

        </div>

      </section>


   

      <section
        id="products-section"
        className="max-w-7xl mx-auto px-6 py-14"
      >

        <div
          data-aos="fade-up"
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7"
        >

          <div>

            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">
              Our Collection
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              Latest Products
            </h2>

            <p className="text-slate-500 mt-2">
              Products added by our vendors.
            </p>

          </div>


   

          <div className="relative w-full lg:w-96">

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search by product name..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pl-11 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}

          </div>

        </div>


   

        {!loading && !error && (

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

            <p className="text-sm text-slate-500">
              Showing{" "}
              <strong className="text-slate-800">
                {filteredProducts.length}
              </strong>{" "}
              of{" "}
              <strong className="text-slate-800">
                {products.length}
              </strong>{" "}
              products
            </p>

            {(searchTerm ||
              selectedCategory !== "All") && (

              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Clear Filters
              </button>

            )}

          </div>

        )}


      

        {loading && (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {Array.from({ length: 8 }).map(
              (_, index) => (

                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse"
                >

                  <div className="h-52 bg-slate-200 rounded-xl" />

                  <div className="h-5 bg-slate-200 rounded mt-5 w-3/4" />

                  <div className="h-4 bg-slate-200 rounded mt-3 w-1/2" />

                  <div className="h-8 bg-slate-200 rounded mt-5 w-1/3" />

                </div>

              )
            )}

          </div>

        )}




        {error && !loading && (

          <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center max-w-lg mx-auto">

            <div className="text-4xl">
              ⚠️
            </div>

            <h3 className="text-xl font-bold text-red-800 mt-3">
              Could not load products
            </h3>

            <p className="text-red-600 text-sm mt-2">
              {error}
            </p>

            <button
              onClick={fetchProducts}
              className="mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold"
            >
              Try Again
            </button>

          </div>

        )}



        {!loading &&
          !error &&
          filteredProducts.length === 0 && (

            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

              <div className="text-5xl">
                📦
              </div>

              <h3 className="text-xl font-bold mt-4">
                No products found
              </h3>

              <p className="text-slate-500 mt-2">
                {searchTerm
                  ? `No product matches "${searchTerm}".`
                  : "There are no products available."}
              </p>

              {(searchTerm ||
                selectedCategory !== "All") && (

                <button
                  onClick={clearFilters}
                  className="mt-5 text-blue-600 font-semibold hover:underline"
                >
                  Clear Search & Filters
                </button>

              )}

            </div>

          )}


     

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {filteredProducts.map(
                (product, index) => (

                  <div
                    key={product._id}
                    data-aos="fade-up"
                    data-aos-delay={
                      (index % 4) * 80
                    }
                    className="group transition duration-500 hover:-translate-y-2"
                  >

                    <div className="rounded-2xl transition duration-500 group-hover:shadow-xl">

                    
                      <ProductCard
                        product={product}
                      />

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </section>



      <section className="bg-white border-y border-slate-100 py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div
            data-aos="fade-up"
            className="text-center mb-10"
          >

            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">
              Why Shop With Us
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              A Better Shopping Experience
            </h2>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              {
                icon: "🚚",
                title: "Fast Delivery",
                text: "Get your products delivered quickly.",
              },
              {
                icon: "🔒",
                title: "Secure Shopping",
                text: "Your shopping experience is protected.",
              },
              {
                icon: "↩️",
                title: "Easy Returns",
                text: "Simple and convenient return process.",
              },
              {
                icon: "⭐",
                title: "Trusted Vendors",
                text: "Shop products from our marketplace vendors.",
              },
            ].map((item, index) => (

              <div
                key={item.title}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                className="group p-7 rounded-2xl bg-slate-50 border border-slate-200 text-center hover:bg-white hover:shadow-xl hover:-translate-y-2 transition duration-500"
              >

                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center text-3xl group-hover:scale-110 transition">
                  {item.icon}
                </div>

                <h3 className="font-bold text-lg mt-5">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


    
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div
          data-aos="fade-up"
          className="rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-7"
        >

          <div>

            <p className="text-blue-200 text-sm uppercase tracking-widest font-semibold">
              Start Shopping
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Find something you love today.
            </h2>

            <p className="text-blue-100 mt-3">
              Browse products from our trusted vendors.
            </p>

          </div>

          <button
            onClick={scrollToProducts}
            className="bg-white text-blue-700 hover:bg-blue-50 px-7 py-3 rounded-xl font-bold transition hover:scale-105"
          >
            Explore Products
          </button>

        </div>

      </section>

    </div>
  );
}

export default Home;

