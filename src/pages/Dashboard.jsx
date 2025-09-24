import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const modules = [
    {
      id: 'pricing-sow',
      title: 'Pricing & SOW Tool',
      description: 'AI-powered pricing for automation/hub projects',
      icon: '💰',
      path: '/pricing-sow',
      metric: '12 Active Quotes',
      status: 'active',
      priority: 'high'
    },
    {
      id: 'project-pipeline',
      title: 'Project Pipeline',
      description: 'Client project tracking and revenue management',
      icon: '📈',
      path: '/project-pipeline',
      metric: '$45K Pipeline',
      status: 'active',
      priority: 'high'
    },
    {
      id: 'business-strategy',
      title: 'Business Strategy',
      description: 'Goals, targets, and financial modeling with interactive sliders',
      icon: '🎯',
      path: '/business-strategy',
      metric: '85% Goal Progress',
      status: 'on-track',
      priority: 'medium'
    },
    {
      id: 'monthly-expenses',
      title: 'Monthly Expenses',
      description: 'Expense tracking and invoice management',
      icon: '📊',
      path: '/monthly-expenses',
      metric: '$8.2K This Month',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 'action-items',
      title: 'Action Items',
      description: 'AI-extracted tasks from personal and business emails',
      icon: '✅',
      path: '/action-items',
      metric: '23 Pending',
      status: 'attention',
      priority: 'high'
    },
    {
      id: 'speaking-opportunities',
      title: 'Speaking Opportunities',
      description: 'Research tool for nonprofit conferences and training',
      icon: '🎤',
      path: '/speaking-opportunities',
      metric: '5 Upcoming',
      status: 'active',
      priority: 'low'
    },
    {
      id: 'ai-tools-research',
      title: 'AI Tools Research',
      description: 'Latest AI automation tools and insights',
      icon: '🤖',
      path: '/ai-tools-research',
      metric: '47 Tools Tracked',
      status: 'active',
      priority: 'low'
    },
    {
      id: 'calendar-overview',
      title: 'Calendar Overview',
      description: 'Google Calendar integration for upcoming events',
      icon: '📅',
      path: '/calendar-overview',
      metric: '12 Events Today',
      status: 'active',
      priority: 'medium'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10B981'
      case 'on-track': return '#3B82F6'
      case 'attention': return '#F59E0B'
      case 'warning': return '#EF4444'
      default: return '#94A3B8'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444'
      case 'medium': return '#F59E0B'
      case 'low': return '#10B981'
      default: return '#94A3B8'
    }
  }

  return (
    <div style={{ 
      backgroundColor: '#0F172A',
      minHeight: '100vh',
      padding: '0'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #334155'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '900',
          color: '#F8FAFC',
          margin: '0 0 1rem 0',
          letterSpacing: '-0.02em'
        }}>
          THB Operations Hub
        </h1>
        <p style={{
          fontSize: '1.5rem',
          color: '#94A3B8',
          margin: '0',
          fontWeight: '400'
        }}>
          Business Management Dashboard
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Key Metrics Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          padding: '1.5rem',
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          border: '1px solid #334155'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#A855F7', marginBottom: '0.5rem' }}>$45K</div>
            <div style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: '500' }}>Total Pipeline</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#60A5FA', marginBottom: '0.5rem' }}>12</div>
            <div style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: '500' }}>Active Projects</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#F59E0B', marginBottom: '0.5rem' }}>23</div>
            <div style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: '500' }}>Pending Actions</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10B981', marginBottom: '0.5rem' }}>85%</div>
            <div style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: '500' }}>Goal Progress</div>
          </div>
        </div>

        {/* Modules Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#F8FAFC',
            marginBottom: '1.5rem',
            borderBottom: '2px solid #A855F7',
            paddingBottom: '0.5rem',
            display: 'inline-block'
          }}>
            Operations Modules
          </h2>
        </div>

        {/* Modules Grid - Clean List Style */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {modules.map((module, index) => (
            <Link
              key={module.id}
              to={module.path}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1.5rem',
                backgroundColor: '#1E293B',
                borderRadius: '8px',
                border: '1px solid #334155',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#334155'
                e.currentTarget.style.borderColor = '#A855F7'
                e.currentTarget.style.transform = 'translateX(8px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B'
                e.currentTarget.style.borderColor = '#334155'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
              >
                
                {/* Module Number */}
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#A855F7',
                  marginRight: '1.5rem',
                  minWidth: '3rem',
                  textAlign: 'center'
                }}>
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div style={{
                  fontSize: '2rem',
                  marginRight: '1.5rem',
                  minWidth: '3rem',
                  textAlign: 'center'
                }}>
                  {module.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#F8FAFC',
                      margin: '0',
                      marginRight: '1rem'
                    }}>
                      {module.title}
                    </h3>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: getPriorityColor(module.priority),
                      backgroundColor: `${getPriorityColor(module.priority)}20`,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {module.priority}
                    </div>
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#94A3B8',
                    margin: '0',
                    lineHeight: '1.4'
                  }}>
                    {module.description}
                  </p>
                </div>

                {/* Status and Metric */}
                <div style={{ textAlign: 'right', minWidth: '200px' }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#F8FAFC',
                    marginBottom: '0.25rem'
                  }}>
                    {module.metric}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: getStatusColor(module.status),
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {module.status.replace('-', ' ')}
                  </div>
                </div>

                {/* Arrow */}
                <div style={{
                  fontSize: '1.5rem',
                  color: '#94A3B8',
                  marginLeft: '1rem'
                }}>
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          border: '1px solid #334155',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#94A3B8',
            margin: '0'
          }}>
            Last updated: {new Date().toLocaleDateString()} • All systems operational
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
