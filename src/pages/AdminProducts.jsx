import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Face',
    price: '',
    stock: '',
    image: ''
  })
  const [editProduct, setEditProduct] = useState({
    id: null,
    name: '',
    category: 'Face',
    price: '',
    stock: '',
    image: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    
    if (!token) {
      console.log('No token found, redirecting to login')
      navigate('/login')
      return
    }
    
    if (role !== 'admin') {
      console.log('User is not admin, redirecting to login')
      navigate('/login')
      return
    }
    
    console.log('Admin authenticated, fetching products')
    fetchProducts()
  }, [navigate])



  const fetchProducts = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No token available for API request')
      navigate('/login')
      return
    }
    
    try {
      setLoading(true)
      console.log('Fetching products with token:', token.substring(0, 20) + '...')
      
      const response = await API.get('/products')
      console.log('Products API response status:', response.status)
      
      let productsData = []
      if (response.data) {
        if (Array.isArray(response.data)) {
          productsData = response.data
        } else if (response.data.products && Array.isArray(response.data.products)) {
          productsData = response.data.products
        } else if (response.data.data && Array.isArray(response.data.data)) {
          productsData = response.data.data
        }
      }
      
      console.log('Found', productsData.length, 'products')
      
      const formattedProducts = productsData.map(product => ({
        ...product,
        id: product._id || product.id,
        image: product.image || product.img || 'https://via.placeholder.com/150x150?text=No+Image',
        status: product.stock <= 10 ? (product.stock === 0 ? 'Out of Stock' : 'Low Stock') : 'In Stock'
      }))
      
      setProducts(formattedProducts)
    } catch (error) {
      console.error('Error fetching products:', error.response?.status, error.response?.data || error.message)
      if (error.response?.status === 401) {
        console.log('Unauthorized, redirecting to login')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('role')
        navigate('/login')
      }
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category.toLowerCase() === filterCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'name': return a.name.localeCompare(b.name)
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'stock-low': return a.stock - b.stock
      case 'stock-high': return b.stock - a.stock
      default: return 0
    }
  })

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const selectAllProducts = () => {
    setSelectedProducts(
      selectedProducts.length === sortedProducts.length 
        ? [] 
        : sortedProducts.map(p => p.id)
    )
  }

  const deleteSelectedProducts = () => {
    if (selectedProducts.length === 0) return
    if (window.confirm(`Delete ${selectedProducts.length} selected products?`)) {
      setProducts(products.filter(p => !selectedProducts.includes(p.id)))
      setSelectedProducts([])
    }
  }

  const updateStock = async (productId, newStock) => {
    try {
      await API.put(`/products/${productId}`, { stock: newStock })
      fetchProducts() // Refresh product list
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Failed to update stock. Please try again.')
    }
  }

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${productId}`)
        fetchProducts() // Refresh product list
        alert('Product deleted successfully!')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product. Please try again.')
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const handleAddProduct = () => {
    setShowAddModal(true)
  }

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const productData = {
        name: newProduct.name,
        category: newProduct.category.toLowerCase(),
        price: parseInt(newProduct.price),
        stock: parseInt(newProduct.stock),
        rating: 4.0,
        brand: 'Sapphire',
        image: newProduct.image || 'https://via.placeholder.com/150x150?text=No+Image',
        description: `Premium ${newProduct.category.toLowerCase()} product from Sapphire Cosmetics`
      }

      console.log('Sending product data:', productData)
      const response = await API.post('/products', productData)
      console.log('Product creation response:', response.data)
      
      setNewProduct({ name: '', category: 'Face', price: '', stock: '', image: '' })
      setShowAddModal(false)
      alert('Product added successfully!')
      fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      alert(`Failed to add product: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleCancelAdd = () => {
    setNewProduct({ name: '', category: 'Face', price: '', stock: '', image: '' })
    setShowAddModal(false)
  }

  const handleEditProduct = (product) => {
    setEditProduct({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editProduct.name || !editProduct.price || !editProduct.stock) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const productData = {
        name: editProduct.name,
        category: editProduct.category.toLowerCase(),
        price: parseInt(editProduct.price),
        stock: parseInt(editProduct.stock),
        image: editProduct.image,
        description: `Premium ${editProduct.category.toLowerCase()} product from Sapphire Cosmetics`
      }

      await API.put(`/products/${editProduct.id}`, productData)
      fetchProducts() // Refresh product list
      setEditProduct({ id: null, name: '', category: 'Face', price: '', stock: '', image: '' })
      setShowEditModal(false)
      alert('Product updated successfully!')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product. Please try again.')
    }
  }

  const handleCancelEdit = () => {
    setEditProduct({ id: null, name: '', category: 'Face', price: '', stock: '', image: '' })
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
            <h1>Product Management</h1>
            <div className="header-actions">
              <button className="add-product-btn" onClick={handleAddProduct}>+ Add New Product</button>
              <Link to="/admin/dashboard" className="back-btn">← Back to Dashboard</Link>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="face">Face</option>
                <option value="eyes">Eyes</option>
                <option value="lips">Lips</option>
                <option value="skincare">Skincare</option>
              </select>
            </div>
            <div className="filter-group">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock-low">Stock: Low to High</option>
                <option value="stock-high">Stock: High to Low</option>
              </select>
            </div>
            {selectedProducts.length > 0 && (
              <button 
                className="bulk-delete-btn"
                onClick={deleteSelectedProducts}
              >
                🗑️ Delete Selected ({selectedProducts.length})
              </button>
            )}
          </div>

          {/* Products Table - Desktop */}
          <div className="admin-table-container">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading products...</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === sortedProducts.length && sortedProducts.length > 0}
                        onChange={selectAllProducts}
                      />
                    </th>
                    <th>Product ID</th>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                        No products found
                      </td>
                    </tr>
                  ) : (
                    sortedProducts.map(product => (
                      <tr key={product.id || product._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                          />
                        </td>
                        <td>#{(product.id || product._id || '').toString().slice(-3).padStart(3, '0')}</td>
                        <td>
                          <img src={product.image} alt={product.name} className="product-thumb" />
                        </td>
                        <td>{product.name}</td>
                        <td>
                          <span className="category-badge">{product.category}</span>
                        </td>
                        <td>₹{product.price}</td>
                        <td>
                          <input
                            type="number"
                            value={product.stock}
                            onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                            className="stock-input"
                            min="0"
                          />
                        </td>
                        <td>⭐ {product.rating || 4.0}</td>
                        <td>
                          <span className={`status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>
                            {product.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="action-btn edit" 
                              onClick={() => handleEditProduct(product)}
                              title="Edit Product"
                            >
                              ✏️
                            </button>
                            <button 
                              className="action-btn delete"
                              onClick={() => deleteProduct(product.id)}
                              title="Delete Product"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile Product Cards */}
          <div className="mobile-product-list">
            {sortedProducts.map(product => (
              <div key={product.id} className="mobile-product-card">
                <div className="mobile-product-header">
                  <img src={product.image} alt={product.name} className="mobile-product-image" />
                  <div className="mobile-product-info">
                    <h3 className="mobile-product-name">{product.name}</h3>
                    <p className="mobile-product-id">#{product.id.toString().padStart(3, '0')}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                  />
                </div>
                
                <div className="mobile-product-details">
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Category</span>
                    <span className="mobile-detail-value category-badge">{product.category}</span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Price</span>
                    <span className="mobile-detail-value">₹{product.price}</span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Stock</span>
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                      className="mobile-stock-input"
                      min="0"
                    />
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Rating</span>
                    <span className="mobile-detail-value">⭐ {product.rating}</span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Status</span>
                    <span className={`status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                
                <div className="mobile-product-actions">
                  <button 
                    className="mobile-action-btn edit" 
                    onClick={() => handleEditProduct(product)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="mobile-action-btn delete"
                    onClick={() => deleteProduct(product.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="table-footer">
            <p>Showing {sortedProducts.length} of {products.length} products</p>
          </div>

          {/* Add Product Modal */}
          {showAddModal && (
            <div className="modal-overlay" onClick={handleCancelAdd}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Add New Product</h3>
                  <button className="close-btn" onClick={handleCancelAdd}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Product Name *:</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category:</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="Face">Face</option>
                      <option value="Eyes">Eyes</option>
                      <option value="Lips">Lips</option>
                      <option value="Skincare">Skincare</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price *:</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="Enter price"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity *:</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="Enter stock quantity"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL:</label>
                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      placeholder="Enter image URL (optional)"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={handleCancelAdd}>Cancel</button>
                  <button className="save-btn" onClick={handleSaveProduct}>Add Product</button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {showEditModal && (
            <div className="modal-overlay" onClick={handleCancelEdit}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Edit Product</h3>
                  <button className="close-btn" onClick={handleCancelEdit}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Product Name *:</label>
                    <input
                      type="text"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category:</label>
                    <select
                      value={editProduct.category}
                      onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                    >
                      <option value="Face">Face</option>
                      <option value="Eyes">Eyes</option>
                      <option value="Lips">Lips</option>
                      <option value="Skincare">Skincare</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price *:</label>
                    <input
                      type="number"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                      placeholder="Enter price"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity *:</label>
                    <input
                      type="number"
                      value={editProduct.stock}
                      onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})}
                      placeholder="Enter stock quantity"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL:</label>
                    <input
                      type="url"
                      value={editProduct.image}
                      onChange={(e) => setEditProduct({...editProduct, image: e.target.value})}
                      placeholder="Enter image URL (optional)"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                  <button className="save-btn" onClick={handleSaveEdit}>Update Product</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}