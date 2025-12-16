import React, { useState } from 'react'

export default function Contact(){
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: "Are your products cruelty-free?",
      answer: "Yes, all Sapphire products are 100% cruelty-free and never tested on animals."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to 50+ countries worldwide with tracking and insurance."
    },
    {
      question: "What is your return policy?",
      answer: "We offer 30-day returns for unopened products and 7-day returns for opened products."
    },
    {
      question: "How can I track my order?",
      answer: "You'll receive a tracking number via email once your order ships."
    }
  ];

  function handleSubmit(e){
    e.preventDefault()
    alert('Thank you for your message! We\'ll get back to you within 24 hours.')
    setFormData({ name: '', email: '', subject: '', message: '' });
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  return (
    <main className="contact-main">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-container">
              <div className="form-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you shortly</p>
              </div>
              
              <form onSubmit={handleSubmit} className="modern-contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select 
                    id="subject"
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="order">Order Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message"
                    name="message" 
                    rows="6" 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..." 
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  <span>Send Message</span>
                  <span className="btn-icon">→</span>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <h3>Contact Information</h3>
              <p>Get in touch with us through any of these channels</p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">📍</div>
                  <div className="method-content">
                    <h4>Visit Our Store</h4>
                    <p>123 Beauty Street</p>
                    <p>Mumbai, Maharashtra 400001</p>
                    <p>India</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">📞</div>
                  <div className="method-content">
                    <h4>Call Us</h4>
                    <p>+91 98765 43210</p>
                    <p>+91 98765 43211</p>
                    <p>Mon-Sat: 9AM-7PM</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">✉️</div>
                  <div className="method-content">
                    <h4>Email Us</h4>
                    <p>hello@sapphirecosmetics.com</p>
                    <p>support@sapphirecosmetics.com</p>
                    <p>We reply within 24 hours</p>
                  </div>
                </div>
                
                <div className="contact-method">
                  <div className="method-icon">🌐</div>
                  <div className="method-content">
                    <h4>Follow Us</h4>
                    <p>@SapphireCosmetics</p>
                    <p>Facebook | Instagram | Twitter</p>
                    <p>Stay updated with latest trends</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
