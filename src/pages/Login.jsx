import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

export default function Login(){
  const [mode, setMode] = useState('login')
  const [userType, setUserType] = useState('user')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const content = {
    user: {
      login: {
        title: "Welcome Back, Beauty Lover!",
        subtitle: "Discover your perfect look with Sapphire",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop"
      },
      signup: {
        title: "Join Our Beauty Community",
        subtitle: "Start your glamorous journey with us",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=800&fit=crop"
      },
      forgot: {
        title: "Reset Your Password",
        subtitle: "We'll help you get back to beauty",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=800&fit=crop"
      }
    },
    admin: {
      login: {
        title: "Admin Portal Access",
        subtitle: "Manage your beauty empire",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=800&fit=crop"
      },
      signup: {
        title: "Admin Registration",
        subtitle: "Create your admin account",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=800&fit=crop"
      },
      forgot: {
        title: "Admin Password Reset",
        subtitle: "Secure admin account recovery",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=800&fit=crop"
      }
    }
  }

  async function handleLogin(){
    try {
      const endpoint = userType === 'admin' ? '/admin/login' : '/auth/login'
      
      const res = await API.post(endpoint, {
        email: formData.email,
        password: formData.password
      })

      localStorage.setItem('token', res.data.token)
      const userData = res.data.admin || res.data.user
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('role', userData.role)
      
      window.location.href = userData.role === 'admin' ? '/admin/dashboard' : '/products'
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed')
    }
  }

  async function handleSignup(){
    try {
      console.log('Signup attempt:', { userType, formData })
      const endpoint = userType === 'admin' ? '/admin/signup' : '/auth/register'
      
      const response = await API.post(endpoint, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      console.log('Signup success:', response.data)
      alert('Account created successfully! Please login.')
      setMode('login')
      setFormData({ name: '', email: '', password: '' })
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Signup failed'
      alert(errorMessage)
    }
  }

  function handleForgot(){
    if (formData.email) {
      alert('Password reset link sent to ' + formData.email)
      setMode('login')
    } else {
      alert('Please enter your email')
    }
  }

  const currentContent = content[userType][mode] || content.user.login

  return (
    <div className="enhanced-login-wrapper">
      <div className="login-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="login-container-main">
        {/* Left Side - Image & Branding */}
        <div className="login-visual-side">
          <div className="brand-section">
            <h1 className="brand-logo">SAPPHIRE COSMETICS</h1>
            <p className="brand-tagline">✨ Discover Your Natural Beauty ✨</p>
          </div>
          
          <div className="image-section">
            <img src={currentContent.image} alt="Beauty" className="hero-image" />
            <div className="image-content">
              <h2 className="image-title">"Beauty begins the moment you decide to be yourself"</h2>
              <p className="image-subtitle">{currentContent.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-side">
          <div className="form-container">
            <div className="right-login-card">
              {mode === 'login' && (
                <>
                  <div className="card-header">
                    <h1 className="welcome-title">Welcome Back, Beauty!</h1>
                    <p className="welcome-subtitle">Sign in to continue your beauty journey</p>
                  </div>
                  
                  <div className="login-as-section">
                    <p className="login-as-label">Login as</p>
                    <div className="role-pills">
                      <label className={`role-pill ${userType === 'user' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="userType" 
                          value="user" 
                          checked={userType === 'user'}
                          onChange={() => setUserType('user')}
                        />
                        <span className="pill-icon">👤</span>
                        <span className="pill-text">User</span>
                      </label>
                      <label className={`role-pill ${userType === 'admin' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="userType" 
                          value="admin" 
                          checked={userType === 'admin'}
                          onChange={() => setUserType('admin')}
                        />
                        <span className="pill-icon">👨💼</span>
                        <span className="pill-text">Admin</span>
                      </label>
                    </div>
                  </div>

                  <form onSubmit={(e) => {e.preventDefault(); handleLogin()}} className="right-form">
                    <div className="form-field">
                      <input 
                        type="email" 
                        id="email" 
                        placeholder="Email Address" 
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>

                    <div className="form-field">
                      <div className="password-field">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          id="password" 
                          placeholder="Password" 
                          className="form-input"
                          value={formData.password}
                          onChange={handleChange}
                          required 
                        />
                        <button 
                          type="button" 
                          className="eye-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          👁️
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="signin-btn">
                      Sign In ✨
                    </button>
                  </form>

                  <div className="bottom-links">
                    <button className="text-link" onClick={() => setMode('signup')}>
                      Create Account
                    </button>
                    <button className="text-link" onClick={() => setMode('forgot')}>
                      Forgot Password?
                    </button>
                  </div>
                </>
              )}

              {mode === 'signup' && (
                <>
                  <div className="card-header">
                    <h1 className="welcome-title">Create Account</h1>
                    <p className="welcome-subtitle">Join us and start your beauty journey</p>
                  </div>
                  
                  <div className="login-as-section">
                    <p className="login-as-label">Register as</p>
                    <div className="role-pills">
                      <label className={`role-pill ${userType === 'user' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="userType" 
                          value="user" 
                          checked={userType === 'user'}
                          onChange={() => setUserType('user')}
                        />
                        <span className="pill-icon">👤</span>
                        <span className="pill-text">User</span>
                      </label>
                      <label className={`role-pill ${userType === 'admin' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="userType" 
                          value="admin" 
                          checked={userType === 'admin'}
                          onChange={() => setUserType('admin')}
                        />
                        <span className="pill-icon">👨💼</span>
                        <span className="pill-text">Admin</span>
                      </label>
                    </div>
                  </div>

                  <form onSubmit={(e) => {e.preventDefault(); handleSignup()}} className="right-form">
                    <div className="form-field">
                      <input 
                        type="text" 
                        id="name" 
                        placeholder="Full Name" 
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        required 
                      />
                    </div>

                    <div className="form-field">
                      <input 
                        type="email" 
                        id="email" 
                        placeholder="Email Address" 
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>

                    <div className="form-field">
                      <div className="password-field">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          id="password" 
                          placeholder="Password" 
                          className="form-input"
                          value={formData.password}
                          onChange={handleChange}
                          required 
                        />
                        <button 
                          type="button" 
                          className="eye-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          👁️
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="signin-btn">
                      Create Account ✨
                    </button>
                  </form>

                  <div className="bottom-links">
                    <button className="text-link" onClick={() => setMode('login')}>
                      Already have an account? Sign In
                    </button>
                  </div>
                </>
              )}

              {mode === 'forgot' && (
                <>
                  <div className="card-header">
                    <h1 className="welcome-title">Reset Password</h1>
                    <p className="welcome-subtitle">Enter your email to receive reset link</p>
                  </div>

                  <form onSubmit={(e) => {e.preventDefault(); handleForgot()}} className="right-form">
                    <div className="form-field">
                      <input 
                        type="email" 
                        id="email" 
                        placeholder="Email Address" 
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>

                    <button type="submit" className="signin-btn">
                      Send Reset Link ✨
                    </button>
                  </form>

                  <div className="bottom-links">
                    <button className="text-link" onClick={() => setMode('login')}>
                      Back to Login
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
