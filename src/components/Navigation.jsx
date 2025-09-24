import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav style={{
      background: '#1E293B',
      padding: '1rem 0',
      borderBottom: '1px solid #334155',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{
            color: '#F8FAFC',
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: '700',
            letterSpacing: '-0.01em'
          }}>
            THB Operations Hub
          </Link>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <Link 
              to="/" 
              style={{
                color: '#94A3B8',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#334155'
                e.target.style.color = '#F8FAFC'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#94A3B8'
              }}
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
