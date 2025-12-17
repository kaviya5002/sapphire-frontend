import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'

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
    const userRole = localStorage.getItem('role')
    const token = localStorage.getItem('token')
    
    if (!token || userRole !== 'admin') {
      navigate('/login')
      return
    }
    
    fetchUsers()
  }, [navigate])

  const fetchUsers = async () => {
    const token = localStorage.getItem('token')
    
    console.log('Authorization token:', token ? token.substring(0, 20) + '...' : 'No token')
    
    try {
      const response = await API.get('/admin/users')
      console.log('API response data:', response.data)
      
      const usersData = response.data.users || response.data || []
      const formattedUsers = usersData.map(user => ({
        ...user,
        id: user._id || user.id,
        displayId: (user._id || user.id || '').toString().slice(-4),
        displayRole: user.role === 'admin' ? 'Admin' : 'User',
        displayStatus: user.status === true ? 'Active' : 'Blocked',
        dateCreated: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A'
      }))
      setUsers(formattedUsers)
    } catch (error) {
      console.error('API error:', error.response?.status, error.response?.data || error.message)
      setUsers([])
    }
  }

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
                    <td>#{user.displayId || '0000'}</td>
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <span className={`role-badge ${(user.role || 'user').toLowerCase()}`}>
                        {user.displayRole || 'User'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${(user.displayStatus || 'active').toLowerCase()}`}>
                        {user.displayStatus || 'Active'}
                      </span>
                    </td>
                    <td>{user.dateCreated || 'N/A'}</td>
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
                    <h3 className="mobile-user-name">{user.name || 'N/A'}</h3>
                    <p className="mobile-user-id">#{user.displayId || '0000'}</p>
                  </div>
                  <span className={`status-badge ${(user.displayStatus || 'active').toLowerCase()}`}>
                    {user.displayStatus || 'Active'}
                  </span>
                </div>
                
                <div className="mobile-user-details">
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Email</span>
                    <span className="mobile-detail-value">{user.email || 'N/A'}</span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Phone</span>
                    <span className="mobile-detail-value">{user.phone || 'N/A'}</span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Role</span>
                    <span className={`role-badge ${(user.role || 'user').toLowerCase()}`}>
                      {user.displayRole || 'User'}
                    </span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Date Created</span>
                    <span className="mobile-detail-value">{user.dateCreated || 'N/A'}</span>
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