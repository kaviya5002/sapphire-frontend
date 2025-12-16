import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function Cart(){
  const [cart, setCart] = useState([])
  const [messages, setMessages] = useState([])
  const navigate = useNavigate()

  useEffect(()=> {
    syncCartWithBackend()
    function onStorage(){ syncCartWithBackend() }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  async function syncCartWithBackend(){
    try {
      const response = await API.get('/products')
      const backendProducts = response.data.products || response.data || []
      
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]')
      const updatedCart = []
      const newMessages = []
      
      cartItems.forEach(cartItem => {
        const cartItemId = cartItem._id || cartItem.id
        const backendProduct = backendProducts.find(p => (p._id || p.id) === cartItemId)
        
        if (!backendProduct) {
          newMessages.push(`${cartItem.name} is no longer available and was removed from cart`)
        } else {
          const updatedItem = {
            ...cartItem,
            price: backendProduct.price,
            name: backendProduct.name,
            image: backendProduct.img || backendProduct.image,
            available: backendProduct.stock > 0
          }
          
          if (cartItem.price !== backendProduct.price) {
            newMessages.push(`Price updated for ${backendProduct.name}: ₹${cartItem.price} → ₹${backendProduct.price}`)
          }
          
          updatedCart.push(updatedItem)
        }
      })
      
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      setCart(updatedCart)
      setMessages(newMessages)
      
    } catch (error) {
      console.error('Error syncing cart:', error)
      const items = JSON.parse(localStorage.getItem('cart') || '[]')
      setCart(items)
    }
  }

  function changeQty(index, amount){
    let items = JSON.parse(localStorage.getItem('cart') || '[]')
    items[index].quantity = (items[index].quantity || 0) + amount
    if(items[index].quantity <= 0) items.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(items))
    syncCartWithBackend()
    window.dispatchEvent(new Event('storage'))
  }

  function removeItem(index){
    let items = JSON.parse(localStorage.getItem('cart') || '[]')
    items.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(items))
    syncCartWithBackend()
    window.dispatchEvent(new Event('storage'))
  }

  function checkout(){
    const unavailableItems = cart.filter(item => !item.available)
    
    if (unavailableItems.length > 0) {
      alert(`Cannot checkout: ${unavailableItems.map(item => item.name).join(', ')} are out of stock`)
      return
    }
    
    if (cart.length === 0) {
      alert('Your cart is empty')
      return
    }
    
    navigate('/checkout')
  }

  const total = cart.reduce((sum, it) => sum + (it.price * (it.quantity||0)), 0)

  return (
    <main>
      <section className="section content-card">
        <h2>Your Shopping Cart</h2>
        
        {messages.length > 0 && (
          <div style={{background: '#fff3cd', border: '1px solid #ffeaa7', padding: '10px', borderRadius: '5px', marginBottom: '15px'}}>
            {messages.map((msg, idx) => (
              <p key={idx} style={{margin: '5px 0', fontSize: '14px'}}>{msg}</p>
            ))}
          </div>
        )}
        
        <div id="cartItems">
          {cart.length === 0 ? <p>Your cart is empty.</p> : cart.map((item, idx) => (
            <div key={idx} className="cart-item" style={{display:'flex', alignItems:'center', gap:12, marginBottom:12, opacity: item.available === false ? 0.5 : 1}}>
              <img src={item.image} style={{width:80, height:80, borderRadius:8}} alt={item.name} />
              <div style={{flex:1}}>
                <h4 style={{margin:'0 0 4px 0'}}>
                  {item.name}
                  {item.available === false && <span style={{color: 'red', fontSize: '12px'}}> (Out of Stock)</span>}
                </h4>
                <p style={{margin:'0'}}>₹{item.price}</p>
              </div>

              <div className="cart-qty">
                <button onClick={()=>changeQty(idx, -1)}>−</button>
                <span style={{padding:'0 8px'}}>{item.quantity}</span>
                <button onClick={()=>changeQty(idx, 1)}>+</button>
              </div>

              <button className="btn-outline" onClick={()=>removeItem(idx)}>Remove</button>
            </div>
          ))}
        </div>

        <h3>Total: ₹<span id="cartTotal">{total}</span></h3>
        <button className="btn-primary" onClick={checkout}>Checkout</button>
      </section>
    </main>
  )
}
