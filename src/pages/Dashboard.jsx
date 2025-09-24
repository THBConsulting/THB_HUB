import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const modules = [
    {
      id: 'pricing-sow',
      title: 'Pricing & SOW Tool',
      description: 'AI-powered pricing for automation/hub projects',
      icon: '💰',
      gradient: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)',
      path: '/pricing-sow',
      metric: '12 Active Quotes',
      status: 'active',
      trend: '+15%'
    },
    {
      id: 'project-pipeline',
      title: 'Project Pipeline',
      description: 'Client project tracking and revenue management',
      icon: '📈',
      gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
      path: '/project-pipeline',
      metric: '$45K Pipeline',
      status: 'active',
      trend: '+8%'
    },
    {
      id: 'business-strategy',
      title: 'Business Strategy',
      description: 'Goals, targets, and financial modeling with interactive sliders',
      icon: '🎯',
      gradient: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)',
      path: '/business-strategy',
      metric: '85% Goal Progress',
      status: 'on-track',
      trend: '+12%'
    },
    {
      id: 'monthly-expenses',
      title: 'Monthly Expenses',
      description: 'Expense tracking and invoice management',
      icon: '📊',
      gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
      path: '/monthly-expenses',
      metric: '$8.2K This Month',
      status: 'active',
      trend: '-3%'
    },
    {
      id: 'action-items',
      title: 'Action Items',
      description: 'AI-extracted tasks from personal and business emails',
      icon: '✅',
      gradient: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)',
      path: '/action-items',
      metric: '23 Pending',
      status: 'attention',
      trend: '+5%'
    },
    {
      id: 'speaking-opportunities',
      title: 'Speaking Opportunities',
      description: 'Research tool for nonprofit conferences and training',
      icon: '🎤',
      gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
      path: '/speaking-opportunities',
      metric: '5 Upcoming',
      status: 'active',
      trend: '+20%'
    },
    {
      id: 'ai-tools-research',
      title: 'AI Tools Research',
      description: 'Latest AI automation tools and insights',
      icon: '🤖',
      gradient: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)',
      path: '/ai-tools-research',
      metric: '47 Tools Tracked',
      status: 'active',
      trend: '+25%'
    },
    {
      id: 'calendar-overview',
      title: 'Calendar Overview',
      description: 'Google Calendar integration for upcoming events',
      icon: '📅',
      gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
      path: '/calendar-overview',
      metric: '12 Events Today',
      status: 'active',
      trend: '+10%'
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
    <div style={{ 
      padding: 'var(--spacing-6)', 
      backgroundColor: 'var(--dark-black)', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
    }}>
      <div className="container" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Modern Header Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 'var(--spacing-10)',
          padding: 'var(--spacing-8) 0'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #A855F7 0%, #60A5FA 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: 'var(--spacing-4)',
            letterSpacing: '-0.02em'
          }}>
            THB Operations Hub
          </div>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.25rem',
            fontWeight: '400',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Your comprehensive business management dashboard
          </p>
        </div>

        {/* Enhanced Quick Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--spacing-6)',
          marginBottom: 'var(--spacing-10)'
        }}>
          {[
            { label: 'Total Pipeline', value: '$45K', trend: '+12%', color: 'var(--primary-purple)', icon: '📈' },
            { label: 'Active Projects', value: '12', trend: '+8%', color: 'var(--secondary-blue)', icon: '🚀' },
            { label: 'Pending Actions', value: '23', trend: '+5%', color: 'var(--primary-purple)', icon: '✅' },
            { label: 'Goal Progress', value: '85%', trend: '+15%', color: 'var(--secondary-blue)', icon: '🎯' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--spacing-6)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '100px',
                height: '100px',
                background: `linear-gradient(135deg, ${stat.color}20, transparent)`,
                borderRadius: '50%',
                transform: 'translate(30px, -30px)'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-md)'
                }}>
                  {stat.trend}
                </div>
              </div>
              <h3 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                color: stat.color,
                margin: '0 0 var(--spacing-2) 0',
                lineHeight: '1'
              }}>
                {stat.value}
              </h3>
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem',
                fontWeight: '500',
                margin: 0
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Modern Module Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 'var(--spacing-6)',
          maxWidth: '1600px',
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
              <div style={{
                background: 'rgba(30, 41, 59, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--spacing-6)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: '280px',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.1)'
              }}
              >
                {/* Gradient Background */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '4px',
                  background: module.gradient
                }} />

                {/* Status Indicator */}
                <div style={{
                  position: 'absolute',
                  top: 'var(--spacing-4)',
                  right: 'var(--spacing-4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    {module.trend}
                  </div>
                  <div style={{
                    color: getStatusColor(module.status),
                    fontSize: 'var(--font-size-lg)'
                  }}>
                    {getStatusIcon(module.status)}
                  </div>
                </div>

                {/* Icon */}
                <div style={{
                  fontSize: '3rem',
                  marginBottom: 'var(--spacing-4)',
                  textAlign: 'center',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                }}>
                  {module.icon}
                </div>

                {/* Title */}
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--white)',
                  marginBottom: 'var(--spacing-3)',
                  lineHeight: '1.3'
                }}>
                  {module.title}
                </h3>

                {/* Description */}
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  margin: '0 0 var(--spacing-4) 0',
                  flex: '1'
                }}>
                  {module.description}
                </p>

                {/* Metric Card */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  textAlign: 'center'
                }}>
                  <span style={{ 
                    fontSize: '1rem',
                    fontWeight: '700',
                    color: 'var(--white)',
                    letterSpacing: '0.025em'
                  }}>
                    {module.metric}
                  </span>
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
