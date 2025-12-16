import React from 'react'
import { Link } from 'react-router-dom'

export default function OrderSuccess() {
  return (
    <main>
      <section className="section content-card" style={{textAlign: 'center'}}>
        <div style={{fontSize: '64px', marginBottom: '20px'}}>✅</div>
        <h2 style={{color: 'var(--deep)', marginBottom: '15px'}}>Order Placed Successfully!</h2>
        <p style={{fontSize: '18px', marginBottom: '30px', color: '#666'}}>
          Thank you for your order. We'll deliver it to your doorstep soon.
        </p>
        
        <div style={{background: '#f0f8ff', padding: '20px', borderRadius: '10px', marginBottom: '30px'}}>
          <h3 style={{margin: '0 0 10px 0'}}>What's Next?</h3>
          <ul style={{textAlign: 'left', margin: '0', paddingLeft: '20px'}}>
            <li>You'll receive a confirmation call within 24 hours</li>
            <li>Your order will be prepared and dispatched</li>
            <li>Pay cash when the order is delivered</li>
            <li>Delivery typically takes 3-5 business days</li>
          </ul>
        </div>

        <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/products" className="btn-primary">
            Continue Shopping
          </Link>
          <Link to="/home" className="btn-outline">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  )
}