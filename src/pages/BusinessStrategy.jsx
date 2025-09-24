import React, { useState, useEffect } from 'react'
import { openAIAPI } from '../services/api'

const BusinessStrategy = () => {
  // Strategic Path Modeling State
  const [strategyModel, setStrategyModel] = useState({
    revenueTarget: 100000,
    serviceTypes: {
      tier1Projects: { quantity: 0, avgValue: 2250 },
      tier2Projects: { quantity: 0, avgValue: 4000 },
      tier3Projects: { quantity: 0, avgValue: 6250 },
      cultureHub: { quantity: 0, avgValue: 1250 },
      backendServices: { quantity: 0, avgValue: 175 },
      training: { quantity: 0, avgValue: 2000 }
    },
    clientMix: {
      nonprofit: 60,
      smallBusiness: 35,
      enterprise: 5
    },
    capacity: {
      weeklyHours: 40,
      maxConcurrentProjects: 4,
      bizDevHours: 8,
      avgProjectDuration: 6
    }
  })

  const [selectedPath, setSelectedPath] = useState('mixed-portfolio')
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [comparisonPaths, setComparisonPaths] = useState([])

  // Strategic Path Options
  const strategicPaths = {
    'volume-path': {
      name: 'Volume Path',
      description: 'More Tier 1 projects, higher client count',
      config: {
        tier1Projects: { quantity: 25, avgValue: 2250 },
        tier2Projects: { quantity: 5, avgValue: 4000 },
        tier3Projects: { quantity: 2, avgValue: 6250 },
        cultureHub: { quantity: 10, avgValue: 1250 },
        backendServices: { quantity: 20, avgValue: 175 },
        training: { quantity: 8, avgValue: 2000 }
      }
    },
    'premium-path': {
      name: 'Premium Path',
      description: 'Fewer Tier 2/3 projects, higher value per client',
      config: {
        tier1Projects: { quantity: 5, avgValue: 2250 },
        tier2Projects: { quantity: 8, avgValue: 4000 },
        tier3Projects: { quantity: 6, avgValue: 6250 },
        cultureHub: { quantity: 5, avgValue: 1250 },
        backendServices: { quantity: 15, avgValue: 175 },
        training: { quantity: 4, avgValue: 2000 }
      }
    },
    'platform-path': {
      name: 'Platform Path',
      description: 'Focus on Culture Hub sales + consulting',
      config: {
        tier1Projects: { quantity: 8, avgValue: 2250 },
        tier2Projects: { quantity: 4, avgValue: 4000 },
        tier3Projects: { quantity: 2, avgValue: 6250 },
        cultureHub: { quantity: 30, avgValue: 1250 },
        backendServices: { quantity: 25, avgValue: 175 },
        training: { quantity: 12, avgValue: 2000 }
      }
    },
    'mixed-portfolio': {
      name: 'Mixed Portfolio',
      description: 'Balanced approach across all tiers',
      config: {
        tier1Projects: { quantity: 12, avgValue: 2250 },
        tier2Projects: { quantity: 8, avgValue: 4000 },
        tier3Projects: { quantity: 4, avgValue: 6250 },
        cultureHub: { quantity: 15, avgValue: 1250 },
        backendServices: { quantity: 20, avgValue: 175 },
        training: { quantity: 6, avgValue: 2000 }
      }
    }
  }

  // Calculate revenue projections
  const calculateRevenue = () => {
    const { serviceTypes } = strategyModel
    let totalRevenue = 0
    let breakdown = {}

    Object.entries(serviceTypes).forEach(([key, service]) => {
      const revenue = service.quantity * service.avgValue
      breakdown[key] = revenue
      totalRevenue += revenue
    })

    return { totalRevenue, breakdown }
  }

  const revenue = calculateRevenue()

  // Calculate metrics
  const calculateMetrics = () => {
    const { serviceTypes, capacity } = strategyModel
    const totalProjects = serviceTypes.tier1Projects.quantity + 
                         serviceTypes.tier2Projects.quantity + 
                         serviceTypes.tier3Projects.quantity
    
    const avgProjectValue = totalProjects > 0 ? revenue.totalRevenue / totalProjects : 0
    const clientsNeeded = Math.ceil(totalProjects / 4) // Assuming 4 projects per client average
    const weeklyHoursNeeded = (totalProjects * capacity.avgProjectDuration * 8) / 52 // 8 hours per week per project
    const prospectsNeeded = Math.ceil(clientsNeeded * 3) // 3:1 prospect to client ratio

    return {
      totalProjects,
      avgProjectValue,
      clientsNeeded,
      weeklyHoursNeeded,
      prospectsNeeded
    }
  }

  const metrics = calculateMetrics()

  // AI Analysis
  const analyzeStrategy = async () => {
    setIsAnalyzing(true)
    
    try {
      const analysisData = {
        strategyModel,
        revenue,
        metrics,
        selectedPath: strategicPaths[selectedPath]
      }

      const analysis = await openAIAPI.analyzeBusinessStrategy(analysisData)
      setAiAnalysis(analysis)
    } catch (error) {
      console.error('Strategy analysis failed:', error)
      // Fallback analysis
      setAiAnalysis({
        feasibilityScore: 7,
        feasibilityExplanation: 'Strategy appears feasible with current capacity constraints.',
        timeCommitment: 'Estimated 35-40 hours per week required for project delivery.',
        marketReality: 'Need to maintain 15-20 active prospects in pipeline.',
        riskAssessment: 'Moderate risk due to client concentration. Consider diversifying client base.',
        growthPotential: 'Good scalability potential with platform approach.',
        recommendations: [
          'Focus on Tier 2 projects for better profit margins',
          'Develop referral program to reduce prospecting needs',
          'Consider hiring contractor for overflow work'
        ]
      })
    }
    
    setIsAnalyzing(false)
  }

  // Apply strategic path
  const applyStrategicPath = (pathKey) => {
    setSelectedPath(pathKey)
    const path = strategicPaths[pathKey]
    setStrategyModel(prev => ({
      ...prev,
      serviceTypes: { ...prev.serviceTypes, ...path.config }
    }))
  }

  // Update service type
  const updateServiceType = (serviceKey, field, value) => {
    setStrategyModel(prev => ({
      ...prev,
      serviceTypes: {
        ...prev.serviceTypes,
        [serviceKey]: {
          ...prev.serviceTypes[serviceKey],
          [field]: value
        }
      }
    }))
  }

  // Update capacity
  const updateCapacity = (field, value) => {
    setStrategyModel(prev => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [field]: value
      }
    }))
  }

  // Update client mix
  const updateClientMix = (clientType, value) => {
    setStrategyModel(prev => ({
      ...prev,
      clientMix: {
        ...prev.clientMix,
        [clientType]: value
      }
    }))
  }

  // Add path to comparison
  const addToComparison = () => {
    const pathData = {
      name: strategicPaths[selectedPath].name,
      revenue: revenue.totalRevenue,
      metrics,
      strategyModel: { ...strategyModel }
    }
    
    if (comparisonPaths.length < 3) {
      setComparisonPaths(prev => [...prev, pathData])
    }
  }

  // Custom Slider Component
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

  // Progress Bar Component
  const ProgressBar = ({ label, current, target, color = 'var(--primary-purple)' }) => {
    const percentage = Math.min((current / target) * 100, 100)
    return (
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{label}</span>
          <span style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
            {current.toLocaleString()} / {target.toLocaleString()}
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
          {percentage.toFixed(1)}% of target
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          🎯 Strategic Path Modeling
        </h1>

        {/* Revenue Target Setting */}
        <div className="card" style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>Revenue Target & Metrics</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-6)' }}>
            <div>
              <Slider
                label="Annual Revenue Target"
                value={strategyModel.revenueTarget}
                min={50000}
                max={500000}
                step={5000}
                onChange={(value) => setStrategyModel(prev => ({ ...prev, revenueTarget: value }))}
                suffix=""
                color="var(--primary-purple)"
              />
              
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-3)' }}>Target Metrics</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                  Clients Needed: <span style={{ color: 'var(--white)', fontWeight: '600' }}>{metrics.clientsNeeded}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                  Avg Project Value: <span style={{ color: 'var(--white)', fontWeight: '600' }}>${metrics.avgProjectValue.toLocaleString()}</span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Prospects Needed: <span style={{ color: 'var(--white)', fontWeight: '600' }}>{metrics.prospectsNeeded}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
                Quarterly Breakdown
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-3)' }}>
                {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => (
                  <div key={quarter} style={{
                    backgroundColor: 'var(--dark-black)',
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    border: '1px solid rgba(148, 163, 184, 0.2)'
                  }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>
                      {quarter}
                    </div>
                    <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>
                      ${Math.round(strategyModel.revenueTarget / 4).toLocaleString()}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                      {Math.round(metrics.clientsNeeded / 4)} clients
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-8)' }}>
          {/* Strategic Path Options */}
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>Strategic Path Options</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-6)' }}>
              {Object.entries(strategicPaths).map(([key, path]) => (
                <button
                  key={key}
                  onClick={() => applyStrategicPath(key)}
                  style={{
                    padding: 'var(--spacing-3)',
                    backgroundColor: selectedPath === key ? 'var(--primary-purple)' : 'transparent',
                    color: selectedPath === key ? 'var(--white)' : 'var(--text-secondary)',
                    border: selectedPath === key ? '2px solid var(--primary-purple)' : '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-1)' }}>
                    {path.name}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)' }}>
                    {path.description}
                  </div>
                </button>
              ))}
            </div>

            <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
              Service Mix Configuration
            </h3>

            <Slider
              label="Tier 1 Projects (Tier 1: $1.5K-3K)"
              value={strategyModel.serviceTypes.tier1Projects.quantity}
              min={0}
              max={50}
              step={1}
              onChange={(value) => updateServiceType('tier1Projects', 'quantity', value)}
              color="var(--primary-purple)"
            />

            <Slider
              label="Tier 2 Projects (Tier 2: $3K-5K)"
              value={strategyModel.serviceTypes.tier2Projects.quantity}
              min={0}
              max={30}
              step={1}
              onChange={(value) => updateServiceType('tier2Projects', 'quantity', value)}
              color="var(--secondary-blue)"
            />

            <Slider
              label="Tier 3 Projects (Tier 3: $5K-7.5K)"
              value={strategyModel.serviceTypes.tier3Projects.quantity}
              min={0}
              max={20}
              step={1}
              onChange={(value) => updateServiceType('tier3Projects', 'quantity', value)}
              color="#10B981"
            />

            <Slider
              label="Culture Hub Licenses"
              value={strategyModel.serviceTypes.cultureHub.quantity}
              min={0}
              max={50}
              step={1}
              onChange={(value) => updateServiceType('cultureHub', 'quantity', value)}
              color="#F59E0B"
            />

            <Slider
              label="Backend Services (Monthly)"
              value={strategyModel.serviceTypes.backendServices.quantity}
              min={0}
              max={50}
              step={1}
              onChange={(value) => updateServiceType('backendServices', 'quantity', value)}
              color="#8B5CF6"
            />

            <Slider
              label="Training/Workshop Delivery"
              value={strategyModel.serviceTypes.training.quantity}
              min={0}
              max={20}
              step={1}
              onChange={(value) => updateServiceType('training', 'quantity', value)}
              color="#EC4899"
            />
          </div>

          {/* Capacity Constraints & Client Mix */}
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>Capacity & Client Mix</h2>
            
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
                Capacity Constraints
              </h3>

              <Slider
                label="Available Work Hours/Week"
                value={strategyModel.capacity.weeklyHours}
                min={20}
                max={60}
                step={5}
                onChange={(value) => updateCapacity('weeklyHours', value)}
                color="var(--primary-purple)"
              />

              <Slider
                label="Max Concurrent Projects"
                value={strategyModel.capacity.maxConcurrentProjects}
                min={1}
                max={10}
                step={1}
                onChange={(value) => updateCapacity('maxConcurrentProjects', value)}
                color="var(--secondary-blue)"
              />

              <Slider
                label="Business Development Hours/Week"
                value={strategyModel.capacity.bizDevHours}
                min={0}
                max={20}
                step={1}
                onChange={(value) => updateCapacity('bizDevHours', value)}
                color="#10B981"
              />

              <Slider
                label="Average Project Duration (Weeks)"
                value={strategyModel.capacity.avgProjectDuration}
                min={2}
                max={12}
                step={1}
                onChange={(value) => updateCapacity('avgProjectDuration', value)}
                color="#F59E0B"
              />
            </div>

            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
                Client Mix Distribution
              </h3>

              <Slider
                label="Nonprofit Organizations"
                value={strategyModel.clientMix.nonprofit}
                min={0}
                max={100}
                step={5}
                onChange={(value) => updateClientMix('nonprofit', value)}
                color="var(--primary-purple)"
              />

              <Slider
                label="Small Businesses"
                value={strategyModel.clientMix.smallBusiness}
                min={0}
                max={100}
                step={5}
                onChange={(value) => updateClientMix('smallBusiness', value)}
                color="var(--secondary-blue)"
              />

              <Slider
                label="Enterprise Prospects"
                value={strategyModel.clientMix.enterprise}
                min={0}
                max={100}
                step={5}
                onChange={(value) => updateClientMix('enterprise', value)}
                color="#10B981"
              />

              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                marginTop: 'var(--spacing-4)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)'
              }}>
                <div>Total: {strategyModel.clientMix.nonprofit + strategyModel.clientMix.smallBusiness + strategyModel.clientMix.enterprise}%</div>
                {strategyModel.clientMix.nonprofit + strategyModel.clientMix.smallBusiness + strategyModel.clientMix.enterprise !== 100 && (
                  <div style={{ color: '#F59E0B', marginTop: 'var(--spacing-1)' }}>
                    ⚠️ Client mix should total 100%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Projections */}
        <div className="card" style={{ marginTop: 'var(--spacing-8)' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>Revenue Projections</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                Projected Revenue
              </div>
              <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                ${revenue.totalRevenue.toLocaleString()}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {((revenue.totalRevenue / strategyModel.revenueTarget) * 100).toFixed(1)}% of target
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                Required Hours/Week
              </div>
              <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                {metrics.weeklyHoursNeeded.toFixed(0)}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {metrics.weeklyHoursNeeded > strategyModel.capacity.weeklyHours ? '⚠️ Over capacity' : 'Within capacity'}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                Total Projects
              </div>
              <div style={{ color: '#10B981', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                {metrics.totalProjects}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {metrics.totalProjects > strategyModel.capacity.maxConcurrentProjects ? '⚠️ Over limit' : 'Within limit'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center' }}>
            <button
              onClick={analyzeStrategy}
              disabled={isAnalyzing}
              style={{
                padding: 'var(--spacing-3) var(--spacing-6)',
                backgroundColor: 'var(--primary-purple)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--font-size-base)',
                fontWeight: '600',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                opacity: isAnalyzing ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {isAnalyzing ? '🤖 Analyzing...' : '🧠 Analyze Strategy'}
            </button>
            
            <button
              onClick={addToComparison}
              disabled={comparisonPaths.length >= 3}
              style={{
                padding: 'var(--spacing-3) var(--spacing-6)',
                backgroundColor: 'var(--secondary-blue)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--font-size-base)',
                fontWeight: '600',
                cursor: comparisonPaths.length >= 3 ? 'not-allowed' : 'pointer',
                opacity: comparisonPaths.length >= 3 ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              📊 Add to Comparison
            </button>
          </div>
        </div>

        {/* AI Strategic Analysis */}
        {aiAnalysis && (
          <div className="card" style={{ marginTop: 'var(--spacing-8)' }}>
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>🤖 AI Strategic Analysis</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-6)' }}>
              <div>
                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-3)' }}>Feasibility Score</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'bold',
                      color: aiAnalysis.feasibilityScore >= 7 ? '#10B981' : aiAnalysis.feasibilityScore >= 5 ? '#F59E0B' : '#EF4444'
                    }}>
                      {aiAnalysis.feasibilityScore}/10
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      {aiAnalysis.feasibilityExplanation}
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-3)' }}>Time Commitment</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {aiAnalysis.timeCommitment}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)'
                }}>
                  <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-3)' }}>Market Reality</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {aiAnalysis.marketReality}
                  </div>
                </div>
              </div>

              <div>
                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-3)' }}>Risk Assessment</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {aiAnalysis.riskAssessment}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-3)' }}>Growth Potential</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {aiAnalysis.growthPotential}
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)'
                }}>
                  <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-3)' }}>Recommendations</h3>
                  <ul style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', paddingLeft: 'var(--spacing-4)' }}>
                    {aiAnalysis.recommendations.map((rec, index) => (
                      <li key={index} style={{ marginBottom: 'var(--spacing-1)' }}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Path Comparison Dashboard */}
        {comparisonPaths.length > 0 && (
          <div className="card" style={{ marginTop: 'var(--spacing-8)' }}>
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>📊 Path Comparison Dashboard</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${comparisonPaths.length}, 1fr)`, gap: 'var(--spacing-4)' }}>
              {comparisonPaths.map((path, index) => (
                <div key={index} style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  textAlign: 'center'
                }}>
                  <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
                    {path.name}
                  </h3>
                  
                  <div style={{ marginBottom: 'var(--spacing-3)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Revenue</div>
                    <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                      ${path.revenue.toLocaleString()}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--spacing-3)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Weekly Hours</div>
                    <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>
                      {path.metrics.weeklyHoursNeeded.toFixed(0)}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--spacing-3)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Prospects Needed</div>
                    <div style={{ color: '#10B981', fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>
                      {path.metrics.prospectsNeeded}
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    padding: 'var(--spacing-2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)'
                  }}>
                    {path.metrics.totalProjects} projects
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BusinessStrategy