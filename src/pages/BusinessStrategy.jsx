import React, { useState, useEffect } from 'react'
import { openAIAPI } from '../services/api'
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

  // Simplified state management
  const [currentStep, setCurrentStep] = useState(1)
  const [strategyModel, setStrategyModel] = useState({
    revenueTarget: strategyGoals.revenueTarget,
    selectedScenario: strategyGoals.selectedScenario,
    capacity: {
      weeklyHours: strategyGoals.capacity.weeklyHours,
      maxConcurrentProjects: strategyGoals.capacity.maxConcurrentProjects
    }
  })

  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Update shared strategy goals when local state changes
  useEffect(() => {
    setStrategyGoals({
      revenueTarget: strategyModel.revenueTarget,
      selectedScenario: strategyModel.selectedScenario,
      capacity: strategyModel.capacity
    })
  }, [strategyModel, setStrategyGoals])

  // Simplified scenarios with clear explanations
  const scenarios = {
    'conservative': {
      name: 'Conservative Growth',
      description: 'Steady, low-risk approach with smaller projects',
      icon: '🐌',
      details: 'Focus on Tier 1 projects ($1.5K-3K) and proven clients. Lower revenue but more predictable.',
      config: {
        tier1Projects: 20,
        tier2Projects: 3,
        tier3Projects: 1,
        cultureHub: 8,
        backendServices: 15,
        training: 4
      }
    },
    'balanced': {
      name: 'Balanced Portfolio',
      description: 'Mix of project types for steady growth',
      icon: '⚖️',
      details: 'Good mix of all project tiers. Balanced risk with moderate growth potential.',
      config: {
        tier1Projects: 12,
        tier2Projects: 8,
        tier3Projects: 4,
        cultureHub: 15,
        backendServices: 20,
        training: 6
      }
    },
    'aggressive': {
      name: 'Aggressive Growth',
      description: 'Focus on high-value projects for rapid growth',
      icon: '🚀',
      details: 'Emphasize Tier 2/3 projects ($3K-7.5K) and enterprise clients. Higher revenue potential but more risk.',
      config: {
        tier1Projects: 6,
        tier2Projects: 12,
        tier3Projects: 8,
        cultureHub: 8,
        backendServices: 15,
        training: 8
      }
    },
    'platform': {
      name: 'Platform Focus',
      description: 'Build recurring revenue through Culture Hub sales',
      icon: '🏗️',
      details: 'Focus on Culture Hub licenses and backend services for predictable monthly revenue.',
      config: {
        tier1Projects: 8,
        tier2Projects: 4,
        tier3Projects: 2,
        cultureHub: 30,
        backendServices: 25,
        training: 12
      }
    }
  }

  // Calculate revenue and metrics
  const calculateMetrics = () => {
    const scenario = scenarios[strategyModel.selectedScenario]
    const serviceValues = {
      tier1Projects: 2250,
      tier2Projects: 4000,
      tier3Projects: 6250,
      cultureHub: 1250,
      backendServices: 175,
      training: 2000
    }

    let totalRevenue = 0
    let totalProjects = 0

    Object.entries(scenario.config).forEach(([key, quantity]) => {
      totalRevenue += quantity * serviceValues[key]
      if (key.includes('Projects')) {
        totalProjects += quantity
      }
    })

    const clientsNeeded = Math.ceil(totalProjects / 4)
    const weeklyHoursNeeded = (totalProjects * 6 * 8) / 52 // 6 weeks avg, 8 hours per week
    const prospectsNeeded = Math.ceil(clientsNeeded * 3)

    return {
      totalRevenue,
      totalProjects,
      clientsNeeded,
      weeklyHoursNeeded,
      prospectsNeeded,
      scenario
    }
  }

  const metrics = calculateMetrics()

  // AI Analysis
  const analyzeStrategy = async () => {
    setIsAnalyzing(true)
    
    try {
      const analysisData = {
        strategyModel,
        metrics,
        scenario: scenarios[strategyModel.selectedScenario],
        realProjectData: {
          totalProjects: projects.length,
          activeProjects: projectMetrics.activeProjects,
          completedProjects: projectMetrics.completedProjects,
          currentRevenue: projectMetrics.totalReceived,
          tierBreakdown: {
            tier1: projectMetrics.tier1Projects,
            tier2: projectMetrics.tier2Projects,
            tier3: projectMetrics.tier3Projects
          }
        }
      }

      const analysis = await openAIAPI.analyzeBusinessStrategy(analysisData)
      setAiAnalysis(analysis)
    } catch (error) {
      console.error('Strategy analysis failed:', error)
      // Fallback analysis with real data
      setAiAnalysis({
        feasibilityScore: 7,
        feasibilityExplanation: 'Strategy appears feasible with current capacity constraints.',
        timeCommitment: `Estimated ${metrics.weeklyHoursNeeded.toFixed(0)} hours per week required for project delivery.`,
        marketReality: `Need to maintain ${metrics.prospectsNeeded} active prospects in pipeline. Currently have ${projects.length} projects in pipeline.`,
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

  // Step components
  const Step1_RevenueTarget = () => (
    <div className="card">
      <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
        Step 1: Set Your Revenue Target
      </h2>
      
      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <label style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'var(--font-size-lg)', 
          fontWeight: '600',
          display: 'block',
          marginBottom: 'var(--spacing-4)'
        }}>
          What's your annual revenue goal?
        </label>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
          <input
            type="range"
            min={50000}
            max={500000}
            step={10000}
            value={strategyModel.revenueTarget}
            onChange={(e) => setStrategyModel(prev => ({ ...prev, revenueTarget: parseInt(e.target.value) }))}
            style={{
              flex: 1,
              height: '8px',
              borderRadius: '4px',
              background: `linear-gradient(to right, var(--primary-purple) 0%, var(--primary-purple) ${((strategyModel.revenueTarget - 50000) / (500000 - 50000)) * 100}%, rgba(148, 163, 184, 0.3) ${((strategyModel.revenueTarget - 50000) / (500000 - 50000)) * 100}%, rgba(148, 163, 184, 0.3) 100%)`,
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{ 
            color: 'var(--primary-purple)', 
            fontSize: 'var(--font-size-xl)', 
            fontWeight: 'bold',
            minWidth: '120px',
            textAlign: 'right'
          }}>
            ${strategyModel.revenueTarget.toLocaleString()}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-3)' }}>
          <button
            onClick={() => setStrategyModel(prev => ({ ...prev, revenueTarget: 75000 }))}
            style={{
              padding: 'var(--spacing-3)',
              backgroundColor: strategyModel.revenueTarget === 75000 ? 'var(--primary-purple)' : 'transparent',
              color: strategyModel.revenueTarget === 75000 ? 'var(--white)' : 'var(--text-secondary)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            $75K - Conservative
          </button>
          <button
            onClick={() => setStrategyModel(prev => ({ ...prev, revenueTarget: 100000 }))}
            style={{
              padding: 'var(--spacing-3)',
              backgroundColor: strategyModel.revenueTarget === 100000 ? 'var(--primary-purple)' : 'transparent',
              color: strategyModel.revenueTarget === 100000 ? 'var(--white)' : 'var(--text-secondary)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            $100K - Balanced
          </button>
          <button
            onClick={() => setStrategyModel(prev => ({ ...prev, revenueTarget: 150000 }))}
            style={{
              padding: 'var(--spacing-3)',
              backgroundColor: strategyModel.revenueTarget === 150000 ? 'var(--primary-purple)' : 'transparent',
              color: strategyModel.revenueTarget === 150000 ? 'var(--white)' : 'var(--text-secondary)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            $150K - Aggressive
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => setCurrentStep(2)}
          style={{
            padding: 'var(--spacing-4) var(--spacing-8)',
            backgroundColor: 'var(--primary-purple)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Next: Choose Strategy →
        </button>
      </div>
    </div>
  )

  const Step2_StrategySelection = () => (
    <div className="card">
      <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
        Step 2: Choose Your Growth Strategy
      </h2>
      
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: 'var(--font-size-base)', 
        marginBottom: 'var(--spacing-6)',
        lineHeight: '1.6'
      }}>
        Pick the strategy that best matches your goals and risk tolerance. Each option shows the mix of projects you'll focus on.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-4)' }}>
        {Object.entries(scenarios).map(([key, scenario]) => (
          <button
            key={key}
            onClick={() => setStrategyModel(prev => ({ ...prev, selectedScenario: key }))}
            style={{
              padding: 'var(--spacing-4)',
              backgroundColor: strategyModel.selectedScenario === key ? 'var(--primary-purple)' : 'transparent',
              color: strategyModel.selectedScenario === key ? 'var(--white)' : 'var(--text-secondary)',
              border: strategyModel.selectedScenario === key ? '2px solid var(--primary-purple)' : '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
              <span style={{ fontSize: 'var(--font-size-2xl)' }}>{scenario.icon}</span>
              <div>
                <div style={{ fontWeight: '600', fontSize: 'var(--font-size-lg)' }}>
                  {scenario.name}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>
                  {scenario.description}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 'var(--font-size-sm)', lineHeight: '1.5' }}>
              {scenario.details}
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', marginTop: 'var(--spacing-6)' }}>
        <button
          onClick={() => setCurrentStep(1)}
          style={{
            padding: 'var(--spacing-3) var(--spacing-6)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-base)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          style={{
            padding: 'var(--spacing-3) var(--spacing-6)',
            backgroundColor: 'var(--primary-purple)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-base)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Next: Review Capacity →
        </button>
      </div>
    </div>
  )

  const Step3_CapacityReview = () => (
    <div className="card">
      <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
        Step 3: Review Your Capacity
      </h2>
      
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: 'var(--font-size-base)', 
        marginBottom: 'var(--spacing-6)',
        lineHeight: '1.6'
      }}>
        Let's make sure your chosen strategy fits with your available time and capacity.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
        <div>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
            Your Capacity
          </h3>
          
          <div style={{ marginBottom: 'var(--spacing-4)' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
              Available Hours per Week
            </label>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', marginTop: 'var(--spacing-2)' }}>
              <input
                type="range"
                min={20}
                max={60}
                step={5}
                value={strategyModel.capacity.weeklyHours}
                onChange={(e) => setStrategyModel(prev => ({ 
                  ...prev, 
                  capacity: { ...prev.capacity, weeklyHours: parseInt(e.target.value) }
                }))}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  background: `linear-gradient(to right, var(--secondary-blue) 0%, var(--secondary-blue) ${((strategyModel.capacity.weeklyHours - 20) / (60 - 20)) * 100}%, rgba(148, 163, 184, 0.3) ${((strategyModel.capacity.weeklyHours - 20) / (60 - 20)) * 100}%, rgba(148, 163, 184, 0.3) 100%)`,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <span style={{ color: 'var(--white)', fontWeight: '600', minWidth: '40px' }}>
                {strategyModel.capacity.weeklyHours}h
              </span>
            </div>
          </div>

          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
              Max Concurrent Projects
            </label>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', marginTop: 'var(--spacing-2)' }}>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={strategyModel.capacity.maxConcurrentProjects}
                onChange={(e) => setStrategyModel(prev => ({ 
                  ...prev, 
                  capacity: { ...prev.capacity, maxConcurrentProjects: parseInt(e.target.value) }
                }))}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px',
                  background: `linear-gradient(to right, var(--secondary-blue) 0%, var(--secondary-blue) ${((strategyModel.capacity.maxConcurrentProjects - 1) / (8 - 1)) * 100}%, rgba(148, 163, 184, 0.3) ${((strategyModel.capacity.maxConcurrentProjects - 1) / (8 - 1)) * 100}%, rgba(148, 163, 184, 0.3) 100%)`,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              <span style={{ color: 'var(--white)', fontWeight: '600', minWidth: '20px' }}>
                {strategyModel.capacity.maxConcurrentProjects}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-4)' }}>
            Strategy Requirements
          </h3>
          
          <div style={{
            backgroundColor: 'var(--dark-black)',
            padding: 'var(--spacing-4)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <div style={{ marginBottom: 'var(--spacing-3)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Weekly Hours Needed</div>
              <div style={{ 
                color: metrics.weeklyHoursNeeded > strategyModel.capacity.weeklyHours ? '#EF4444' : '#10B981', 
                fontSize: 'var(--font-size-lg)', 
                fontWeight: 'bold' 
              }}>
                {metrics.weeklyHoursNeeded.toFixed(0)}h
                {metrics.weeklyHoursNeeded > strategyModel.capacity.weeklyHours && ' ⚠️'}
              </div>
            </div>
            
            <div style={{ marginBottom: 'var(--spacing-3)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Projects</div>
              <div style={{ 
                color: metrics.totalProjects > strategyModel.capacity.maxConcurrentProjects ? '#EF4444' : '#10B981', 
                fontSize: 'var(--font-size-lg)', 
                fontWeight: 'bold' 
              }}>
                {metrics.totalProjects}
                {metrics.totalProjects > strategyModel.capacity.maxConcurrentProjects && ' ⚠️'}
              </div>
            </div>
            
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Clients Needed</div>
              <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                {metrics.clientsNeeded}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center' }}>
        <button
          onClick={() => setCurrentStep(2)}
          style={{
            padding: 'var(--spacing-3) var(--spacing-6)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-base)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          style={{
            padding: 'var(--spacing-3) var(--spacing-6)',
            backgroundColor: 'var(--primary-purple)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-base)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Next: Get AI Analysis →
        </button>
      </div>
    </div>
  )

  const Step4_AIAnalysis = () => (
    <div className="card">
      <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
        Step 4: AI Strategic Analysis
      </h2>
      
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-6)' }}>
        <button
          onClick={analyzeStrategy}
          disabled={isAnalyzing}
          style={{
            padding: 'var(--spacing-4) var(--spacing-8)',
            backgroundColor: 'var(--primary-purple)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: '600',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            opacity: isAnalyzing ? 0.6 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          {isAnalyzing ? '🤖 Analyzing Your Strategy...' : '🧠 Analyze My Strategy'}
        </button>
      </div>

      {aiAnalysis && (
        <div style={{ marginTop: 'var(--spacing-6)' }}>
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
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-3)' }}>Time Commitment</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  {aiAnalysis.timeCommitment}
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
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-3)' }}>Market Reality</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  {aiAnalysis.marketReality}
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-3)' }}>Key Recommendations</h3>
                <ul style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', paddingLeft: 'var(--spacing-4)' }}>
                  {aiAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} style={{ marginBottom: 'var(--spacing-1)' }}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center', marginTop: 'var(--spacing-6)' }}>
        <button
          onClick={() => setCurrentStep(3)}
          style={{
            padding: 'var(--spacing-3) var(--spacing-6)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-base)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentStep(1)}
          style={{
            padding: 'var(--spacing-3) var(--spacing-6)',
            backgroundColor: 'var(--secondary-blue)',
            color: 'var(--white)',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-base)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Start Over
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          🎯 Strategic Path Planning
        </h1>

        {/* Workflow Indicator */}
        <div className="card" style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)', textAlign: 'center' }}>
            📋 Your Strategic Workflow
          </h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
            {/* Step 1: Strategy */}
            <div style={{ 
              flex: 1, 
              textAlign: 'center', 
              padding: 'var(--spacing-4)', 
              backgroundColor: 'var(--primary-purple)', 
              borderRadius: 'var(--radius-lg)',
              marginRight: 'var(--spacing-2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>🎯</div>
              <div style={{ color: 'var(--white)', fontWeight: 'bold', marginBottom: 'var(--spacing-1)' }}>
                Step 1: Set Strategy
              </div>
              <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
                Define revenue targets & growth path
              </div>
            </div>
            
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>→</div>
            
            {/* Step 2: Pricing */}
            <div style={{ 
              flex: 1, 
              textAlign: 'center', 
              padding: 'var(--spacing-4)', 
              backgroundColor: 'var(--secondary-blue)', 
              borderRadius: 'var(--radius-lg)',
              margin: '0 var(--spacing-2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>💰</div>
              <div style={{ color: 'var(--white)', fontWeight: 'bold', marginBottom: 'var(--spacing-1)' }}>
                Step 2: Generate Prospects
              </div>
              <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
                Use pricing tool to create prospects
              </div>
            </div>
            
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>→</div>
            
            {/* Step 3: Pipeline */}
            <div style={{ 
              flex: 1, 
              textAlign: 'center', 
              padding: 'var(--spacing-4)', 
              backgroundColor: '#10B981', 
              borderRadius: 'var(--radius-lg)',
              marginLeft: 'var(--spacing-2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>📈</div>
              <div style={{ color: 'var(--white)', fontWeight: 'bold', marginBottom: 'var(--spacing-1)' }}>
                Step 3: Convert to Projects
              </div>
              <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
                Convert prospects to active projects
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'var(--dark-black)',
            padding: 'var(--spacing-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
            textAlign: 'center'
          }}>
            <strong>Current Status:</strong> You have {projects.length} active projects and {prospects.length} prospects ready to convert. 
            Your strategy targets ${strategyGoals.revenueTarget.toLocaleString()} in annual revenue.
          </div>
        </div>
        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-2)' }}>
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: step <= currentStep ? 'var(--primary-purple)' : 'rgba(148, 163, 184, 0.3)',
                  color: step <= currentStep ? 'var(--white)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: 'var(--font-size-sm)',
                  transition: 'all 0.2s ease'
                }}
              >
                {step}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-2)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Step {currentStep} of 4
            </span>
          </div>
        </div>

        {/* Real-time Project Data */}
        {projects.length > 0 && (
          <div className="card" style={{ marginBottom: 'var(--spacing-8)' }}>
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
              📊 Current Project Pipeline Data
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                  Total Projects
                </div>
                <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                  {projects.length}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                  {projectMetrics.activeProjects} active
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                  Revenue Received
                </div>
                <div style={{ color: '#10B981', fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                  ${projectMetrics.totalReceived.toLocaleString()}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                  {((projectMetrics.totalReceived / strategyModel.revenueTarget) * 100).toFixed(1)}% of target
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                  Project Mix
                </div>
                <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  T1: {projectMetrics.tier1Projects} | T2: {projectMetrics.tier2Projects} | T3: {projectMetrics.tier3Projects}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                  Current vs Target
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                  Capacity Usage
                </div>
                <div style={{ color: projectMetrics.projectCountProgress > 100 ? '#EF4444' : '#10B981', fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                  {projectMetrics.projectCountProgress.toFixed(0)}%
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                  {projects.length} / {strategyModel.capacity.maxConcurrentProjects} max
                </div>
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'var(--dark-black)',
              padding: 'var(--spacing-4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-base)', fontWeight: '600', marginBottom: 'var(--spacing-2)' }}>
                💡 Strategic Insight
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: '1.5' }}>
                {projects.length === 0 ? 
                  'No projects yet. Add your first project to start tracking progress toward your strategic goals.' :
                  projectMetrics.totalReceived >= strategyModel.revenueTarget * 0.8 ?
                    'Great progress! You\'re on track to meet your revenue target.' :
                    projectMetrics.projectCountProgress > 100 ?
                      'You\'re exceeding your capacity limits. Consider adjusting your strategy or capacity.' :
                      'Good foundation! Focus on converting more projects to meet your revenue goals.'
                }
              </div>
            </div>
          </div>
        )}

        {/* Step content */}
        {currentStep === 1 && <Step1_RevenueTarget />}
        {currentStep === 2 && <Step2_StrategySelection />}
        {currentStep === 3 && <Step3_CapacityReview />}
        {currentStep === 4 && <Step4_AIAnalysis />}

        {/* Quick summary */}
        {currentStep > 1 && (
          <div className="card" style={{ marginTop: 'var(--spacing-8)' }}>
            <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Quick Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-4)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Revenue Target</div>
                <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  ${strategyModel.revenueTarget.toLocaleString()}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                  {projects.length > 0 && `${((projectMetrics.totalReceived / strategyModel.revenueTarget) * 100).toFixed(1)}% achieved`}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Strategy</div>
                <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  {scenarios[strategyModel.selectedScenario].name}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Projected Revenue</div>
                <div style={{ color: '#10B981', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  ${metrics.totalRevenue.toLocaleString()}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                  {projects.length > 0 && `Current: $${projectMetrics.totalReceived.toLocaleString()}`}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Hours/Week</div>
                <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                  {metrics.weeklyHoursNeeded.toFixed(0)}h
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                  {projects.length > 0 && `${projects.length} projects`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BusinessStrategy