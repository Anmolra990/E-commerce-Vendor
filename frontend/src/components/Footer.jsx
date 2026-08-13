

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 grid-cols-1 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">E-Shop</h3>
            <p className="text-sm text-slate-400 leading-6">
              E-Shop is your one-stop marketplace for quality products across categories.
              Shop securely, sell easily, and manage your business with confidence.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Components</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Home</li>
              <li>Products</li>
              <li>Cart</li>
              <li>Orders</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Vendor Space</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Add Product</li>
              <li>My Products</li>
              <li>Vendor Orders</li>
              <li>Vendor Dashboard</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
            <p className="text-sm text-slate-400">support@eshop.com</p>
            <p className="text-sm text-slate-400 mt-2">+1 (555) 123-4567</p>
            <p className="text-sm text-slate-400 mt-2">123 Commerce Street, City, Country</p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} E-Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
