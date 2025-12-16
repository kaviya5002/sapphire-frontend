import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();

  useEffect(() => {
    updateCartCount();
    setUserRole(localStorage.getItem('role') || 'user');
    function onStorage() { 
      updateCartCount(); 
      setUserRole(localStorage.getItem('role') || 'user');
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(count);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <nav className="advanced-nav">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-brand">
          <Link to="/home" className="brand-link">
            <span className="brand-name">SAPPHIRE</span>
            <span className="brand-tagline">Cosmetics</span>
          </Link>
        </div>

        {/* Search Bar */}
        <form className={`nav-search ${searchOpen ? 'search-active' : ''}`} onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search products, brands..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <span className="search-icon">🔍</span>
          </button>
        </form>

        {/* Navigation Links */}
        <ul className={`nav-menu ${open ? "menu-open" : ""}`}>
          {userRole === 'admin' ? (
            <>
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link">📊 Dashboard</Link>
              </li>
              <li className="nav-item dropdown">
                <span className="nav-link">👥 Manage</span>
                <div className="dropdown-menu">
                  <Link to="/admin/users" className="dropdown-item">Users</Link>
                  <Link to="/admin/products" className="dropdown-item">Products</Link>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/home" className="nav-link">Home</Link>
              </li>
              <li className="nav-item dropdown">
                <Link to="/products" className="nav-link">Products</Link>
                <div className="dropdown-menu">
                  <Link to="/products" className="dropdown-item">All Products</Link>
                  <Link to="/products" className="dropdown-item">Face</Link>
                  <Link to="/products" className="dropdown-item">Eyes</Link>
                  <Link to="/products" className="dropdown-item">Lips</Link>
                  <Link to="/products" className="dropdown-item">Skincare</Link>
                </div>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact</Link>
              </li>
            </>
          )}
        </ul>

        {/* Action Buttons */}
        <div className="nav-actions">
          {userRole === 'user' && (
            <>
              <button 
                className="action-btn search-toggle"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                🔍
              </button>
              <Link to="/cart" className="action-btn cart-btn">
                <span className="cart-icon">🛒</span>
                <span className="cart-count">{cartCount}</span>
              </Link>
            </>
          )}
          <button 
            className="action-btn login-btn"
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              localStorage.removeItem('role')
              navigate('/login')
            }}
            title="Logout"
          >
            {userRole === 'admin' ? '👨‍💼' : '👤'}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
        >
          <span className={`hamburger-line ${open ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${open ? 'active' : ''}`}></span>
          <span className={`hamburger-line ${open ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
}
