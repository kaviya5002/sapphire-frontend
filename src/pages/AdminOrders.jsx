import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [editingOrder, setEditingOrder] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role')
    if (role !== 'admin') {
      navigate('/login')
    }

    fetchOrders()
  }, [navigate])

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders')
      const ordersData = response.data.orders || response.data || []
      const formattedOrders = ordersData.map(order => ({
        ...order,
        date: new Date(order.createdAt || order.date).toLocaleDateString(),
        customer: order.customerInfo?.name || order.customer,
        email: order.customerInfo?.email || order.email,
        items: order.items?.length || order.items || 0,
        products: order.items?.map(item => item.name) || order.products || []
      }))
      setOrders(formattedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    }
  }

  useEffect(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date)
        case 'total':
          return b.total - a.total
        case 'customer':
          return a.customer.localeCompare(b.customer)
        default:
          return 0
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, sortBy])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}`, { status: newStatus })
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    try {
      await API.put(`/orders/${editingOrder.id}`, {
        customerInfo: {
          name: editingOrder.customer,
          email: editingOrder.email
        },
        total: editingOrder.total,
        status: editingOrder.status
      })
      
      setOrders(orders.map(order => 
        order.id === editingOrder.id ? editingOrder : order
      ))
      setShowEditModal(false)
      setEditingOrder(null)
      alert('Order updated successfully!')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order')
    }
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditingOrder(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'status-badge completed'
      case 'processing': return 'status-badge processing'
      case 'shipped': return 'status-badge shipped'
      case 'pending': return 'status-badge pending'
      default: return 'status-badge'
    }
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-nav">
          <div className="admin-logo">
            <Link to="/admin/dashboard">🛡️ Admin Panel</Link>
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
          <div className="page-header">
            <h1>Order Management</h1>
            <div className="header-actions">
              <Link to="/admin/dashboard" className="back-btn">← Back to Dashboard</Link>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <div className="filter-group">
              <label>Search Orders:</label>
              <input
                type="text"
                placeholder="Search by customer, order ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Date (Newest)</option>
                <option value="total">Total Amount</option>
                <option value="customer">Customer Name</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.id}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{order.customer}</strong>
                        <br />
                        <small style={{ color: 'var(--maroon)', opacity: 0.8 }}>
                          {order.email}
                        </small>
                      </div>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <span>{Array.isArray(order.items) ? order.items.length : order.items} items</span>
                      <br />
                      <small style={{ color: 'var(--maroon)', opacity: 0.7 }}>
                        {Array.isArray(order.products) ? (
                          order.products.slice(0, 2).join(', ') + (order.products.length > 2 ? '...' : '')
                        ) : (
                          'Product details'
                        )}
                      </small>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--accent-1)' }}>
                        ₹{order.total}
                      </strong>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={getStatusBadgeClass(order.status)}
                        style={{ 
                          border: 'none', 
                          borderRadius: '12px', 
                          padding: '4px 8px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn edit" 
                          title="Edit Order"
                          onClick={() => handleEditOrder(order)}
                        >
                          ✏️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="table-footer">
                <p>No orders found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Order Statistics */}
          <div className="stats-grid" style={{ marginTop: '40px' }}>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{orders.length}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>₹{orders.reduce((sum, order) => sum + order.total, 0)}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{orders.filter(o => o.status === 'pending').length}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{orders.filter(o => o.status === 'completed').length}</h3>
                <p>Completed Orders</p>
              </div>
            </div>
          </div>

          {/* Edit Order Modal */}
          {showEditModal && editingOrder && (
            <div className="modal-overlay" onClick={handleCancelEdit}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Edit Order {editingOrder.id}</h3>
                  <button className="close-btn" onClick={handleCancelEdit}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Customer Name:</label>
                    <input
                      type="text"
                      value={editingOrder.customer}
                      onChange={(e) => setEditingOrder({...editingOrder, customer: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={editingOrder.email}
                      onChange={(e) => setEditingOrder({...editingOrder, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Amount:</label>
                    <input
                      type="number"
                      value={editingOrder.total}
                      onChange={(e) => setEditingOrder({...editingOrder, total: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      value={editingOrder.status}
                      onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                  <button className="save-btn" onClick={handleSaveEdit}>Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}