import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabaseAPI } from '../services/api'

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
  // Load data from localStorage on initialization
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
      return defaultValue
    }
  }

  // Save data to localStorage
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }

  // Projects data (from Project Pipeline) - load from localStorage
  const [projects, setProjects] = useState(() => loadFromStorage('thb-projects', []))
  
  // Prospects data (from Pricing Tool) - load from localStorage
  const [prospects, setProspects] = useState(() => loadFromStorage('thb-prospects', []))
  
  // Strategy data (from Business Strategy) - load from localStorage
  const [strategyGoals, setStrategyGoals] = useState(() => loadFromStorage('thb-strategy-goals', {
    revenueTarget: 100000,
    selectedScenario: 'balanced',
    capacity: {
      weeklyHours: 40,
      maxConcurrentProjects: 4
    }
  }))

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    saveToStorage('thb-projects', projects)
    // Also save to Supabase
    supabaseAPI.saveProjects(projects)
  }, [projects])

  // Save prospects to localStorage whenever prospects change
  useEffect(() => {
    saveToStorage('thb-prospects', prospects)
    // Also save to Supabase
    supabaseAPI.saveProspects(prospects)
  }, [prospects])

  // Save strategy goals to localStorage whenever strategy changes
  useEffect(() => {
    saveToStorage('thb-strategy-goals', strategyGoals)
    // Also save to Supabase
    supabaseAPI.saveStrategyGoals(strategyGoals)
  }, [strategyGoals])

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
    
    // Prospects data
    prospects,
    setProspects,
    
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
    },
    
    // Prospect management functions
    addProspect: (prospect) => {
      const newProspect = {
        id: Date.now(),
        ...prospect,
        status: 'prospect',
        createdAt: new Date().toISOString().split('T')[0],
        source: 'pricing-tool'
      }
      setProspects(prev => [...prev, newProspect])
      return newProspect
    },
    
    convertProspectToProject: (prospectId) => {
      const prospect = prospects.find(p => p.id === prospectId)
      if (prospect) {
        const project = {
          clientName: prospect.clientName,
          clientEmail: prospect.clientEmail,
          clientPhone: prospect.clientPhone || '',
          projectTitle: prospect.projectTitle,
          projectDescription: prospect.projectDescription,
          estimatedValue: prospect.estimatedValue,
          notes: `Converted from prospect: ${prospect.notes || ''}`
        }
        addProject(project)
        // Remove prospect after conversion
        setProspects(prev => prev.filter(p => p.id !== prospectId))
        return true
      }
      return false
    },
    
    updateProspect: (prospectId, updates) => {
      setProspects(prev => prev.map(prospect => 
        prospect.id === prospectId ? { ...prospect, ...updates } : prospect
      ))
    },
    
    deleteProspect: (prospectId) => {
      setProspects(prev => prev.filter(prospect => prospect.id !== prospectId))
    },
    
    // Data management utilities
    exportData: () => {
      const data = {
        projects,
        prospects,
        strategyGoals,
        exportDate: new Date().toISOString(),
        version: '1.0'
      }
      return JSON.stringify(data, null, 2)
    },
    
    importData: (jsonData) => {
      try {
        const data = JSON.parse(jsonData)
        if (data.projects) setProjects(data.projects)
        if (data.prospects) setProspects(data.prospects)
        if (data.strategyGoals) setStrategyGoals(data.strategyGoals)
        return true
      } catch (error) {
        console.error('Error importing data:', error)
        return false
      }
    },
    
    clearAllData: () => {
      setProjects([])
      setProspects([])
      setStrategyGoals({
        revenueTarget: 100000,
        selectedScenario: 'balanced',
        capacity: {
          weeklyHours: 40,
          maxConcurrentProjects: 4
        }
      })
      localStorage.removeItem('thb-projects')
      localStorage.removeItem('thb-prospects')
      localStorage.removeItem('thb-strategy-goals')
    }
  }

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  )
}
