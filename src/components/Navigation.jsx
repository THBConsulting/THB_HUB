import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav style={{
      backgroundColor: 'var(--card-bg)',
      padding: 'var(--spacing-4) 0',
      boxShadow: 'var(--shadow-md)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{
            color: 'var(--text-primary)',
            textDecoration: 'none',
            fontSize: 'var(--font-size-2xl)',
            fontWeight: '700'
          }}>
            THB Operations Hub
          </Link>
          
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-6)',
            alignItems: 'center'
          }}>
            <Link 
              to="/" 
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: 'var(--spacing-2) var(--spacing-4)',
                borderRadius: 'var(--radius-md)',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(148, 163, 184, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
