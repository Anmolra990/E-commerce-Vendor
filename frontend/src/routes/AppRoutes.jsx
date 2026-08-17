import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VendorRegistration from "../pages/auth/VendorRegistration";

import Home from "../pages/buyer/Home";
import ProductDetails from "../pages/buyer/ProductDetails";
import Cart from "../pages/buyer/Cart";
import Checkout from "../pages/buyer/Checkout";
import Orders from "../pages/buyer/Orders";


import VendorDashboard from "../pages/vendor/Dashboard";
import VendorProducts from "../pages/vendor/Products";
import VendorOrders from "../pages/vendor/Orders";
import AddProducts from "../pages/vendor/AddProducts";
import EditProduct from "../pages/vendor/EditProduct";

import AdminDashboard from "../pages/admin/Dashboard";
import Profile from "../pages/Profile";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />

        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vendor-registration" element={<VendorRegistration/>} />



        <Route path="/product/:id" element={<ProductDetails />} />

        <Route
          path="/cart"
          element={
            <RoleRoute roles={["buyer", "vendor"]}>
              <Cart />
            </RoleRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <RoleRoute roles={["buyer", "vendor"]}>
              <Checkout />
            </RoleRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <RoleRoute roles={["buyer", "vendor"]}>
              <Orders />
            </RoleRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendor"
          element={
            <RoleRoute role="vendor">
              <VendorDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/vendor/edit-product/:id"
          element={
            <RoleRoute role="vendor">
              <EditProduct />
            </RoleRoute>
          }
        />

        <Route
          path="/vendor/products"
          element={
            <RoleRoute role="vendor">
              <VendorProducts />
            </RoleRoute>
          }
        />

        <Route
          path="/vendor/orders"
          element={
            <RoleRoute role="vendor">
              <VendorOrders />
            </RoleRoute>
          }
        />

        <Route
          path="/vendor/add-product"
          element={
            <RoleRoute role="vendor">
              <AddProducts />
            </RoleRoute>
          }
        />


        <Route
          path="/admin"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />

      
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen text-4xl font-bold">
              404 | Page Not Found
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;