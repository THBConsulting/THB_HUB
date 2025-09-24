import React, { createContext, useContext, useState, useEffect } from 'react'

// Shared data context for connecting modules
const SharedDataContext = createContext()

export const useSharedData = () => {
  const context = useContext(SharedDataContext)
  if (!context) {
    throw new Error('useSharedData must be used within a SharedDataProvider')
  }
  return context
}

export const SharedDataProvider = ({ children }) => {
  // Projects data (from Project Pipeline)
  const [projects, setProjects] = useState([])
  
  // Strategy data (from Business Strategy)
  const [strategyGoals, setStrategyGoals] = useState({
    revenueTarget: 100000,
    selectedScenario: 'balanced',
    capacity: {
      weeklyHours: 40,
      maxConcurrentProjects: 4
    }
  })

  // Calculate real-time metrics from projects
  const calculateProjectMetrics = () => {
    const totalEstimated = projects.reduce((sum, p) => sum + p.estimatedValue, 0)
    const depositsReceived = projects.reduce((sum, p) => sum + (p.depositReceived ? p.depositAmount : 0), 0)
    const finalPaymentsReceived = projects.reduce((sum, p) => sum + (p.finalPaymentReceived ? p.finalPaymentAmount : 0), 0)
    const totalReceived = depositsReceived + finalPaymentsReceived
    
    // Categorize projects by value tiers
    const tier1Projects = projects.filter(p => p.estimatedValue >= 1500 && p.estimatedValue <= 3000).length
    const tier2Projects = projects.filter(p => p.estimatedValue > 3000 && p.estimatedValue <= 5000).length
    const tier3Projects = projects.filter(p => p.estimatedValue > 5000).length
    
    // Calculate progress toward strategy goals
    const revenueProgress = (totalReceived / strategyGoals.revenueTarget) * 100
    const projectCountProgress = (projects.length / strategyGoals.capacity.maxConcurrentProjects) * 100
    
    return {
      totalEstimated,
      totalReceived,
      revenueProgress,
      projectCountProgress,
      tier1Projects,
      tier2Projects,
      tier3Projects,
      activeProjects: projects.filter(p => p.status === 'in-progress').length,
      completedProjects: projects.filter(p => p.status === 'completed').length
    }
  }

  const projectMetrics = calculateProjectMetrics()

  // Strategy scenarios for reference
  const strategyScenarios = {
    'conservative': {
      name: 'Conservative Growth',
      targetTier1: 20,
      targetTier2: 3,
      targetTier3: 1
    },
    'balanced': {
      name: 'Balanced Portfolio',
      targetTier1: 12,
      targetTier2: 8,
      targetTier3: 4
    },
    'aggressive': {
      name: 'Aggressive Growth',
      targetTier1: 6,
      targetTier2: 12,
      targetTier3: 8
    },
    'platform': {
      name: 'Platform Focus',
      targetTier1: 8,
      targetTier2: 4,
      targetTier3: 2
    }
  }

  const value = {
    // Projects data
    projects,
    setProjects,
    
    // Strategy data
    strategyGoals,
    setStrategyGoals,
    
    // Calculated metrics
    projectMetrics,
    
    // Strategy scenarios
    strategyScenarios,
    
    // Helper functions
    addProject: (project) => {
      const newProject = {
        id: Date.now(),
        ...project,
        status: 'discovery',
        estimatedValue: parseFloat(project.estimatedValue),
        depositAmount: parseFloat(project.estimatedValue) * 0.5,
        depositReceived: false,
        finalPaymentAmount: parseFloat(project.estimatedValue) * 0.5,
        finalPaymentReceived: false,
        proposalSentDate: null,
        startDate: null,
        completionDate: null,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setProjects(prev => [...prev, newProject])
      return newProject
    },
    
    updateProject: (projectId, updates) => {
      setProjects(prev => prev.map(project => 
        project.id === projectId ? { ...project, ...updates } : project
      ))
    },
    
    deleteProject: (projectId) => {
      setProjects(prev => prev.filter(project => project.id !== projectId))
    }
  }

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  )
}
