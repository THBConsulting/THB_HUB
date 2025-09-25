import React, { useState, useEffect } from 'react'
import { useSharedData } from '../contexts/SharedDataContext'

const BusinessStrategy = () => {
  const { 
    projects, 
    prospects, 
    strategyGoals, 
    setStrategyGoals, 
    projectMetrics, 
    strategyScenarios 
  } = useSharedData()

  // Service definitions
  const services = [
    {
      name: "AI Infrastructure",
      price: 2000,
      maxClients: 25,
      targetClients: 20,
      avgWeeks: 2,
      color: "#6B46C1",
      hoursPerProject: 1
    },
    {
      name: "Custom AI Tools", 
      price: 3750,
      maxClients: 25,
      targetClients: 20,
      avgWeeks: 3,
      color: "#1E40AF",
      hoursPerProject: 1.5
    },
    {
      name: "AI Systems Builder",
      price: 6250,
      maxClients: 8,
      targetClients: 5,
      avgWeeks: 4,
      color: "#059669",
      hoursPerProject: 2
    },
    {
      name: "Culture Hub",
      price: 2500,
      maxClients: 10,
      targetClients: 5,
      avgWeeks: 1,
      color: "#DC2626",
      hoursPerProject: 0.5
    }
  ]

  // State management
  const [serviceTargets, setServiceTargets] = useState({
    infrastructure: 20,
    customTools: 20, 
    aiSystems: 5,
    cultureHub: 5
  })

  const [actualProgress, setActualProgress] = useState({
    infrastructure: 0,
    customTools: 0,
    aiSystems: 0, 
    cultureHub: 0
  })

  const [expandedCards, setExpandedCards] = useState({
    targetMarket: false,
    servicePortfolio: false,
    marketingStrategy: false,
    operationsApproach: false
  })

  // Calculations
  const calculateMetrics = () => {
    const totalRevenue = services.reduce((sum, service, index) => {
      const key = Object.keys(serviceTargets)[index]
      return sum + (serviceTargets[key] * service.price)
    }, 0)

    const totalClients = Object.values(serviceTargets).reduce((sum, count) => sum + count, 0)

    const weeklyHours = services.reduce((sum, service, index) => {
      const key = Object.keys(serviceTargets)[index]
      return sum + (serviceTargets[key] * service.hoursPerProject)
    }, 0)

    const monthlyProspects = totalClients * 3 / 12

    return {
      totalRevenue,
      totalClients,
      weeklyHours,
      monthlyProspects
    }
  }

  const metrics = calculateMetrics()

  const calculateProgress = (serviceIndex) => {
    const service = services[serviceIndex]
    const key = Object.keys(serviceTargets)[serviceIndex]
    const target = serviceTargets[key]
    const actual = actualProgress[key]
    return Math.min((actual / target) * 100, 100)
  }

  const toggleCard = (cardName) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardName]: !prev[cardName]
    }))
  }

  const updateServiceTarget = (serviceKey, value) => {
    setServiceTargets(prev => ({
      ...prev,
      [serviceKey]: parseInt(value)
    }))
  }

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          📊 Business Strategy
        </h1>
        
        {/* SECTION 1: BUSINESS OVERVIEW */}
        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)', fontSize: 'var(--font-size-xl)' }}>
            Business Overview
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
            {/* Target Market & Value Proposition Card */}
            <div className="card">
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => toggleCard('targetMarket')}
              >
                <h3 style={{ color: 'var(--white)', margin: 0 }}>🎯 Target Market & Value Prop</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                  {expandedCards.targetMarket ? '−' : '+'}
                </span>
              </div>
              {expandedCards.targetMarket && (
                <div style={{ marginTop: 'var(--spacing-4)' }}>
                  <div style={{ marginBottom: 'var(--spacing-3)' }}>
                    <strong style={{ color: 'var(--primary-purple)' }}>Target:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-1)' }}>
                      Small-medium businesses and nonprofits lacking AI expertise
                    </div>
                  </div>
                  <div style={{ marginBottom: 'var(--spacing-3)' }}>
                    <strong style={{ color: 'var(--primary-purple)' }}>Value Prop:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-1)' }}>
                      Practical, accessible, affordable AI solutions with immediate impact
                    </div>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--primary-purple)' }}>Focus:</strong>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-1)' }}>
                      Meeting clients wherever they are on their AI journey
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Service Portfolio Card */}
            <div className="card">
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => toggleCard('servicePortfolio')}
              >
                <h3 style={{ color: 'var(--white)', margin: 0 }}>🛠️ Service Portfolio</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                  {expandedCards.servicePortfolio ? '−' : '+'}
                </span>
              </div>
              {expandedCards.servicePortfolio && (
                <div style={{ marginTop: 'var(--spacing-4)' }}>
                  {services.map((service, index) => (
                    <div key={index} style={{ marginBottom: 'var(--spacing-3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: service.color }}>{service.name}</strong>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          ${service.price.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        {service.name === 'AI Infrastructure' && 'Audit, basic setup, roadmap'}
                        {service.name === 'Custom AI Tools' && 'Routine tasks, process automation'}
                        {service.name === 'AI Systems Builder' && 'Complex dashboards and BI tools'}
                        {service.name === 'Culture Hub' && 'Specialized hub solutions'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Marketing Strategy Card */}
            <div className="card">
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => toggleCard('marketingStrategy')}
              >
                <h3 style={{ color: 'var(--white)', margin: 0 }}>📢 Marketing Strategy</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                  {expandedCards.marketingStrategy ? '−' : '+'}
                </span>
              </div>
              {expandedCards.marketingStrategy && (
                <div style={{ marginTop: 'var(--spacing-4)' }}>
                  <div style={{ marginBottom: 'var(--spacing-2)' }}>
                    • Content marketing (blogs, videos, LinkedIn)
                  </div>
                  <div style={{ marginBottom: 'var(--spacing-2)' }}>
                    • Speaking at conferences and events
                  </div>
                  <div style={{ marginBottom: 'var(--spacing-2)' }}>
                    • Targeted outreach to SMBs and nonprofits
                  </div>
                  <div style={{ marginBottom: 'var(--spacing-2)' }}>
                    • Referral program implementation
                  </div>
                  <div>
                    • Case study development
                  </div>
                </div>
              )}
            </div>

            {/* Operations Approach Card */}
            <div className="card">
              <div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => toggleCard('operationsApproach')}
              >
                <h3 style={{ color: 'var(--white)', margin: 0 }}>⚙️ Operations Approach</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                  {expandedCards.operationsApproach ? '−' : '+'}
                </span>
              </div>
              {expandedCards.operationsApproach && (
                <div style={{ marginTop: 'var(--spacing-4)' }}>
                  <div style={{ marginBottom: 'var(--spacing-2)' }}>
                    • Standardized processes for scalability
                  </div>
                  <div style={{ marginBottom: 'var(--spacing-2)' }}>
                    • Foundation-first strategy (Infrastructure → Custom Tools → Systems)
                  </div>
                  <div>
                    • Focus on client satisfaction and upselling opportunities
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-8)' }}>
          
          {/* SECTION 2: INTERACTIVE SERVICE MODELING (Left Side) */}
          <div>
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)', fontSize: 'var(--font-size-xl)' }}>
              Interactive Service Modeling
            </h2>
            
            <div className="card">
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
                Service Mix Planner
              </h3>
              
              {/* Service Sliders */}
              {services.map((service, index) => {
                const serviceKey = Object.keys(serviceTargets)[index]
                const currentValue = serviceTargets[serviceKey]
                const progress = calculateProgress(index)
                
                return (
                  <div key={index} style={{ marginBottom: 'var(--spacing-6)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
                      <div>
                        <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>
                          {service.name}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          ${service.price.toLocaleString()} average • {service.avgWeeks} weeks
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: service.color, fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                          {currentValue}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                          clients
                        </div>
                      </div>
                    </div>
                    
                    {/* Slider */}
                    <div style={{ marginBottom: 'var(--spacing-2)' }}>
                      <input
                        type="range"
                        min="0"
                        max={service.maxClients}
                        value={currentValue}
                        onChange={(e) => updateServiceTarget(serviceKey, e.target.value)}
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: '4px',
                          background: `linear-gradient(to right, ${service.color} 0%, ${service.color} ${(currentValue / service.maxClients) * 100}%, rgba(148, 163, 184, 0.3) ${(currentValue / service.maxClients) * 100}%, rgba(148, 163, 184, 0.3) 100%)`,
                          outline: 'none',
                          cursor: 'pointer',
                          WebkitAppearance: 'none',
                          appearance: 'none'
                        }}
                      />
                    </div>
                    
                    {/* Progress Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, marginRight: 'var(--spacing-3)' }}>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          backgroundColor: 'var(--dark-black)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: service.color,
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', minWidth: '60px' }}>
                        {actualProgress[serviceKey]}/{service.targetClients}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Revenue Calculation Display */}
            <div className="card" style={{ marginTop: 'var(--spacing-6)' }}>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
                Revenue & Capacity Analysis
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                    ${metrics.totalRevenue.toLocaleString()}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Total Revenue
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                    {metrics.totalClients}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Total Clients
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    color: metrics.weeklyHours > 50 ? '#EF4444' : '#10B981', 
                    fontSize: 'var(--font-size-xl)', 
                    fontWeight: 'bold' 
                  }}>
                    {metrics.weeklyHours.toFixed(1)}h
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Weekly Hours
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                    {metrics.monthlyProspects.toFixed(1)}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Monthly Prospects
                  </div>
                </div>
              </div>
              
              {/* Capacity Warning */}
              {metrics.weeklyHours > 50 && (
                <div style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--spacing-3)',
                  marginTop: 'var(--spacing-4)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#DC2626', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
                    ⚠️ Capacity Warning: {metrics.weeklyHours.toFixed(1)} hours exceeds 50-hour limit
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: GOALS & PROGRESS TRACKING (Right Side) */}
          <div>
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)', fontSize: 'var(--font-size-xl)' }}>
              Goals & Progress Tracking
            </h2>
            
            {/* Year 1 Financial Targets */}
            <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
                Year 1 Financial Targets
              </h3>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Annual Revenue Target</span>
                  <span style={{ color: 'var(--primary-purple)', fontWeight: 'bold' }}>$150,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Target Total Clients</span>
                  <span style={{ color: 'var(--secondary-blue)', fontWeight: 'bold' }}>50</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Average Project Value</span>
                  <span style={{ color: '#10B981', fontWeight: 'bold' }}>$3,000</span>
                </div>
              </div>
            </div>

            {/* Service-Specific Goals */}
            <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
                Service-Specific Goals
              </h3>
              
              {services.map((service, index) => {
                const serviceKey = Object.keys(serviceTargets)[index]
                const target = serviceTargets[serviceKey]
                const actual = actualProgress[serviceKey]
                const progress = calculateProgress(index)
                
                return (
                  <div key={index} style={{ marginBottom: 'var(--spacing-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
                      <span style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)' }}>
                        {service.name}
                      </span>
                      <span style={{ color: service.color, fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>
                        {actual}/{target}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'var(--dark-black)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: service.color,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Key Metrics Dashboard */}
            <div className="card">
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
                Key Metrics Dashboard
              </h3>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Revenue</span>
                  <span style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>
                    ${metrics.totalRevenue.toLocaleString()} / $150,000
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Clients Acquired</span>
                  <span style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>
                    {metrics.totalClients} / 50
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Average Project Value</span>
                  <span style={{ color: '#10B981', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>
                    ${metrics.totalClients > 0 ? (metrics.totalRevenue / metrics.totalClients).toFixed(0) : '0'} / $3,000
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Pipeline Health</span>
                  <span style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: 'bold' }}>
                    {prospects.length} prospects
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessStrategy
