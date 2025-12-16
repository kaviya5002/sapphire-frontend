import React from 'react'
import { Link } from 'react-router-dom'

export default function About(){
  return (
    <main className="about-main">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="about-title">About Sapphire Cosmetics</h1>
          <p className="about-subtitle">Empowering beauty, inspiring confidence, creating sustainable luxury</p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section about-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features">
            <article className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Our Story</h3>
              <p>Founded with love for beauty and self-expression, Sapphire began to help everyone feel confident and radiant.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Mission & Vision</h3>
              <p>We deliver high-quality, cruelty-free cosmetics that empower creativity and support sustainability.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Customer Commitment</h3>
              <p>Your happiness is our priority — easy returns and attentive support for a delightful shopping experience.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Sustainability & Ethics</h3>
              <p>Eco-friendly packaging and ethical sourcing — beauty that cares for the planet.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Brand Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <span className="value-icon">✨</span>
              <h3>Quality Excellence</h3>
              <p>We use only the finest ingredients and cutting-edge formulations to create products that deliver exceptional results.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🌿</span>
              <h3>Natural Beauty</h3>
              <p>Harnessing the power of nature with organic and naturally-derived ingredients for healthier, radiant skin.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🤝</span>
              <h3>Inclusive Beauty</h3>
              <p>Beauty has no boundaries. Our diverse range celebrates every skin tone, type, and individual style.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition Section */}
      <section className="awards-section">
        <div className="container">
          <h2 className="section-title">Awards & Recognition</h2>
          <div className="awards-grid">
            <div className="award-item">
              <div className="award-icon">🏆</div>
              <h4>Best Beauty Brand 2023</h4>
              <p>Beauty Excellence Awards</p>
            </div>
            <div className="award-item">
              <div className="award-icon">🌟</div>
              <h4>Sustainable Beauty Leader</h4>
              <p>Green Beauty Council</p>
            </div>
            <div className="award-item">
              <div className="award-icon">💎</div>
              <h4>Innovation in Cosmetics</h4>
              <p>Global Beauty Innovation Awards</p>
            </div>
            <div className="award-item">
              <div className="award-icon">❤️</div>
              <h4>Customer Choice Award</h4>
              <p>Beauty Consumer Awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">500K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">200+</span>
              <span className="stat-label">Premium Products</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">50+</span>
              <span className="stat-label">Countries Served</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">98%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Sapphire?</h2>
            <p>Discover our premium collection and join thousands of satisfied customers</p>
            <Link to="/products" className="cta-button">Shop Now</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
