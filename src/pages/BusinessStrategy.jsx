import React, { useState, useEffect } from 'react'

const BusinessStrategy = () => {
  const [scenario, setScenario] = useState('realistic') // 'conservative', 'realistic', 'optimistic'
  const [timeframe, setTimeframe] = useState('annual') // 'monthly', 'quarterly', 'annual'
  
  const [goals, setGoals] = useState({
    annualRevenue: 500000,
    enterpriseClients: 8,
    smallProjects: 25,
    avgEnterpriseValue: 75000,
    avgSmallProjectValue: 25000,
    newServiceOfferings: 3,
    marketExpansion: 2,
    personalDevelopment: 5
  })

  const [actuals, setActuals] = useState({
    currentRevenue: 182000, // From project pipeline
    currentEnterpriseClients: 2,
    currentSmallProjects: 3,
    completedServiceOfferings: 1,
    completedMarketExpansion: 0,
    completedPersonalDevelopment: 2
  })

  const [scenarios, setScenarios] = useState({
    conservative: {
      enterpriseClients: 6,
      smallProjects: 20,
      avgEnterpriseValue: 65000,
      avgSmallProjectValue: 22000,
      probability: 0.7
    },
    realistic: {
      enterpriseClients: 8,
      smallProjects: 25,
      avgEnterpriseValue: 75000,
      avgSmallProjectValue: 25000,
      probability: 0.8
    },
    optimistic: {
      enterpriseClients: 12,
      smallProjects: 35,
      avgEnterpriseValue: 85000,
      avgSmallProjectValue: 28000,
      probability: 0.6
    }
  })

  const calculateProjections = () => {
    const currentScenario = scenarios[scenario]
    const months = timeframe === 'monthly' ? 1 : timeframe === 'quarterly' ? 3 : 12
    
    const enterpriseRevenue = currentScenario.enterpriseClients * currentScenario.avgEnterpriseValue
    const smallProjectRevenue = currentScenario.smallProjects * currentScenario.avgSmallProjectValue
    const totalRevenue = enterpriseRevenue + smallProjectRevenue
    
    return {
      enterpriseRevenue: enterpriseRevenue / months,
      smallProjectRevenue: smallProjectRevenue / months,
      totalRevenue: totalRevenue / months,
      annualRevenue: totalRevenue,
      enterpriseClients: currentScenario.enterpriseClients,
      smallProjects: currentScenario.smallProjects
    }
  }

  const projections = calculateProjections()

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  const getRevenueProgress = () => {
    return getProgressPercentage(actuals.currentRevenue, goals.annualRevenue)
  }

  const getClientProgress = () => {
    const enterpriseProgress = getProgressPercentage(actuals.currentEnterpriseClients, goals.enterpriseClients)
    const smallProjectProgress = getProgressPercentage(actuals.currentSmallProjects, goals.smallProjects)
    return { enterpriseProgress, smallProjectProgress }
  }

  const clientProgress = getClientProgress()

  const updateGoal = (key, value) => {
    setGoals(prev => ({ ...prev, [key]: value }))
  }

  const updateScenario = (scenarioKey, key, value) => {
    setScenarios(prev => ({
      ...prev,
      [scenarioKey]: {
        ...prev[scenarioKey],
        [key]: value
      }
    }))
  }

  const Slider = ({ label, value, min, max, step, onChange, suffix = '', color = 'var(--primary-purple)' }) => (
    <div style={{ marginBottom: 'var(--spacing-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
          {label}
        </label>
        <span style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
          {value.toLocaleString()}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(148, 163, 184, 0.3) ${((value - min) / (max - min)) * 100}%, rgba(148, 163, 184, 0.3) 100%)`,
          outline: 'none',
          cursor: 'pointer'
        }}
      />
    </div>
  )

  const ProgressBar = ({ label, current, target, color = 'var(--primary-purple)' }) => {
    const percentage = getProgressPercentage(current, target)
    return (
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{label}</span>
          <span style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
            {current} / {target}
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'rgba(148, 163, 184, 0.2)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-1)' }}>
          {percentage.toFixed(1)}% complete
        </div>
      </div>
    )
  }

  const Chart = ({ data, title, color = 'var(--primary-purple)' }) => {
    const maxValue = Math.max(...data.map(d => d.value))
    
    return (
      <div className="card">
        <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'end', gap: 'var(--spacing-2)', height: '200px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                height: `${(item.value / maxValue) * 180}px`,
                backgroundColor: color,
                borderRadius: '4px 4px 0 0',
                marginBottom: 'var(--spacing-2)',
                transition: 'height 0.3s ease'
              }} />
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', textAlign: 'center' }}>
                {item.label}
              </div>
              <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-xs)', fontWeight: '600', marginTop: 'var(--spacing-1)' }}>
                ${item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          🎯 Business Strategy
        </h1>

        {/* Scenario and Timeframe Controls */}
        <div style={{ display: 'flex', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Scenario Planning</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {Object.keys(scenarios).map(scenarioKey => (
                <button
                  key={scenarioKey}
                  onClick={() => setScenario(scenarioKey)}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    backgroundColor: scenario === scenarioKey ? 'var(--primary-purple)' : 'transparent',
                    color: scenario === scenarioKey ? 'var(--white)' : 'var(--text-secondary)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: 'var(--font-size-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {scenarioKey}
                </button>
              ))}
            </div>
          </div>
          
          <div className="card" style={{ flex: 1 }}>
            <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Timeframe</h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['monthly', 'quarterly', 'annual'].map(timeframeKey => (
                <button
                  key={timeframeKey}
                  onClick={() => setTimeframe(timeframeKey)}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    backgroundColor: timeframe === timeframeKey ? 'var(--secondary-blue)' : 'transparent',
                    color: timeframe === timeframeKey ? 'var(--white)' : 'var(--text-secondary)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: 'var(--font-size-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {timeframeKey}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-8)' }}>
          {/* Interactive Controls */}
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>Interactive Financial Modeling</h2>
            
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
                {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Scenario
              </h3>
              
              <Slider
                label="Enterprise Clients"
                value={scenarios[scenario].enterpriseClients}
                min={0}
                max={20}
                step={1}
                onChange={(value) => updateScenario(scenario, 'enterpriseClients', value)}
                color="var(--primary-purple)"
              />
              
              <Slider
                label="Small Projects"
                value={scenarios[scenario].smallProjects}
                min={0}
                max={50}
                step={1}
                onChange={(value) => updateScenario(scenario, 'smallProjects', value)}
                color="var(--secondary-blue)"
              />
              
              <Slider
                label="Avg Enterprise Value"
                value={scenarios[scenario].avgEnterpriseValue}
                min={30000}
                max={150000}
                step={5000}
                onChange={(value) => updateScenario(scenario, 'avgEnterpriseValue', value)}
                suffix=""
                color="var(--primary-purple)"
              />
              
              <Slider
                label="Avg Small Project Value"
                value={scenarios[scenario].avgSmallProjectValue}
                min={10000}
                max={50000}
                step={1000}
                onChange={(value) => updateScenario(scenario, 'avgSmallProjectValue', value)}
                color="var(--secondary-blue)"
              />
            </div>

            {/* Revenue Projections */}
            <div style={{
              backgroundColor: 'var(--dark-black)',
              padding: 'var(--spacing-4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Projected Revenue</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Enterprise</div>
                  <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                    ${projections.enterpriseRevenue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Small Projects</div>
                  <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                    ${projections.smallProjectRevenue.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: 'var(--spacing-4)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Total {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Revenue
                </div>
                <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                  ${projections.totalRevenue.toLocaleString()}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Annual: ${projections.annualRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Goal Tracking */}
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>Strategic Goal Tracking</h2>
            
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
                Financial Goals
              </h3>
              
              <ProgressBar
                label="Annual Revenue Target"
                current={actuals.currentRevenue}
                target={goals.annualRevenue}
                color="var(--primary-purple)"
              />
              
              <ProgressBar
                label="Enterprise Clients"
                current={actuals.currentEnterpriseClients}
                target={goals.enterpriseClients}
                color="var(--secondary-blue)"
              />
              
              <ProgressBar
                label="Small Projects"
                current={actuals.currentSmallProjects}
                target={goals.smallProjects}
                color="var(--primary-purple)"
              />
            </div>

            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
                Strategic Goals
              </h3>
              
              <ProgressBar
                label="New Service Offerings"
                current={actuals.completedServiceOfferings}
                target={goals.newServiceOfferings}
                color="#10B981"
              />
              
              <ProgressBar
                label="Market Expansion"
                current={actuals.completedMarketExpansion}
                target={goals.marketExpansion}
                color="#F59E0B"
              />
              
              <ProgressBar
                label="Personal Development"
                current={actuals.completedPersonalDevelopment}
                target={goals.personalDevelopment}
                color="#8B5CF6"
              />
            </div>
          </div>
        </div>

        {/* Visual Charts */}
        <div style={{ marginTop: 'var(--spacing-8)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
            <Chart
              title="Revenue Mix Analysis"
              data={[
                { label: 'Enterprise', value: projections.enterpriseRevenue },
                { label: 'Small Projects', value: projections.smallProjectRevenue }
              ]}
              color="var(--primary-purple)"
            />
            
            <Chart
              title="Monthly Revenue Projection"
              data={[
                { label: 'Jan', value: projections.totalRevenue * 0.8 },
                { label: 'Feb', value: projections.totalRevenue * 0.9 },
                { label: 'Mar', value: projections.totalRevenue },
                { label: 'Apr', value: projections.totalRevenue * 1.1 },
                { label: 'May', value: projections.totalRevenue * 1.05 },
                { label: 'Jun', value: projections.totalRevenue * 1.2 }
              ]}
              color="var(--secondary-blue)"
            />
          </div>
        </div>

        {/* Scenario Comparison */}
        <div style={{ marginTop: 'var(--spacing-8)' }}>
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>Scenario Comparison</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-6)' }}>
              {Object.entries(scenarios).map(([scenarioKey, scenarioData]) => {
                const enterpriseRevenue = scenarioData.enterpriseClients * scenarioData.avgEnterpriseValue
                const smallProjectRevenue = scenarioData.smallProjects * scenarioData.avgSmallProjectValue
                const totalRevenue = enterpriseRevenue + smallProjectRevenue
                
                return (
                  <div key={scenarioKey} style={{
                    backgroundColor: 'var(--dark-black)',
                    padding: 'var(--spacing-4)',
                    borderRadius: 'var(--radius-lg)',
                    border: scenario === scenarioKey ? '2px solid var(--primary-purple)' : '1px solid rgba(148, 163, 184, 0.2)',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ 
                      color: scenario === scenarioKey ? 'var(--primary-purple)' : 'var(--white)',
                      marginBottom: 'var(--spacing-4)',
                      textTransform: 'capitalize'
                    }}>
                      {scenarioKey}
                    </h3>
                    
                    <div style={{ marginBottom: 'var(--spacing-3)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Annual Revenue</div>
                      <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                        ${totalRevenue.toLocaleString()}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-3)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Enterprise Clients</div>
                      <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>
                        {scenarioData.enterpriseClients}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-3)' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Small Projects</div>
                      <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>
                        {scenarioData.smallProjects}
                      </div>
                    </div>
                    
                    <div style={{
                      backgroundColor: 'rgba(148, 163, 184, 0.1)',
                      padding: 'var(--spacing-2)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)'
                    }}>
                      Probability: {(scenarioData.probability * 100).toFixed(0)}%
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessStrategy
