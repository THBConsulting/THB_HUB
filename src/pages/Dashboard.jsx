import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const modules = [
    {
      id: 'pricing-sow',
      title: 'Pricing & SOW Tool',
      description: 'AI-powered pricing for automation/hub projects',
      icon: '💰',
      color: 'var(--primary-purple)',
      path: '/pricing-sow',
      metric: '12 Active Quotes',
      status: 'active'
    },
    {
      id: 'project-pipeline',
      title: 'Project Pipeline',
      description: 'Client project tracking and revenue management',
      icon: '📈',
      color: 'var(--secondary-blue)',
      path: '/project-pipeline',
      metric: '$45K Pipeline',
      status: 'active'
    },
    {
      id: 'business-strategy',
      title: 'Business Strategy',
      description: 'Goals, targets, and financial modeling with interactive sliders',
      icon: '🎯',
      color: 'var(--primary-purple)',
      path: '/business-strategy',
      metric: '85% Goal Progress',
      status: 'on-track'
    },
    {
      id: 'monthly-expenses',
      title: 'Monthly Expenses',
      description: 'Expense tracking and invoice management',
      icon: '📊',
      color: 'var(--secondary-blue)',
      path: '/monthly-expenses',
      metric: '$8.2K This Month',
      status: 'active'
    },
    {
      id: 'action-items',
      title: 'Action Items',
      description: 'AI-extracted tasks from personal and business emails',
      icon: '✅',
      color: 'var(--primary-purple)',
      path: '/action-items',
      metric: '23 Pending',
      status: 'attention'
    },
    {
      id: 'speaking-opportunities',
      title: 'Speaking Opportunities',
      description: 'Research tool for nonprofit conferences and training',
      icon: '🎤',
      color: 'var(--secondary-blue)',
      path: '/speaking-opportunities',
      metric: '5 Upcoming',
      status: 'active'
    },
    {
      id: 'ai-tools-research',
      title: 'AI Tools Research',
      description: 'Latest AI automation tools and insights',
      icon: '🤖',
      color: 'var(--primary-purple)',
      path: '/ai-tools-research',
      metric: '47 Tools Tracked',
      status: 'active'
    },
    {
      id: 'calendar-overview',
      title: 'Calendar Overview',
      description: 'Google Calendar integration for upcoming events',
      icon: '📅',
      color: 'var(--secondary-blue)',
      path: '/calendar-overview',
      metric: '12 Events Today',
      status: 'active'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981'
      case 'on-track': return '#3B82F6'
      case 'attention': return '#F59E0B'
      case 'warning': return '#EF4444'
      default: return 'var(--medium-grey)'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '●'
      case 'on-track': return '●'
      case 'attention': return '●'
      case 'warning': return '●'
      default: return '●'
    }
  }

  return (
    <div style={{ padding: 'var(--spacing-8) 0', backgroundColor: 'var(--dark-black)', minHeight: '100vh' }}>
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            THB Operations Hub
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Your comprehensive business management dashboard
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-6)',
          marginBottom: 'var(--spacing-8)'
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--primary-purple)' }}>$45K</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Total Pipeline</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--secondary-blue)' }}>12</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Active Projects</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--primary-purple)' }}>23</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Pending Actions</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 className="text-2xl font-bold" style={{ color: 'var(--secondary-blue)' }}>85%</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Goal Progress</p>
          </div>
        </div>

        {/* Module Grid - 2x4 Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--spacing-6)',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {modules.map((module) => (
            <Link
              key={module.id}
              to={module.path}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div className="card" style={{
                height: '240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                border: `2px solid transparent`,
                transition: 'all 0.3s ease',
                position: 'relative',
                padding: 'var(--spacing-6)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = module.color
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              }}
              >
                {/* Status Indicator */}
                <div style={{
                  position: 'absolute',
                  top: 'var(--spacing-3)',
                  right: 'var(--spacing-3)',
                  color: getStatusColor(module.status),
                  fontSize: 'var(--font-size-lg)'
                }}>
                  {getStatusIcon(module.status)}
                </div>

                {/* Top Section - Icon and Title */}
                <div style={{ flex: '0 0 auto' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: 'var(--spacing-3)',
                    textAlign: 'center'
                  }}>
                    {module.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--white)' }}>
                    {module.title}
                  </h3>
                </div>

                {/* Middle Section - Description */}
                <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center' }}>
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: 'var(--font-size-sm)',
                    lineHeight: '1.4',
                    margin: 0
                  }}>
                    {module.description}
                  </p>
                </div>

                {/* Bottom Section - Metric Card */}
                <div style={{ flex: '0 0 auto' }}>
                  <div style={{
                    backgroundColor: 'var(--white)',
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    marginTop: 'var(--spacing-3)'
                  }}>
                    <span style={{ 
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: '600',
                      color: 'var(--dark-black)'
                    }}>
                      {module.metric}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
