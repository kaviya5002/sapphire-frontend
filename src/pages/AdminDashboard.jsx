import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    lowStockItems: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = () => {
      const userRole = localStorage.getItem('role')
      const token = localStorage.getItem('token')
      
      if (!token || userRole !== 'admin') {
        navigate('/login')
      } else {
        fetchDashboardData()
      }
    }
    
    setTimeout(checkAuth, 100)
  }, [navigate])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all data in parallel
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        API.get('/admin/users').catch(() => ({ data: [] })),
        API.get('/products').catch(() => ({ data: [] })),
        API.get('/orders').catch(() => ({ data: [] }))
      ])
      
      const users = usersRes.data.users || usersRes.data || []
      const products = productsRes.data.products || productsRes.data || []
      const orders = ordersRes.data.orders || ordersRes.data || []
      
      const lowStock = products.filter(p => p.stock <= 10).length
      
      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        lowStockItems: lowStock
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  const recentUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', date: '2024-03-15' },
    { id: 2, name: 'Emma Davis', email: 'emma@email.com', date: '2024-03-14' },
    { id: 3, name: 'Lisa Chen', email: 'lisa@email.com', date: '2024-03-13' }
  ]

  const recentOrders = [
    { id: '#ORD001', customer: 'Sarah Johnson', amount: 1299, status: 'Completed' },
    { id: '#ORD002', customer: 'Emma Davis', amount: 899, status: 'Processing' },
    { id: '#ORD003', customer: 'Lisa Chen', amount: 1599, status: 'Shipped' }
  ]

  const lowStockProducts = [
    { name: 'Sugar Lipstick', stock: 5, category: 'Lips' },
    { name: 'Luxury Mascara', stock: 3, category: 'Eyes' },
    { name: 'Blush Palette', stock: 2, category: 'Face' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-nav">
          <div className="admin-logo">
            <h2>🛡️ Admin Panel</h2>
          </div>
          <div className="admin-user">
            <span>Welcome, Admin</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          <h1 className="dashboard-title">Dashboard Overview</h1>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{stats.totalProducts}</h3>
                <p>Total Products</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛒</div>
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card alert">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <h3>{stats.lowStockItems}</h3>
                <p>Low Stock Alerts</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/admin/users" className="action-btn">
                <span className="action-icon">👥</span>
                <span className="action-title">Manage Users</span>
              </Link>
              <Link to="/admin/products" className="action-btn">
                <span className="action-icon">📦</span>
                <span className="action-title">Manage Products</span>
              </Link>
              <Link to="/admin/orders" className="action-btn">
                <span className="action-icon">🛒</span>
                <span className="action-title">View Orders</span>
              </Link>
              <Link to="/home" className="action-btn">
                <span className="action-icon">🌐</span>
                <span className="action-title">View Website</span>
              </Link>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="recent-activities">
            <div className="activity-section">
              <h3>Recent User Signups</h3>
              <div className="activity-list">
                {recentUsers.map(user => (
                  <div key={user.id} className="activity-item">
                    <div className="activity-info">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <span className="activity-date">{user.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="activity-section">
              <h3>Recent Orders</h3>
              <div className="activity-list">
                {recentOrders.map(order => (
                  <div key={order.id} className="activity-item">
                    <div className="activity-info">
                      <strong>{order.id}</strong>
                      <span>{order.customer} - ₹{order.amount}</span>
                    </div>
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="activity-section">
              <h3>Low Stock Products</h3>
              <div className="activity-list">
                {lowStockProducts.map((product, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-info">
                      <strong>{product.name}</strong>
                      <span>{product.category}</span>
                    </div>
                    <span className="stock-alert">{product.stock} left</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}