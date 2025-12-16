import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Cart from './pages/Cart'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Formpage from "./components/form"

export default function App(){
  const location = useLocation()

  // Hide navbar/footer on login page only
  const hideLayout = location.pathname === "/login"

  return (
    <div className="app">

      {/* Show Navbar only when not on login */}
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Login page */}
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<Formpage/>}/>

        {/* Protected pages */}
        <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products/></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About/></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact/></ProtectedRoute>} />
        <Route path="/privacy" element={<ProtectedRoute><Privacy/></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart/></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
        <Route path="/order-success" element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard/></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers/></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts/></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders/></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      {/* Show Footer only when not on login */}
      {!hideLayout && <Footer />}
    </div>
  )
}
