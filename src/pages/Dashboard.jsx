import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Import module components
import PricingSOW from './PricingSOW'
import ProjectPipeline from './ProjectPipeline'
import BusinessStrategy from './BusinessStrategy'
import MonthlyExpenses from './MonthlyExpenses'
import ActionItems from './ActionItems'
import SpeakingOpportunities from './SpeakingOpportunities'
import AIToolsResearch from './AIToolsResearch'
import CalendarOverview from './CalendarOverview'

const Dashboard = () => {
  const location = useLocation()
  
  const modules = [
    {
      id: 'pricing-sow',
      title: 'Pricing & SOW Tool',
      description: 'AI-powered pricing for automation/hub projects',
      icon: '💰',
      path: '/pricing-sow',
      metric: '12 Active Quotes',
      status: 'active',
      priority: 'high',
      component: PricingSOW
    },
    {
      id: 'project-pipeline',
      title: 'Project Pipeline',
      description: 'Client project tracking and revenue management',
      icon: '📈',
      path: '/project-pipeline',
      metric: '$45K Pipeline',
      status: 'active',
      priority: 'high',
      component: ProjectPipeline
    },
    {
      id: 'business-strategy',
      title: 'Business Strategy',
      description: 'Goals, targets, and financial modeling with interactive sliders',
      icon: '🎯',
      path: '/business-strategy',
      metric: '85% Goal Progress',
      status: 'on-track',
      priority: 'medium',
      component: BusinessStrategy
    },
    {
      id: 'monthly-expenses',
      title: 'Monthly Expenses',
      description: 'Expense tracking and invoice management',
      icon: '📊',
      path: '/monthly-expenses',
      metric: '$8.2K This Month',
      status: 'active',
      priority: 'medium',
      component: MonthlyExpenses
    },
    {
      id: 'action-items',
      title: 'Action Items',
      description: 'AI-extracted tasks from personal and business emails',
      icon: '✅',
      path: '/action-items',
      metric: '23 Pending',
      status: 'attention',
      priority: 'high',
      component: ActionItems
    },
    {
      id: 'speaking-opportunities',
      title: 'Speaking Opportunities',
      description: 'Research tool for nonprofit conferences and training',
      icon: '🎤',
      path: '/speaking-opportunities',
      metric: '5 Upcoming',
      status: 'active',
      priority: 'low',
      component: SpeakingOpportunities
    },
    {
      id: 'ai-tools-research',
      title: 'AI Tools Research',
      description: 'Latest AI automation tools and insights',
      icon: '🤖',
      path: '/ai-tools-research',
      metric: '47 Tools Tracked',
      status: 'active',
      priority: 'low',
      component: AIToolsResearch
    },
    {
      id: 'calendar-overview',
      title: 'Calendar Overview',
      description: 'Google Calendar integration for upcoming events',
      icon: '📅',
      path: '/calendar-overview',
      metric: '12 Events Today',
      status: 'active',
      priority: 'medium',
      component: CalendarOverview
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

  const isActive = (path) => location.pathname === path

  return (
    <div style={{ 
      display: 'flex',
      height: '100vh',
      backgroundColor: '#0F172A'
    }}>
      
      {/* Left Sidebar */}
      <div style={{
        width: '320px',
        backgroundColor: '#1E293B',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        
        {/* Sidebar Header */}
        <div style={{
          padding: '2rem 1.5rem',
          borderBottom: '1px solid #334155',
          backgroundColor: '#0F172A'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#F8FAFC',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.01em'
          }}>
            THB Operations Hub
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#94A3B8',
            margin: '0'
          }}>
            Business Management Dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#A855F7' }}>$45K</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Pipeline</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#60A5FA' }}>12</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Projects</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#F59E0B' }}>23</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Actions</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10B981' }}>85%</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Progress</div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div style={{ flex: 1, padding: '1rem 0' }}>
          <div style={{
            padding: '0 1rem 1rem 1rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Operations Modules
          </div>
          
          {modules.map((module, index) => (
            <Link
              key={module.id}
              to={module.path}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                margin: '0.25rem 1rem',
                borderRadius: '8px',
                backgroundColor: isActive(module.path) ? '#334155' : 'transparent',
                border: isActive(module.path) ? '1px solid #A855F7' : '1px solid transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isActive(module.path)) {
                  e.currentTarget.style.backgroundColor = '#334155'
                  e.currentTarget.style.borderColor = '#475569'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(module.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }
              }}
              >
                
                {/* Icon */}
                <div style={{
                  fontSize: '1.25rem',
                  marginRight: '0.75rem',
                  minWidth: '1.5rem',
                  textAlign: 'center'
                }}>
                  {module.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: isActive(module.path) ? '#F8FAFC' : '#E2E8F0',
                    marginBottom: '0.25rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {module.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#94A3B8',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {module.metric}
                  </div>
                </div>

                {/* Status Indicator */}
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(module.status),
                  marginLeft: '0.5rem',
                  flexShrink: 0
                }} />
              </div>
            </Link>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #334155',
          backgroundColor: '#0F172A'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#94A3B8',
            textAlign: 'center'
          }}>
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Right Main Content Area */}
      <div style={{
        flex: 1,
        backgroundColor: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Main Content Header */}
        <div style={{
          padding: '2rem 2rem 1rem 2rem',
          borderBottom: '1px solid #334155',
          backgroundColor: '#1E293B'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#F8FAFC',
            margin: '0 0 0.5rem 0'
          }}>
            {modules.find(m => m.path === location.pathname)?.title || 'Dashboard Overview'}
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#94A3B8',
            margin: '0'
          }}>
            {modules.find(m => m.path === location.pathname)?.description || 'Select a module from the sidebar to get started'}
          </p>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          padding: '2rem',
          overflowY: 'auto'
        }}>
          {location.pathname === '/' ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}>
                🚀
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#F8FAFC',
                marginBottom: '0.5rem'
              }}>
                Welcome to THB Operations Hub
              </h3>
              <p style={{
                fontSize: '1rem',
                color: '#94A3B8',
                maxWidth: '400px',
                lineHeight: '1.5'
              }}>
                Select any module from the sidebar to start managing your business operations. Each module is designed to streamline your workflow and provide actionable insights.
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid #334155',
              minHeight: '400px'
            }}>
              {(() => {
                const currentModule = modules.find(m => m.path === location.pathname)
                if (currentModule && currentModule.component) {
                  const ModuleComponent = currentModule.component
                  return <ModuleComponent />
                }
                return (
                  <div style={{
                    fontSize: '1rem',
                    color: '#94A3B8',
                    textAlign: 'center',
                    padding: '2rem'
                  }}>
                    Module content will be loaded here. The individual module pages will be displayed in this area.
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
