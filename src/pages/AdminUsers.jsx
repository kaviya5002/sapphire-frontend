import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editUser, setEditUser] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    role: 'User',
    status: 'Active'
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is admin
    const userRole = localStorage.getItem('role')
    if (userRole !== 'admin') {
      navigate('/login')
    }

    // Load demo users
    const demoUsers = [
      { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+91 98765 43210', role: 'User', status: 'Active', dateCreated: '2024-03-15' },
      { id: 2, name: 'Emma Davis', email: 'emma@email.com', phone: '+91 98765 43211', role: 'User', status: 'Active', dateCreated: '2024-03-14' },
      { id: 3, name: 'Lisa Chen', email: 'lisa@email.com', phone: '+91 98765 43212', role: 'User', status: 'Blocked', dateCreated: '2024-03-13' },
      { id: 4, name: 'Admin User', email: 'admin@sapphire.com', phone: '+91 98765 43213', role: 'Admin', status: 'Active', dateCreated: '2024-01-01' },
      { id: 5, name: 'John Smith', email: 'john@email.com', phone: '+91 98765 43214', role: 'User', status: 'Active', dateCreated: '2024-03-12' }
    ]
    setUsers(demoUsers)
  }, [navigate])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus
    return matchesSearch && matchesStatus
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch(sortBy) {
      case 'name': return a.name.localeCompare(b.name)
      case 'email': return a.email.localeCompare(b.email)
      case 'date': return new Date(b.dateCreated) - new Date(a.dateCreated)
      default: return 0
    }
  })

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Blocked' : 'Active' }
        : user
    ))
  }

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const handleEditUser = (user) => {
    setEditUser({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (!editUser.name || !editUser.email || !editUser.phone) {
      alert('Please fill in all required fields')
      return
    }

    setUsers(users.map(user => 
      user.id === editUser.id
        ? {
            ...user,
            name: editUser.name,
            email: editUser.email,
            phone: editUser.phone,
            role: editUser.role,
            status: editUser.status
          }
        : user
    ))
    
    setEditUser({ id: null, name: '', email: '', phone: '', role: 'User', status: 'Active' })
    setShowEditModal(false)
    alert('User updated successfully!')
  }

  const handleCancelEdit = () => {
    setEditUser({ id: null, name: '', email: '', phone: '', role: 'User', status: 'Active' })
    setShowEditModal(false)
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
            <h1>User Management</h1>
            <Link to="/admin/dashboard" className="back-btn">← Back to Dashboard</Link>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div className="filter-group">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
              </select>
            </div>
          </div>

          {/* Users Table - Desktop */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id.toString().padStart(3, '0')}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.dateCreated}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn edit"
                          onClick={() => handleEditUser(user)}
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        <button 
                          className={`action-btn ${user.status === 'Active' ? 'block' : 'unblock'}`}
                          onClick={() => toggleUserStatus(user.id)}
                          title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                        >
                          {user.status === 'Active' ? '🚫' : '✅'}
                        </button>
                        {user.role !== 'Admin' && (
                          <button 
                            className="action-btn delete"
                            onClick={() => deleteUser(user.id)}
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile User Cards */}
          <div className="mobile-user-list">
            {sortedUsers.map(user => (
              <div key={user.id} className="mobile-user-card">
                <div className="mobile-user-header">
                  <div className="mobile-user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="mobile-user-info">
                    <h3 className="mobile-user-name">{user.name}</h3>
                    <p className="mobile-user-id">#{user.id.toString().padStart(3, '0')}</p>
                  </div>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </div>
                
                <div className="mobile-user-details">
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Email</span>
                    <span className="mobile-detail-value">{user.email}</span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Phone</span>
                    <span className="mobile-detail-value">{user.phone}</span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Role</span>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Date Created</span>
                    <span className="mobile-detail-value">{user.dateCreated}</span>
                  </div>
                </div>
                
                <div className="mobile-user-actions">
                  <button 
                    className="mobile-action-btn edit"
                    onClick={() => handleEditUser(user)}
                    title="Edit User"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className={`mobile-action-btn ${user.status === 'Active' ? 'block' : 'unblock'}`}
                    onClick={() => toggleUserStatus(user.id)}
                    title={user.status === 'Active' ? 'Block User' : 'Unblock User'}
                  >
                    {user.status === 'Active' ? '🚫 Block' : '✅ Unblock'}
                  </button>
                  {user.role !== 'Admin' && (
                    <button 
                      className="mobile-action-btn delete"
                      onClick={() => deleteUser(user.id)}
                      title="Delete User"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="table-footer">
            <p>Showing {sortedUsers.length} of {users.length} users</p>
          </div>

          {/* Edit User Modal */}
          {showEditModal && (
            <div className="modal-overlay" onClick={handleCancelEdit}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Edit User</h3>
                  <button className="close-btn" onClick={handleCancelEdit}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Full Name *:</label>
                    <input
                      type="text"
                      value={editUser.name}
                      onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *:</label>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *:</label>
                    <input
                      type="text"
                      value={editUser.phone}
                      onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role:</label>
                    <select
                      value={editUser.role}
                      onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      value={editUser.status}
                      onChange={(e) => setEditUser({...editUser, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                  <button className="save-btn" onClick={handleSaveEdit}>Update User</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}