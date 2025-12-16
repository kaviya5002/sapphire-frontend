import React from 'react';

export default function DebugAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Auth Debug Info:</h4>
      <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
      <p><strong>User Data:</strong> {user || 'Missing'}</p>
      <p><strong>Parsed User:</strong> {parsedUser ? JSON.stringify(parsedUser, null, 2) : 'None'}</p>
      <p><strong>User Role:</strong> {parsedUser?.role || 'None'}</p>
    </div>
  );
}