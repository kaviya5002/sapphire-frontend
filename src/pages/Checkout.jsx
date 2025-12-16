import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function Checkout() {
  const [orderItems, setOrderItems] = useState([])
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if coming from Buy Now or Cart
    const buyNowItem = localStorage.getItem('buyNowItem')
    if (buyNowItem) {
      setOrderItems(JSON.parse(buyNowItem))
      localStorage.removeItem('buyNowItem')
    } else {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      if (cartItems.length === 0) {
        navigate('/cart')
        return
      }
      setOrderItems(cartItems)
    }
  }, [navigate])

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'pincode']
    return required.every(field => customerInfo[field].trim() !== '')
  }

  const placeOrder = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const orderData = {
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          pincode: customerInfo.pincode
        },
        products: orderItems.map(item => ({
          product: item._id || item.id,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        })),
        total: parseFloat(orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)),
        paymentMethod: 'COD'
      }

      console.log('Placing order with data:', orderData)
      const response = await API.post('/orders', orderData)
      console.log('Order response:', response.data)
      
      // Clear cart if order was from cart
      if (!localStorage.getItem('buyNowItem')) {
        localStorage.removeItem('cart')
        window.dispatchEvent(new Event('storage'))
      }
      
      navigate('/order-success')
    } catch (error) {
      console.error('Order failed:', error.response?.data || error.message)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to place order. Please try again.'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <main>
      <section className="section content-card">
        <h2>Checkout</h2>
        
        {/* Order Summary */}
        <div style={{marginBottom: '30px'}}>
          <h3>Order Summary</h3>
          {orderItems.map((item, idx) => (
            <div key={idx} style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', padding: '10px', border: '1px solid #eee', borderRadius: '8px'}}>
              <img src={item.image} style={{width: '60px', height: '60px', borderRadius: '8px'}} alt={item.name} />
              <div style={{flex: 1}}>
                <h4 style={{margin: '0 0 4px 0'}}>{item.name}</h4>
                <p style={{margin: '0', color: '#666'}}>₹{item.price} x {item.quantity}</p>
              </div>
              <div style={{fontWeight: 'bold'}}>₹{item.price * item.quantity}</div>
            </div>
          ))}
          <div style={{textAlign: 'right', fontSize: '18px', fontWeight: 'bold', marginTop: '15px'}}>
            Total: ₹{total}
          </div>
        </div>

        {/* Customer Information */}
        <div style={{marginBottom: '30px'}}>
          <h3>Delivery Information</h3>
          <div style={{display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Email *</label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}
                required
              />
            </div>
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Address *</label>
              <textarea
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>City *</label>
              <input
                type="text"
                name="city"
                value={customerInfo.city}
                onChange={handleInputChange}
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={customerInfo.pincode}
                onChange={handleInputChange}
                style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{marginBottom: '30px'}}>
          <h3>Payment Method</h3>
          <div style={{padding: '15px', border: '2px solid var(--accent-1)', borderRadius: '8px', backgroundColor: '#f9f9f9'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <input type="radio" checked readOnly />
              <span style={{fontWeight: '600'}}>Cash on Delivery (COD)</span>
            </div>
            <p style={{margin: '10px 0 0 30px', color: '#666', fontSize: '14px'}}>
              Pay when your order is delivered to your doorstep
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{display: 'flex', gap: '15px', justifyContent: 'flex-end'}}>
          <button 
            className="btn-outline" 
            onClick={() => navigate('/cart')}
            disabled={loading}
          >
            Back to Cart
          </button>
          <button 
            className="btn-primary" 
            onClick={placeOrder}
            disabled={loading || !validateForm()}
            style={{opacity: loading || !validateForm() ? 0.6 : 1}}
          >
            {loading ? 'Placing Order...' : `Place Order - ₹${total}`}
          </button>
        </div>
      </section>
    </main>
  )
}