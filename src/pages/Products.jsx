import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function Products(){
  const [quantities, setQuantities] = useState({});
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const heroSlides = [
    {
      image: "https://c0.wallpaperflare.com/preview/835/84/849/flatlay-makeup-beauty-cosmetics.jpg",
      title: "Our Premium Collection",
      subtitle: "Discover beauty products that enhance your natural glow"
    },
    {
      image: "https://wallpapers.com/images/featured/cosmetic-tfhv43aiapir7c3u.jpg",
      title: "Beauty Essentials",
      subtitle: "Quality cosmetics for every occasion"
    },
    {
      image: "https://www.bcpp.org/wp-content/uploads/2020/06/safe-cosmetics-BCPP.png",
      title: "Safe Cosmetics",
      subtitle: "Clean and safe beauty products for everyone"
    }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  useEffect(() => {
    fetchProducts();
    
    // Auto-refresh products every 30 seconds
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/products');
      setProducts(response.data.products || response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productId = product._id || product.id;
    
    let existing = cart.find(item => (item._id || item.id) === productId);
    if(existing){
      existing.quantity = (existing.quantity || 0) + quantity;
    } else {
      cart.push({ 
        id: productId,
        _id: productId,
        name: product.name, 
        price: product.price, 
        image: product.img || product.image,
        brand: product.brand,
        quantity: quantity 
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
    setQuantities(prev => ({ ...prev, [product._id || product.id]: 1 }));
  };

  const buyNow = (product) => {
    const quantity = quantities[product._id || product.id] || 1;
    const orderItem = {
      id: product._id || product.id,
      _id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.img || product.image,
      brand: product.brand,
      quantity: quantity
    };
    
    localStorage.setItem('buyNowItem', JSON.stringify([orderItem]));
    navigate('/checkout');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = filter === 'all' || product.category === filter;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return a.name.localeCompare(b.name);
    }
  });

  return (
    <main className="products-main">
      <section className="products-hero">
        <div className="hero-carousel">
          <div className="carousel-container">
            {heroSlides.map((slide, index) => (
              <div 
                key={index}
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="hero-overlay">
                  <div className="hero-content">
                    <h1 className="products-title">
                      {searchQuery ? `Search Results for "${searchQuery}"` : slide.title}
                    </h1>
                    <p className="products-subtitle">
                      {searchQuery ? `Found ${filteredProducts.length} products matching your search` : slide.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          {/* Filters */}
          <div className="products-filters">
            <div className="filter-group">
              <label>Category:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                <option value="all">All Products</option>
                <option value="face">Face</option>
                <option value="eyes">Eyes</option>
                <option value="lips">Lips</option>
                <option value="skincare">Skincare</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div className="products-count">
              Showing {sortedProducts.length} products
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    window.history.pushState({}, '', '/products');
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="advanced-product-grid">
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <p>Loading products...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <p>No products found.</p>
              </div>
            ) : (
              sortedProducts.map((product) => (
                <article className="advanced-product-card" key={product.id}>
                  <div className="product-image-container">
                    <img src={product.img || product.image} alt={product.name} className="product-image" />
                    <div className="product-category">{product.category}</div>
                  </div>
                  
                  <div className="product-details">
                    <div className="product-brand">{product.brand}</div>
                    <h3 className="product-title">{product.name}</h3>
                    
                    <div className="product-rating">
                      {renderStars(Math.floor(product.rating))}
                      <span className="rating-value">({product.rating})</span>
                    </div>
                    
                    <div className="product-price">₹{product.price}</div>
                    
                    <div className="quantity-controls">
                      <label className="quantity-label">Quantity:</label>
                      <div className="quantity-selector">
                        <button 
                          className="quantity-btn" 
                          onClick={() => updateQuantity(product._id || product.id, -1)}
                          disabled={(quantities[product._id || product.id] || 1) <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-display">{quantities[product._id || product.id] || 1}</span>
                        <button 
                          className="quantity-btn" 
                          onClick={() => updateQuantity(product._id || product.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button 
                        className="add-to-cart-btn" 
                        onClick={() => addToCart(product)}
                        style={{flex: 1}}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="btn-primary" 
                        onClick={() => buyNow(product)}
                        style={{flex: 1, fontSize: '14px'}}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
