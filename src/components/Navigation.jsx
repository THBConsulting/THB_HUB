import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: 'var(--spacing-4) 0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{
            background: 'linear-gradient(135deg, #A855F7 0%, #60A5FA 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            fontSize: 'var(--font-size-2xl)',
            fontWeight: '800',
            letterSpacing: '-0.01em'
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
                padding: 'var(--spacing-3) var(--spacing-5)',
                borderRadius: 'var(--radius-lg)',
                transition: 'all 0.2s ease',
                fontWeight: '500',
                fontSize: 'var(--font-size-sm)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.1)'
                e.target.style.color = 'var(--primary-purple)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = 'var(--text-secondary)'
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
