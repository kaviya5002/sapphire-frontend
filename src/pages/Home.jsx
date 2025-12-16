import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=600&fit=crop",
      title: "Unleash Your Inner Glow",
      subtitle: "Premium cosmetics that celebrate your unique beauty",
      cta: "Discover Collection"
    },
    {
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=600&fit=crop",
      title: "Cruelty-Free Beauty",
      subtitle: "Ethical cosmetics for the conscious beauty lover",
      cta: "Shop Ethical"
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Sugar Lipstick",
      brand: "Sugar",
      price: "₹499",
      originalPrice: "₹699",
      image: "https://www.sugarcosmetics.com/cdn/shop/files/Glide-Peptide-Serum-Lipstick-06-Moscow-Mulberry_f7002041.jpg?v=1758800364",
      badge: "Bestseller",
      rating: 4.5,
      reviews: 324
    },
    {
      id: 2,
      name: "Velvet Matte Lipstick",
      brand: "Sapphire Luxe",
      price: "₹899",
      originalPrice: "₹1199",
      image: "https://marscosmetics.in/cdn/shop/files/WEBSITEcopy_2_93818342-047b-4cba-aadf-bd86953aa47d.jpg?v=1718602573",
      badge: "New",
      rating: 4.9,
      reviews: 156
    },
    {
      id: 3,
      name: "Radiant Glow Foundation",
      brand: "Sapphire Pro",
      price: "₹1299",
      originalPrice: "₹1599",
      image: "https://www.makeupforever.sa/on/demandware.static/-/Sites-mufe-master-catalog/default/dwe55fb2d4/hi-res/PDPRevamp/WWC%20-%202.png",
      badge: "Limited",
      rating: 4.8,
      reviews: 89
    },
    {
      id: 4,
      name: "Hydrating Face Serum",
      brand: "Sapphire Care",
      price: "₹1099",
      originalPrice: "₹1399",
      image: "https://www.charak.com/wp-content/uploads/2023/10/Hydrating-Face-Serum-1.jpg",
      badge: "Organic",
      rating: 4.6,
      reviews: 203
    },
    {
      id: 5,
      name: "Luxury Mascara",
      brand: "Sapphire Pro",
      price: "₹999",
      originalPrice: "₹1299",
      image: "https://swissbeauty.in/cdn/shop/products/Artboard1.png?v=1748633753",
      badge: "Trending",
      rating: 4.8,
      reviews: 267
    },
    {
      id: 6,
      name: "Blush Palette",
      brand: "Sapphire Elite",
      price: "₹1299",
      originalPrice: "₹1699",
      image: "https://images-static.nykaa.com/media/catalog/product/d/a/da341305057566054553_1.jpg",
      badge: "Sale",
      rating: 4.5,
      reviews: 145
    }
  ];

  const categories = [
    { name: "Face", icon: "💄", count: "120+ products", image: "https://images.unsplash.com/photo-1631214540242-6b5c1b2c8b7f?w=200&h=200&fit=crop" },
    { name: "Eyes", icon: "👁️", count: "85+ products", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=200&fit=crop" },
    { name: "Lips", icon: "💋", count: "95+ products", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200&h=200&fit=crop" },
    { name: "Skincare", icon: "✨", count: "60+ products", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Beauty Influencer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      text: "Sapphire cosmetics transformed my daily routine. The quality is unmatched!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Makeup Artist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      text: "Professional quality products that my clients absolutely love. Highly recommended!",
      rating: 5
    },
    {
      name: "Lisa Chen",
      role: "Beauty Blogger",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      text: "The best cruelty-free cosmetics I've ever used. Amazing pigmentation and lasting power.",
      rating: 5
    }
  ];

  const brandStats = [
    { number: "500K+", label: "Happy Customers" },
    { number: "200+", label: "Premium Products" },
    { number: "50+", label: "Countries Worldwide" },
    { number: "99%", label: "Customer Satisfaction" }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Makeup Tips for Beginners",
      excerpt: "Master the basics with our comprehensive guide to makeup fundamentals.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=250&fit=crop",
      date: "March 15, 2024",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "The Science Behind Long-Lasting Lipstick",
      excerpt: "Discover what makes our lipsticks stay perfect all day long.",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=250&fit=crop",
      date: "March 12, 2024",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Sustainable Beauty: Our Eco-Friendly Promise",
      excerpt: "Learn about our commitment to environmental responsibility.",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=250&fit=crop",
      date: "March 10, 2024",
      readTime: "4 min read"
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <main className="home-main">
      {/* Hero Carousel */}
      <section className="hero-carousel">
        <div className="carousel-container">
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay">
                <div className="hero-content">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <Link className="hero-cta" to="/products">{slide.cta}</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        

      </section>

      {/* Categories Section */}
      <section id="categories" className={`categories-section compact ${isVisible.categories ? 'animate-in' : ''}`}>
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find your perfect beauty essentials</p>
          
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link key={index} to="/products" className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className={`featured-section compact ${isVisible.featured ? 'animate-in' : ''}`}>
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Handpicked favorites from our collection</p>
          
          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="product-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-badge">{product.badge}</div>
                  <div className="product-overlay">
                    <button className="quick-view">Quick View</button>
                    <button className="add-to-cart">Add to Cart</button>
                  </div>
                </div>
                <div className="product-info">
                  <p className="product-brand">{product.brand}</p>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    {renderStars(Math.floor(product.rating))}
                    <span className="rating-text">({product.reviews})</span>
                  </div>
                  <div className="product-pricing">
                    <span className="product-price">{product.price}</span>
                    <span className="original-price">{product.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beauty Tips Section */}
      <section id="tips" className={`tips-section compact ${isVisible.tips ? 'animate-in' : ''}`}>
        <div className="container">
          <div className="tips-content">
            <div className="tips-text">
              <h2 className="section-title">Beauty Tips & Trends</h2>
              <p className="section-subtitle">Stay updated with the latest beauty insights</p>
              <div className="tips-list">
                <div className="tip-item">
                  <span className="tip-icon">💡</span>
                  <p>Always prep your skin with a good primer for long-lasting makeup</p>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🌟</span>
                  <p>Blend eyeshadows in circular motions for seamless color transitions</p>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">💧</span>
                  <p>Hydrate your lips before applying lipstick for smooth application</p>
                </div>
              </div>
              <Link className="tips-cta" to="/about">Learn More</Link>
            </div>
            <div className="tips-image">
              <img src="https://www.maccosmetics.in/media/export/cms/schAP/sch_b3p3_58543/50x956-3.png" alt="Beauty tips" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Stats Section */}
      <section id="stats" className={`stats-section compact ${isVisible.stats ? 'animate-in' : ''}`}>
        <div className="container">
          <div className="stats-grid">
            {brandStats.map((stat, index) => (
              <div key={index} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`testimonials-section compact ${isVisible.testimonials ? 'animate-in' : ''}`}>
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from beauty lovers worldwide</p>
          
          <div className="testimonial-carousel">
            <div className="testimonial-container">
              {testimonials.map((testimonial, index) => (
                <div key={index} className={`testimonial-card ${index === currentTestimonial ? 'active' : ''}`}>
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="testimonial-text">"{testimonial.text}"</p>
                    <div className="testimonial-author">
                      <img src={testimonial.image} alt={testimonial.name} className="author-image" />
                      <div className="author-info">
                        <div className="author-name">{testimonial.name}</div>
                        <div className="author-role">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className={`newsletter-section compact ${isVisible.newsletter ? 'animate-in' : ''}`}>
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2 className="newsletter-title">Join Our Beauty Community</h2>
              <p className="newsletter-subtitle">Get exclusive offers, beauty tips, and early access to new products</p>
              <div className="newsletter-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">🎁</span>
                  <span>Exclusive Offers</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">💄</span>
                  <span>Beauty Tips</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">⭐</span>
                  <span>Early Access</span>
                </div>
              </div>
            </div>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" className="newsletter-input" />
              <button className="newsletter-btn">Subscribe Now</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}