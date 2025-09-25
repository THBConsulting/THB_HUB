import React, { useState } from 'react'
import { claudeAPI, supabaseService, openAIAPI } from '../services/api'
import { useSharedData } from '../contexts/SharedDataContext'

const PricingSOW = () => {
  const { addProspect, strategyGoals } = useSharedData()
  
  // Tab management
  const [activeTab, setActiveTab] = useState('pricing')
  
  // Enhanced business state
  const [businessState, setBusinessState] = useState({
    prospects: [],
    clients: [],
    revenue: {
      infrastructure: 0,
      customTools: 0,
      aiSystems: 0,
      cultureHub: 0
    },
    targets: {
      infrastructure: { clients: 20, revenue: 40000 },
      customTools: { clients: 20, revenue: 75000 },
      aiSystems: { clients: 5, revenue: 31250 },
      cultureHub: { clients: 5, revenue: 12500 },
      total: { clients: 50, revenue: 158750 }
    },
    serviceDefinitions: {
      infrastructure: { name: "AI Infrastructure", priceRange: "1,500-2,500", avgPrice: 2000, weeks: 2 },
      customTools: { name: "Custom AI Tools", priceRange: "2,500-5,000", avgPrice: 3750, weeks: 3 },
      aiSystems: { name: "AI Systems Builder", priceRange: "5,000-7,500", avgPrice: 6250, weeks: 4 },
      cultureHub: { name: "Culture Hub", priceRange: "2,500", avgPrice: 2500, weeks: 1 }
    }
  })
  
  const [formData, setFormData] = useState({
    clientType: '',
    clientName: '',
    clientEmail: '',
    // Service Selection
    selectedService: '',
    // Client Context
    clientContext: {
      organizationType: '',
      organizationMission: '',
      teamSize: '',
      techComfortLevel: '',
      primaryGoal: ''
    },
    // AI Opportunity Assessment
    aiAssessment: {
      contentCommunication: [],
      dataAnalysis: [],
      processAutomation: [],
      informationManagement: [],
      stakeholderEngagement: [],
      eventsTraining: []
    },
    discoveryNotes: '',
    timeline: '',
    budgetRange: ''
  })

  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sowDocument, setSowDocument] = useState('')
  const [isGeneratingSOW, setIsGeneratingSOW] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({})
  
  // Feasibility Analysis State
  const [feasibilityAnalysis, setFeasibilityAnalysis] = useState(null)
  const [isAnalyzingFeasibility, setIsAnalyzingFeasibility] = useState(false)
  const [excludedAreas, setExcludedAreas] = useState([])
  const [expandedFeasibility, setExpandedFeasibility] = useState({})
  
  // Client Document State
  const [clientDocument, setClientDocument] = useState(null)
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false)
  const [documentSections, setDocumentSections] = useState([])
  const [isEditingDocument, setIsEditingDocument] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  
  // New Pricing State
  const [pricingBreakdown, setPricingBreakdown] = useState(null)
  const [isCalculatingPricing, setIsCalculatingPricing] = useState(false)
  const [manualAdjustments, setManualAdjustments] = useState({
    developmentFee: null,
    consultingHours: null,
    monthlyFee: null
  })
  
  // Enhanced SOW State
  const [enhancedSOW, setEnhancedSOW] = useState(null)
  const [isGeneratingEnhancedSOW, setIsGeneratingEnhancedSOW] = useState(false)
  const [sowSections, setSowSections] = useState([])
  const [isEditingSOW, setIsEditingSOW] = useState(false)
  const [sowPreviewMode, setSowPreviewMode] = useState(false)
  const [sowTemplates, setSowTemplates] = useState([])

  // Document Display State
  const [currentDocumentType, setCurrentDocumentType] = useState(null) // 'feasibility', 'client', 'pricing', 'sow'
  const [documentToDisplay, setDocumentToDisplay] = useState(null)

  // Client Context Options
  const organizationTypes = [
    { value: 'nonprofit-small', label: 'Nonprofit - Small' },
    { value: 'nonprofit-medium', label: 'Nonprofit - Medium' },
    { value: 'nonprofit-large', label: 'Nonprofit - Large' },
    { value: 'small-business', label: 'Small Business' },
    { value: 'other', label: 'Other' }
  ]

  const teamSizes = [
    { value: '1-5', label: '1-5 people' },
    { value: '6-15', label: '6-15 people' },
    { value: '16-50', label: '16-50 people' },
    { value: '50+', label: '50+ people' }
  ]

  const techComfortLevels = [
    { value: 'basic', label: 'Basic - Limited tech experience' },
    { value: 'intermediate', label: 'Intermediate - Comfortable with common tools' },
    { value: 'advanced', label: 'Advanced - Tech-savvy and adaptable' }
  ]

  const primaryGoals = [
    { value: 'save-time', label: 'Save time on repetitive tasks' },
    { value: 'improve-quality', label: 'Improve quality and consistency' },
    { value: 'better-insights', label: 'Get better insights from data' },
    { value: 'scale-operations', label: 'Scale operations efficiently' },
    { value: 'other', label: 'Other' }
  ]

  const clientTypes = [
    { value: 'nonprofit-small', label: 'Nonprofit - Small (< 50 employees)', multiplier: 0.8 },
    { value: 'nonprofit-medium', label: 'Nonprofit - Medium (50-200 employees)', multiplier: 0.9 },
    { value: 'nonprofit-large', label: 'Nonprofit - Large (200+ employees)', multiplier: 1.0 },
    { value: 'small-business', label: 'Small Business', multiplier: 1.2 }
  ]


  const timelineOptions = [
    { value: 'urgent', label: 'Urgent (2-4 weeks)', multiplier: 1.5 },
    { value: 'standard', label: 'Standard (6-8 weeks)', multiplier: 1.0 },
    { value: 'flexible', label: 'Flexible (8-12 weeks)', multiplier: 0.9 }
  ]

  const budgetRanges = [
    { value: 'under-10k', label: 'Under $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k-50k', label: '$25,000 - $50,000' },
    { value: '50k-plus', label: '$50,000+' },
    { value: 'unknown', label: 'Not specified' }
  ]

  const aiOpportunityCategories = {
    contentCommunication: {
      title: 'Content & Communication',
      options: [
        'Automated report generation',
        'Email marketing automation',
        'Social media content creation',
        'Presentation template generation',
        'Newsletter automation',
        'Document formatting and branding',
        'Client can\'t articulate specific needs but wants help in this area',
        'Not applicable - this category doesn\'t apply to their work'
      ]
    },
    dataAnalysis: {
      title: 'Data & Analysis',
      options: [
        'Survey data analysis and insights',
        'Feedback categorization and sentiment',
        'Data visualization dashboards',
        'Research compilation and summaries',
        'Performance metrics tracking',
        'Trend analysis and reporting',
        'Client can\'t articulate specific needs but wants help in this area',
        'Not applicable - this category doesn\'t apply to their work'
      ]
    },
    processAutomation: {
      title: 'Process Automation',
      options: [
        'Task scheduling and reminders',
        'Approval workflows',
        'Form processing and routing',
        'Calendar coordination',
        'File organization',
        'Status tracking and notifications',
        'Client can\'t articulate specific needs but wants help in this area',
        'Not applicable - this category doesn\'t apply to their work'
      ]
    },
    informationManagement: {
      title: 'Information Management',
      options: [
        'Knowledge base creation',
        'Document search and retrieval',
        'Content organization systems',
        'FAQ automation',
        'Resource libraries',
        'Version control systems',
        'Client can\'t articulate specific needs but wants help in this area',
        'Not applicable - this category doesn\'t apply to their work'
      ]
    },
    stakeholderEngagement: {
      title: 'Stakeholder Engagement',
      options: [
        'Interactive forms and surveys',
        'Customer/client portals',
        'Communication hubs',
        'Event management tools',
        'Feedback collection systems',
        'Online engagement platforms',
        'Client can\'t articulate specific needs but wants help in this area',
        'Not applicable - this category doesn\'t apply to their work'
      ]
    },
    eventsTraining: {
      title: 'Events & Training',
      options: [
        'Conference planning and management',
        'Training curriculum design',
        'Staff onboarding programs',
        'Event registration and tracking',
        'Training delivery platforms',
        'Workshop and meeting planning',
        'Client can\'t articulate specific needs but wants help in this area',
        'Not applicable - this category doesn\'t apply to their work'
      ]
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleClientContextChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      clientContext: {
        ...prev.clientContext,
        [field]: value
      }
    }))
  }

  const handleAIAssessmentChange = (categoryId, field, value) => {
    setFormData(prev => ({
      ...prev,
      aiAssessment: {
        ...prev.aiAssessment,
        [categoryId]: {
          ...prev.aiAssessment[categoryId],
          [field]: value
        }
      }
    }))
  }

  const handleAIAssessmentCheckbox = (category, option) => {
    setFormData(prev => {
      const currentOptions = prev.aiAssessment[category] || []
      const isSelected = currentOptions.includes(option)
      
      let newOptions
      if (isSelected) {
        // Remove option
        newOptions = currentOptions.filter(opt => opt !== option)
      } else {
        // Add option
        newOptions = [...currentOptions, option]
      }
      
      return {
        ...prev,
        aiAssessment: {
          ...prev.aiAssessment,
          [category]: newOptions
        }
      }
    })
  }

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const analyzeFeasibility = async () => {
    setIsAnalyzingFeasibility(true)
    
    try {
      // Get selected opportunities from each category
      const selectedOpportunities = []
      
      Object.entries(aiOpportunityCategories).forEach(([categoryKey, category]) => {
        const selectedOptions = formData.aiAssessment[categoryKey] || []
        
        // Filter out "Not applicable" and "Client can't articulate" options for analysis
        const relevantOptions = selectedOptions.filter(option => 
          !option.includes('Not applicable') && 
          !option.includes('Client can\'t articulate')
        )
        
        if (relevantOptions.length > 0) {
          selectedOpportunities.push({
            area: category.title,
            description: `Selected opportunities: ${relevantOptions.join(', ')}`,
            selectedOptions: relevantOptions,
            organizationType: formData.clientContext.organizationType,
            teamSize: formData.clientContext.teamSize,
            techComfortLevel: formData.clientContext.techComfortLevel,
            primaryGoal: formData.clientContext.primaryGoal,
            timeline: formData.timeline,
            budgetRange: formData.budgetRange,
            discoveryNotes: formData.discoveryNotes
          })
        }
      })

      if (selectedOpportunities.length === 0) {
        alert('Please select at least one opportunity area to analyze.')
        setIsAnalyzingFeasibility(false)
        return
      }

      // Use OpenAI API for feasibility analysis
      const feasibilityResult = await openAIAPI.analyzeFeasibility(selectedOpportunities)
      setFeasibilityAnalysis(feasibilityResult)
      
      // Set document for display
      const formattedDoc = formatDocumentForCopy('feasibility', feasibilityResult)
      setDocumentToDisplay(formattedDoc)
      setCurrentDocumentType('feasibility')
      
    } catch (error) {
      console.error('Feasibility analysis failed:', error)
      alert('Failed to analyze feasibility. Please try again.')
    }
    
    setIsAnalyzingFeasibility(false)
  }

  const hasSelectedOpportunities = () => {
    return Object.values(formData.aiAssessment).some(options => 
      options && options.length > 0 && 
      options.some(option => 
        !option.includes('Not applicable') && 
        !option.includes('Client can\'t articulate')
      )
    )
  }

  const formatDocumentForCopy = (documentType, data) => {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    switch (documentType) {
      case 'feasibility':
        return formatFeasibilityDocument(data)
      case 'client':
        return formatClientDocument(data)
      case 'pricing':
        return formatPricingDocument(data)
      case 'sow':
        return formatSOWDocument(data)
      default:
        return ''
    }
  }

  const formatFeasibilityDocument = (data) => {
    if (!data || !data.areas) return ''
    
    let doc = `AI AUTOMATION FEASIBILITY ANALYSIS\n`
    doc += `Generated: ${new Date().toLocaleDateString()}\n\n`
    doc += `CLIENT: ${formData.clientName || 'TBD'}\n`
    doc += `ORGANIZATION: ${formData.clientContext.organizationType || 'Not specified'}\n\n`
    doc += `EXECUTIVE SUMMARY\n`
    doc += `This analysis evaluates the feasibility of AI automation opportunities for your organization based on your current activities, pain points, and organizational context.\n\n`
    
    doc += `OPPORTUNITY ANALYSIS\n\n`
    
    data.areas.forEach((area, index) => {
      doc += `${index + 1}. ${area.areaName.toUpperCase()}\n`
      doc += `   Feasibility: ${area.feasibility}\n`
      doc += `   Complexity: ${area.complexity}\n\n`
      doc += `   What's Possible:\n`
      doc += `   ${area.explanation}\n\n`
      
      if (area.limitations) {
        doc += `   Limitations & Considerations:\n`
        doc += `   ${area.limitations}\n\n`
      }
      
      if (area.recommendations && area.recommendations.length > 0) {
        doc += `   Recommendations:\n`
        area.recommendations.forEach(rec => {
          doc += `   • ${rec}\n`
        })
        doc += `\n`
      }
      
      doc += `${'='.repeat(60)}\n\n`
    })
    
    doc += `NEXT STEPS\n`
    doc += `Based on this analysis, we recommend focusing on the high-feasibility opportunities that align with your primary goal of ${formData.clientContext.primaryGoal || 'improving operational efficiency'}.\n\n`
    doc += `Contact: THB Operations Hub\n`
    doc += `Generated: ${currentDate}\n`
    
    return doc
  }

  const formatClientDocument = (data) => {
    if (!data) return ''
    
    let doc = `AI AUTOMATION PROJECT OVERVIEW\n`
    doc += `"What's Possible & Your Role"\n\n`
    doc += `Client: ${formData.clientName || 'TBD'}\n`
    doc += `Organization: ${formData.clientContext.organizationType || 'Not specified'}\n`
    doc += `Generated: ${new Date().toLocaleDateString()}\n\n`
    
    doc += `EXECUTIVE SUMMARY\n`
    doc += `${data.executiveSummary}\n\n`
    
    doc += `RECOMMENDED AI SOLUTIONS\n`
    doc += `${data.recommendedSolutions}\n\n`
    
    doc += `WHAT EACH SOLUTION WILL LOOK LIKE\n`
    doc += `${data.solutionExamples}\n\n`
    
    doc += `YOUR ROLE & TIME INVESTMENT\n`
    doc += `${data.clientRole}\n\n`
    
    doc += `TIMELINE EXPECTATIONS\n`
    doc += `${data.timeline}\n\n`
    
    doc += `NEXT STEPS\n`
    doc += `${data.nextSteps}\n\n`
    
    doc += `---\n`
    doc += `This document outlines the AI automation opportunities we've identified for your organization. Please review and let us know if you have any questions or would like to proceed with implementation.\n\n`
    doc += `THB Operations Hub\n`
    doc += `Generated: ${new Date().toLocaleDateString()}\n`
    
    return doc
  }

  const formatPricingDocument = (data) => {
    if (!data) return ''
    
    let doc = `AI AUTOMATION PROJECT PRICING BREAKDOWN\n\n`
    doc += `Client: ${formData.clientName || 'TBD'}\n`
    doc += `Organization: ${formData.clientContext.organizationType || 'Not specified'}\n`
    doc += `Generated: ${new Date().toLocaleDateString()}\n\n`
    
    doc += `PRICING TIER: ${data.pricingTier}\n\n`
    
    doc += `INVESTMENT BREAKDOWN\n\n`
    
    doc += `1. DEVELOPMENT FEE\n`
    doc += `   Range: $${data.developmentFee.min.toLocaleString()} - $${data.developmentFee.max.toLocaleString()}\n`
    doc += `   Recommended: $${data.developmentFee.recommended.toLocaleString()}\n`
    doc += `   ${data.developmentFee.explanation}\n\n`
    
    doc += `2. CONSULTING & SETUP\n`
    doc += `   Hourly Rate: $${data.consultingSetup.hourlyRate}/hour\n`
    doc += `   Estimated Hours: ${data.consultingSetup.estimatedHours} hours\n`
    doc += `   Total Cost: $${data.consultingSetup.totalCost.toLocaleString()}\n`
    doc += `   ${data.consultingSetup.breakdown}\n\n`
    
    doc += `3. ONGOING BACKEND COSTS\n`
    doc += `   Monthly Fee: $${data.ongoingCosts.monthlyFee}/month\n`
    doc += `   Annual Fee: $${data.ongoingCosts.annualFee}/year\n`
    doc += `   ${data.ongoingCosts.breakdown}\n\n`
    
    doc += `TOTAL PROJECT INVESTMENT\n`
    doc += `Minimum: $${data.totalProjectCost.min.toLocaleString()}\n`
    doc += `Maximum: $${data.totalProjectCost.max.toLocaleString()}\n`
    doc += `Recommended: $${data.totalProjectCost.recommended.toLocaleString()}\n\n`
    
    doc += `SUMMARY\n`
    doc += `${data.summary}\n\n`
    
    doc += `---\n`
    doc += `This pricing breakdown is based on your organization's size, tech comfort level, and selected opportunity areas. All pricing is subject to final project scope confirmation.\n\n`
    doc += `THB Operations Hub\n`
    doc += `Generated: ${new Date().toLocaleDateString()}\n`
    
    return doc
  }

  const formatSOWDocument = (data) => {
    if (!data) return ''
    
    let doc = `STATEMENT OF WORK\n`
    doc += `AI Automation Project\n\n`
    doc += `THB Operations Hub\n`
    doc += `Generated: ${new Date().toLocaleDateString()}\n\n`
    
    doc += `CLIENT INFORMATION\n`
    doc += `Client Name: ${formData.clientName || 'TBD'}\n`
    doc += `Client Email: ${formData.clientEmail || 'TBD'}\n`
    doc += `Organization Type: ${formData.clientContext.organizationType || 'Not specified'}\n`
    doc += `Organization Mission: ${formData.clientContext.organizationMission || 'Not specified'}\n`
    doc += `Team Size: ${formData.clientContext.teamSize || 'Not specified'}\n`
    doc += `Tech Comfort Level: ${formData.clientContext.techComfortLevel || 'Not specified'}\n`
    doc += `Primary Goal: ${formData.clientContext.primaryGoal || 'Not specified'}\n\n`
    
    doc += `EXECUTIVE SUMMARY\n`
    doc += `${data.executiveSummary}\n\n`
    
    doc += `PROJECT SCOPE & OBJECTIVES\n`
    doc += `${data.projectScope}\n\n`
    
    doc += `DETAILED DELIVERABLES\n`
    if (data.deliverables && data.deliverables.length > 0) {
      data.deliverables.forEach((deliverable, index) => {
        doc += `${index + 1}. ${deliverable.area}\n`
        doc += `   Description: ${deliverable.description}\n`
        doc += `   Timeline: ${deliverable.timeline}\n`
        doc += `   Deliverables:\n`
        deliverable.deliverables.forEach(item => {
          doc += `   • ${item}\n`
        })
        doc += `\n`
      })
    }
    
    doc += `PRICING & INVESTMENT\n`
    doc += `Development Fee: $${data.pricing.developmentFee.toLocaleString()}\n`
    doc += `Consulting & Setup: $${data.pricing.consultingSetup.toLocaleString()}\n`
    doc += `Ongoing Monthly: $${data.pricing.ongoingMonthly}/month\n`
    doc += `Total Project Investment: $${data.pricing.totalProject.toLocaleString()}\n\n`
    
    doc += `PROJECT TIMELINE\n`
    doc += `Total Duration: ${data.timeline.totalDuration}\n\n`
    doc += `Milestones:\n`
    data.timeline.milestones.forEach((milestone, index) => {
      doc += `${index + 1}. ${milestone}\n`
    })
    doc += `\n`
    
    doc += `CLIENT RESPONSIBILITIES\n`
    data.clientResponsibilities.forEach((responsibility, index) => {
      doc += `${index + 1}. ${responsibility}\n`
    })
    doc += `\n`
    
    doc += `TERMS & CONDITIONS\n`
    data.termsConditions.forEach((term, index) => {
      doc += `${index + 1}. ${term}\n`
    })
    doc += `\n`
    
    doc += `NEXT STEPS\n`
    data.nextSteps.forEach((step, index) => {
      doc += `${index + 1}. ${step}\n`
    })
    doc += `\n`
    
    doc += `---\n`
    doc += `This Statement of Work outlines the complete scope of work for your AI automation project. Please review, sign, and return to begin implementation.\n\n`
    doc += `THB Operations Hub\n`
    doc += `Contact: [Your Contact Information]\n`
    doc += `Generated: ${new Date().toLocaleDateString()}\n`
    
    return doc
  }

  const copyDocumentToClipboard = async () => {
    if (!documentToDisplay) return
    
    try {
      await navigator.clipboard.writeText(documentToDisplay)
      alert('Document copied to clipboard! You can now paste it into Google Docs.')
    } catch (err) {
      console.error('Failed to copy document:', err)
      alert('Failed to copy document. Please try again.')
    }
  }

  const toggleFeasibilityExpansion = (areaId) => {
    setExpandedFeasibility(prev => ({
      ...prev,
      [areaId]: !prev[areaId]
    }))
  }

  const toggleAreaExclusion = (areaId) => {
    setExcludedAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    )
  }

  const getFeasibilityColor = (feasibility) => {
    switch (feasibility.toLowerCase()) {
      case 'high': return '#10B981' // Green
      case 'medium': return '#F59E0B' // Yellow
      case 'low': return '#EF4444' // Red
      default: return '#6B7280' // Gray
    }
  }

  const generateClientDocument = async () => {
    setIsGeneratingDocument(true)
    
    try {
      // Get included areas only
      const includedAreas = feasibilityAnalysis.areas.filter(area => 
        !excludedAreas.includes(area.areaName)
      )

      if (includedAreas.length === 0) {
        alert('Please include at least one opportunity area in your project scope.')
        setIsGeneratingDocument(false)
        return
      }

      // Prepare data for document generation
      const documentData = {
        clientContext: formData.clientContext,
        includedAreas: includedAreas,
        organizationType: formData.clientContext.organizationType,
        teamSize: formData.clientContext.teamSize,
        techComfortLevel: formData.clientContext.techComfortLevel,
        primaryGoal: formData.clientContext.primaryGoal
      }

      // Use OpenAI API for document generation
      const documentResult = await openAIAPI.generateClientDocument(documentData)
      
      // Parse and structure the document sections
      const sections = [
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          content: documentResult.executiveSummary || 'Executive summary will be generated here.',
          editable: true
        },
        {
          id: 'recommended-solutions',
          title: 'Recommended AI Solutions',
          content: documentResult.recommendedSolutions || 'Recommended solutions will be generated here.',
          editable: true
        },
        {
          id: 'solution-examples',
          title: 'What Each Solution Will Look Like',
          content: documentResult.solutionExamples || 'Solution examples will be generated here.',
          editable: true
        },
        {
          id: 'client-role',
          title: 'Your Role & Time Investment',
          content: documentResult.clientRole || 'Client role and responsibilities will be outlined here.',
          editable: true
        },
        {
          id: 'timeline',
          title: 'Timeline Expectations',
          content: documentResult.timeline || 'Timeline expectations will be provided here.',
          editable: true
        },
        {
          id: 'next-steps',
          title: 'Next Steps',
          content: documentResult.nextSteps || 'Next steps will be outlined here.',
          editable: true
        }
      ]

      setDocumentSections(sections)
      setClientDocument(documentResult)
      setIsEditingDocument(true)
      
      // Set document for display
      const formattedDoc = formatDocumentForCopy('client', documentResult)
      setDocumentToDisplay(formattedDoc)
      setCurrentDocumentType('client')
      
    } catch (error) {
      console.error('Document generation failed:', error)
      alert('Failed to generate client document. Please try again.')
    }
    
    setIsGeneratingDocument(false)
  }

  const updateDocumentSection = (sectionId, content) => {
    setDocumentSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, content } : section
    ))
  }

  const addDocumentSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      content: 'Add your content here...',
      editable: true
    }
    setDocumentSections(prev => [...prev, newSection])
  }

  const removeDocumentSection = (sectionId) => {
    setDocumentSections(prev => prev.filter(section => section.id !== sectionId))
  }

  const saveDocumentDraft = () => {
    // Save to localStorage for now (could be enhanced with Supabase)
    const draft = {
      sections: documentSections,
      timestamp: new Date().toISOString(),
      clientName: formData.clientName
    }
    localStorage.setItem('clientDocumentDraft', JSON.stringify(draft))
    alert('Document draft saved successfully!')
  }

  const exportToPDF = () => {
    // Simple PDF export using browser print functionality
    const printWindow = window.open('', '_blank')
    const documentContent = documentSections.map(section => 
      `<h2>${section.title}</h2><div>${section.content.replace(/\n/g, '<br>')}</div>`
    ).join('<br><br>')
    
    printWindow.document.write(`
      <html>
        <head>
          <title>What's Possible & Your Role - ${formData.clientName || 'Client'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h2 { color: #6B46C1; border-bottom: 2px solid #6B46C1; padding-bottom: 10px; }
            .header { text-align: center; margin-bottom: 40px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>What's Possible & Your Role</h1>
            <p><strong>Client:</strong> ${formData.clientName || 'Client'}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          ${documentContent}
          <div class="footer">
            <p>Generated by THB Operations Hub</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const calculatePricingBreakdown = async () => {
    setIsCalculatingPricing(true)
    
    try {
      // Get included areas only
      const includedAreas = feasibilityAnalysis.areas.filter(area => 
        !excludedAreas.includes(area.areaName)
      )

      if (includedAreas.length === 0) {
        alert('Please include at least one opportunity area in your project scope.')
        setIsCalculatingPricing(false)
        return
      }

      // Prepare data for pricing calculation
      const pricingData = {
        clientContext: formData.clientContext,
        includedAreas: includedAreas
      }

      // Use OpenAI API for pricing calculation
      const pricingResult = await openAIAPI.calculatePricingBreakdown(pricingData)
      setPricingBreakdown(pricingResult)
      
      // Set document for display
      const formattedDoc = formatDocumentForCopy('pricing', pricingResult)
      setDocumentToDisplay(formattedDoc)
      setCurrentDocumentType('pricing')
      
    } catch (error) {
      console.error('Pricing calculation failed:', error)
      alert('Failed to calculate pricing breakdown. Please try again.')
    }
    
    setIsCalculatingPricing(false)
  }

  const updateManualAdjustment = (component, value) => {
    setManualAdjustments(prev => ({
      ...prev,
      [component]: value ? parseFloat(value) : null
    }))
  }

  const getAdjustedPricing = () => {
    if (!pricingBreakdown) return null

    const developmentFee = manualAdjustments.developmentFee !== null 
      ? manualAdjustments.developmentFee 
      : pricingBreakdown.developmentFee.recommended

    const consultingHours = manualAdjustments.consultingHours !== null 
      ? manualAdjustments.consultingHours 
      : pricingBreakdown.consultingSetup.estimatedHours

    const consultingTotal = consultingHours * pricingBreakdown.consultingSetup.hourlyRate

    const monthlyFee = manualAdjustments.monthlyFee !== null 
      ? manualAdjustments.monthlyFee 
      : pricingBreakdown.ongoingCosts.monthlyFee

    const totalProjectCost = developmentFee + consultingTotal

    return {
      developmentFee,
      consultingSetup: {
        ...pricingBreakdown.consultingSetup,
        estimatedHours: consultingHours,
        totalCost: consultingTotal
      },
      ongoingCosts: {
        ...pricingBreakdown.ongoingCosts,
        monthlyFee: monthlyFee,
        annualFee: monthlyFee * 12
      },
      totalProjectCost,
      summary: `Total project investment: $${totalProjectCost.toLocaleString()} (one-time) plus $${monthlyFee}/month ongoing costs.`
    }
  }

  const generateEnhancedSOW = async () => {
    setIsGeneratingEnhancedSOW(true)
    
    try {
      // Get included areas only
      const includedAreas = feasibilityAnalysis.areas.filter(area => 
        !excludedAreas.includes(area.areaName)
      )

      if (includedAreas.length === 0) {
        alert('Please include at least one opportunity area in your project scope.')
        setIsGeneratingEnhancedSOW(false)
        return
      }

      if (!pricingBreakdown) {
        alert('Please calculate pricing breakdown first.')
        setIsGeneratingEnhancedSOW(false)
        return
      }

      // Prepare comprehensive SOW data
      const sowData = {
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientType: formData.clientType,
        timeline: formData.timeline,
        clientContext: formData.clientContext,
        includedAreas: includedAreas,
        pricingBreakdown: pricingBreakdown,
        clientDocument: clientDocument
      }

      // Use OpenAI API for enhanced SOW generation
      const sowResult = await openAIAPI.generateEnhancedSOW(sowData)
      
      // Structure the SOW sections
      const sections = [
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          content: sowResult.executiveSummary || 'Executive summary will be generated here.',
          editable: true
        },
        {
          id: 'project-scope',
          title: 'Project Scope & Objectives',
          content: sowResult.projectScope || 'Project scope will be outlined here.',
          editable: true
        },
        {
          id: 'deliverables',
          title: 'Detailed Deliverables',
          content: sowResult.deliverables ? sowResult.deliverables.map(deliverable => 
            `${deliverable.area}:\n${deliverable.description}\n\nDeliverables:\n${deliverable.deliverables.map(d => `• ${d}`).join('\n')}\n\nTimeline: ${deliverable.timeline}`
          ).join('\n\n') : 'Deliverables will be detailed here.',
          editable: true
        },
        {
          id: 'pricing',
          title: 'Pricing & Investment',
          content: `Pricing Tier: ${sowResult.pricing.tier}\n\nDevelopment Fee: $${sowResult.pricing.developmentFee.toLocaleString()}\nConsulting & Setup: $${sowResult.pricing.consultingSetup.toLocaleString()}\nOngoing Monthly: $${sowResult.pricing.ongoingMonthly}/month\n\nTotal Project Investment: $${sowResult.pricing.totalProject.toLocaleString()}`,
          editable: true
        },
        {
          id: 'timeline',
          title: 'Project Timeline & Milestones',
          content: `Total Duration: ${sowResult.timeline.totalDuration}\n\nMilestones:\n${sowResult.timeline.milestones.map(milestone => `• ${milestone}`).join('\n')}`,
          editable: true
        },
        {
          id: 'client-responsibilities',
          title: 'Client Responsibilities',
          content: sowResult.clientResponsibilities.map(responsibility => `• ${responsibility}`).join('\n'),
          editable: true
        },
        {
          id: 'terms-conditions',
          title: 'Terms & Conditions',
          content: sowResult.termsConditions.map(term => `• ${term}`).join('\n'),
          editable: true
        },
        {
          id: 'next-steps',
          title: 'Next Steps & Approval Process',
          content: sowResult.nextSteps.map(step => `• ${step}`).join('\n'),
          editable: true
        }
      ]

      setSowSections(sections)
      setEnhancedSOW(sowResult)
      setIsEditingSOW(true)
      
      // Set document for display
      const formattedDoc = formatDocumentForCopy('sow', sowResult)
      setDocumentToDisplay(formattedDoc)
      setCurrentDocumentType('sow')
      
    } catch (error) {
      console.error('Enhanced SOW generation failed:', error)
      alert('Failed to generate enhanced SOW. Please try again.')
    }
    
    setIsGeneratingEnhancedSOW(false)
  }

  const addToPipeline = () => {
    if (!pricingBreakdown) {
      alert('Please generate pricing breakdown first.')
      return
    }

    const prospect = {
      clientName: formData.clientContext.clientName || 'Prospect Client',
      clientEmail: formData.clientContext.clientEmail || '',
      clientPhone: formData.clientContext.clientPhone || '',
      projectTitle: `AI Automation Project - ${formData.clientContext.organizationType || 'Client'}`,
      projectDescription: formData.discoveryNotes || 'AI automation project based on opportunity assessment',
      estimatedValue: pricingBreakdown.totalProjectCost,
      notes: `Generated from pricing tool. Strategy: ${strategyGoals.selectedScenario}. Revenue target: $${strategyGoals.revenueTarget.toLocaleString()}`,
      pricingBreakdown: pricingBreakdown,
      feasibilityAnalysis: feasibilityAnalysis,
      source: 'pricing-tool'
    }

    addProspect(prospect)
    alert('Prospect added to pipeline! You can now convert them to an active project in the Project Pipeline module.')
  }

  const updateSOWSection = (sectionId, content) => {
    setSowSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, content } : section
    ))
  }

  const saveSOWTemplate = () => {
    const template = {
      name: `${formData.clientName || 'Client'} - ${new Date().toLocaleDateString()}`,
      sections: sowSections,
      timestamp: new Date().toISOString(),
      clientType: formData.clientType,
      pricingTier: pricingBreakdown?.pricingTier
    }
    
    const templates = JSON.parse(localStorage.getItem('sowTemplates') || '[]')
    templates.push(template)
    localStorage.setItem('sowTemplates', JSON.stringify(templates))
    setSowTemplates(templates)
    alert('SOW template saved successfully!')
  }

  const loadSOWTemplate = (template) => {
    setSowSections(template.sections)
    setIsEditingSOW(true)
    alert(`Loaded template: ${template.name}`)
  }

  const exportSOWToPDF = () => {
    const printWindow = window.open('', '_blank')
    const sowContent = sowSections.map(section => 
      `<h2>${section.title}</h2><div>${section.content.replace(/\n/g, '<br>')}</div>`
    ).join('<br><br>')
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Statement of Work - ${formData.clientName || 'Client'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #6B46C1; text-align: center; border-bottom: 3px solid #6B46C1; padding-bottom: 20px; }
            h2 { color: #6B46C1; border-bottom: 2px solid #6B46C1; padding-bottom: 10px; margin-top: 30px; }
            .header { text-align: center; margin-bottom: 40px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            .branding { color: #6B46C1; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>STATEMENT OF WORK</h1>
            <p class="branding">THB Operations Hub</p>
            <p><strong>Client:</strong> ${formData.clientName || 'Client'}</p>
            <p><strong>Email:</strong> ${formData.clientEmail || 'TBD'}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          ${sowContent}
          <div class="footer">
            <p>Generated by THB Operations Hub - AI-Powered Business Solutions</p>
            <p>This SOW is valid for 30 days from the date of issue.</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }


  const simulateAIAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      // Use real Claude API for analysis
      const analysisResult = await claudeAPI.analyzeProjectComplexity({
        clientType: formData.clientType,
        timeline: formData.timeline,
        budget: formData.budgetRange,
        clientContext: formData.clientContext,
        aiAssessment: formData.aiAssessment
      })
      
      // Convert Claude response to our format
      const complexityScore = analysisResult.complexity
      const pricingMatch = analysisResult.pricing.match(/\$([0-9,]+).*?\$([0-9,]+)/)
      const minPrice = pricingMatch ? parseInt(pricingMatch[1].replace(',', '')) : 10000
      const maxPrice = pricingMatch ? parseInt(pricingMatch[2].replace(',', '')) : 25000
      const recommended = Math.round((minPrice + maxPrice) / 2)
      
      const analysisData = {
        complexityScore,
        pricingRange: { min: minPrice, max: maxPrice, recommended },
        timeline: analysisResult.timeline,
        recommendations: analysisResult.recommendations,
        aiOpportunities: analysisResult.aiOpportunities || [],
        sowGenerated: true
      }
      
      setAnalysis(analysisData)
      
      // Save project to Supabase
      const projectData = {
        ...formData,
        analysis: analysisData,
        created_at: new Date().toISOString()
      }
      
      await supabaseService.saveProject(projectData)
      
    } catch (error) {
      console.error('Analysis failed:', error)
      // Fallback to simulated analysis
      const complexityScore = Math.floor(Math.random() * 5) + 5 // 5-10
      const basePrice = 15000 + (complexityScore * 2000)
      const clientMultiplier = clientTypes.find(ct => ct.value === formData.clientType)?.multiplier || 1.0
      const timelineMultiplier = timelineOptions.find(to => to.value === formData.timeline)?.multiplier || 1.0
      
      const finalPrice = Math.round(basePrice * clientMultiplier * timelineMultiplier)
      const minPrice = Math.round(finalPrice * 0.85)
      const maxPrice = Math.round(finalPrice * 1.15)
      
      const estimatedWeeks = Math.ceil(4 + (complexityScore * 0.8))
      
      setAnalysis({
        complexityScore,
        pricingRange: { min: minPrice, max: maxPrice, recommended: finalPrice },
        timeline: estimatedWeeks,
        recommendations: ['Custom automation workflow design', 'Integration with existing systems'],
        sowGenerated: true
      })
    }
    
    setIsAnalyzing(false)
  }

  const generateSOW = async () => {
    if (!analysis) return
    
    setIsGeneratingSOW(true)
    
    try {
      // Use Claude API to generate SOW
      const sowContent = await claudeAPI.generateSOW(formData, analysis)
      setSowDocument(sowContent)
    } catch (error) {
      console.error('SOW generation failed:', error)
      // Fallback to template-based SOW
      const sowContent = `
STATEMENT OF WORK
THB Operations Hub - Custom Automation Project

Client: ${formData.clientName || 'TBD'}
Email: ${formData.clientEmail || 'TBD'}
Date: ${new Date().toLocaleDateString()}

PROJECT OVERVIEW
${formData.projectDescription}

CLIENT TYPE
${clientTypes.find(ct => ct.value === formData.clientType)?.label || 'Not specified'}

REQUESTED FEATURES
${formData.features.map(feature => `• ${feature}`).join('\n')}

TIMELINE REQUIREMENTS
${timelineOptions.find(to => to.value === formData.timeline)?.label || 'Not specified'}

PROJECT COMPLEXITY ANALYSIS
Complexity Score: ${analysis?.complexityScore}/10
Estimated Duration: ${analysis?.timeline} weeks
Recommended Budget: $${analysis?.pricingRange.recommended.toLocaleString()}

SCOPE OF WORK
This project includes the development and implementation of a custom automation hub tailored to the client's specific needs. The solution will integrate multiple systems and provide automated workflows to streamline operations.

DELIVERABLES
• Custom automation hub development
• Integration with existing systems
• User training and documentation
• 30-day post-launch support

TIMELINE
Project duration: ${analysis?.timeline} weeks
Milestones will be established during project kickoff

INVESTMENT
Recommended investment: $${analysis?.pricingRange.recommended.toLocaleString()}
Range: $${analysis?.pricingRange.min.toLocaleString()} - $${analysis?.pricingRange.max.toLocaleString()}

TERMS
• 50% deposit required to begin work
• Remaining balance due upon project completion
• Payment terms: Net 30
• Change requests may affect timeline and budget

This SOW is valid for 30 days from the date of issue.
      `.trim()
      
      setSowDocument(sowContent)
    }
    
    setIsGeneratingSOW(false)
  }

  // Tab navigation component
  const TabNavigation = () => (
    <div style={{ marginBottom: 'var(--spacing-6)' }}>
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid rgba(148, 163, 184, 0.2)',
        marginBottom: 'var(--spacing-6)'
      }}>
        {[
          { id: 'pricing', label: '💰 Pricing Analysis', icon: '💰' },
          { id: 'pipeline', label: '📈 Prospect Pipeline', icon: '📈' },
          { id: 'revenue', label: '💵 Revenue Tracking', icon: '💵' },
          { id: 'planning', label: '📊 Strategic Planning', icon: '📊' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: 'var(--spacing-4) var(--spacing-6)',
              backgroundColor: activeTab === tab.id ? 'var(--primary-purple)' : 'transparent',
              color: activeTab === tab.id ? 'var(--white)' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary-purple)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 'var(--font-size-base)',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          🏢 Business Management System
        </h1>

        <TabNavigation />

        {/* Tab Content */}
        {activeTab === 'pricing' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-8)' }}>
          {/* Form Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Project Information</h2>
            
            {/* Service Selection */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>Service Selection</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                {Object.entries(businessState.serviceDefinitions).map(([key, service]) => (
                  <div key={key} style={{ marginBottom: 'var(--spacing-3)' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: 'var(--spacing-3)',
                      backgroundColor: formData.selectedService === key ? 'var(--primary-purple)' : 'var(--dark-black)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                      <input
                        type="radio"
                        name="service"
                        value={key}
                        checked={formData.selectedService === key}
                        onChange={(e) => handleInputChange('selectedService', e.target.value)}
                        style={{ marginRight: 'var(--spacing-3)' }}
                      />
                      <div>
                        <div style={{ color: formData.selectedService === key ? 'var(--white)' : 'var(--white)', fontWeight: '600' }}>
                          {service.name}
                        </div>
                        <div style={{ color: formData.selectedService === key ? 'var(--white)' : 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                          ${service.priceRange} • {service.weeks} weeks
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Information */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>Client Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                    placeholder="client@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Client Context */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>
                🏢 Client Context
              </h3>
                   <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                     Organization details to provide better recommendations and pricing.
                   </p>

              {/* Organization Type */}
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                  Organization Type *
                </label>
                <select
                  value={formData.clientContext.organizationType}
                  onChange={(e) => handleClientContextChange('organizationType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  <option value="">Select organization type</option>
                  {organizationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Organization Mission */}
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                  Organization Mission/Focus
                </label>
                <textarea
                  value={formData.clientContext.organizationMission}
                  onChange={(e) => handleClientContextChange('organizationMission', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-sm)',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your organization's mission and focus areas..."
                />
              </div>

              {/* Team Size and Tech Comfort */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                    Team Size
                  </label>
                  <select
                    value={formData.clientContext.teamSize}
                    onChange={(e) => handleClientContextChange('teamSize', e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    <option value="">Select team size</option>
                    {teamSizes.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                    Tech Comfort Level
                  </label>
                  <select
                    value={formData.clientContext.techComfortLevel}
                    onChange={(e) => handleClientContextChange('techComfortLevel', e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  >
                    <option value="">Select comfort level</option>
                    {techComfortLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Goal */}
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                  Primary Goal for AI Project
                </label>
                <select
                  value={formData.clientContext.primaryGoal}
                  onChange={(e) => handleClientContextChange('primaryGoal', e.target.value)}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  <option value="">Select primary goal</option>
                  {primaryGoals.map(goal => (
                    <option key={goal.value} value={goal.value}>{goal.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client Type */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                Client Type *
              </label>
              <select
                value={formData.clientType}
                onChange={(e) => handleInputChange('clientType', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                <option value="">Select client type</option>
                {clientTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Timeline Requirements */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                Timeline Requirements
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                <option value="">Select timeline</option>
                {timelineOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                Budget Range (if known)
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  backgroundColor: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-sm)'
                }}
              >
                <option value="">Select budget range</option>
                {budgetRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* AI Opportunity Assessment */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--white)' }}>
                  🤖 AI Opportunity Assessment
                </h3>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                Select all opportunities that apply. You can select multiple items in each category or indicate if the client needs guidance. This helps us provide better recommendations.
              </p>

              {Object.entries(aiOpportunityCategories).map(([categoryKey, category]) => (
                <div key={categoryKey} style={{
                  marginBottom: 'var(--spacing-6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'rgba(148, 163, 184, 0.05)'
                }}>
                  <h4 style={{ 
                    fontSize: 'var(--font-size-lg)', 
                    fontWeight: '600', 
                    color: 'var(--white)',
                    margin: '0 0 var(--spacing-4) 0'
                  }}>
                    {category.title}
                  </h4>
                  
                  <div style={{ display: 'grid', gap: 'var(--spacing-3)' }}>
                    {category.options.map((option) => {
                      const isSelected = formData.aiAssessment[categoryKey]?.includes(option) || false
                      return (
                        <div key={option} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                          <input
                            type="checkbox"
                            id={`${categoryKey}-${option}`}
                            checked={isSelected}
                            onChange={() => handleAIAssessmentCheckbox(categoryKey, option)}
                            style={{
                              width: '16px',
                              height: '16px',
                              accentColor: 'var(--primary-purple)'
                            }}
                          />
                          <label 
                            htmlFor={`${categoryKey}-${option}`}
                            style={{ 
                              color: 'var(--text-secondary)',
                              fontSize: 'var(--font-size-sm)',
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            {option}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Discovery Notes & Client Summary */}
              <div style={{
                marginTop: 'var(--spacing-6)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-4)',
                backgroundColor: 'rgba(148, 163, 184, 0.05)'
              }}>
                <h4 style={{ 
                  fontSize: 'var(--font-size-lg)', 
                  fontWeight: '600', 
                  color: 'var(--white)',
                  margin: '0 0 var(--spacing-4) 0'
                }}>
                  Discovery Notes & Client Summary
                </h4>
                <textarea
                  value={formData.discoveryNotes}
                  onChange={(e) => handleInputChange('discoveryNotes', e.target.value)}
                  placeholder="Add your notes from the discovery conversation, client context, specific challenges mentioned, and any additional insights..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: 'var(--spacing-3)',
                    backgroundColor: 'var(--white)',
                    color: 'var(--black)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            {/* Analyze Opportunities Button */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <button
                onClick={analyzeFeasibility}
                disabled={isAnalyzingFeasibility || !hasSelectedOpportunities()}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'var(--secondary-blue)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: '600',
                  cursor: isAnalyzingFeasibility ? 'not-allowed' : 'pointer',
                  opacity: (isAnalyzingFeasibility || !hasSelectedOpportunities()) ? 0.6 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {isAnalyzingFeasibility ? '🤖 Analyzing Opportunities...' : '🔍 Analyze Opportunities'}
              </button>
            </div>

            {/* Feasibility Analysis Results */}
            {feasibilityAnalysis && (
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>
                  📊 Feasibility Analysis Results
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                  AI-powered analysis of your opportunity areas with feasibility scores and recommendations.
                </p>

                {feasibilityAnalysis.areas && feasibilityAnalysis.areas.map((area, index) => {
                  const isExpanded = expandedFeasibility[area.areaName]
                  const isExcluded = excludedAreas.includes(area.areaName)
                  const feasibilityColor = getFeasibilityColor(area.feasibility)

                  return (
                    <div key={index} style={{
                      marginBottom: 'var(--spacing-4)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      opacity: isExcluded ? 0.6 : 1,
                      backgroundColor: isExcluded ? 'rgba(148, 163, 184, 0.05)' : 'transparent'
                    }}>
                      <div
                        onClick={() => toggleFeasibilityExpansion(area.areaName)}
                        style={{
                          padding: 'var(--spacing-4)',
                          backgroundColor: isExcluded ? 'rgba(148, 163, 184, 0.05)' : 'rgba(148, 163, 184, 0.05)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: isExpanded ? '1px solid rgba(148, 163, 184, 0.2)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: feasibilityColor
                          }} />
                          <div>
                            <h4 style={{ 
                              fontSize: 'var(--font-size-base)', 
                              fontWeight: '600', 
                              color: 'var(--white)',
                              margin: '0 0 var(--spacing-1) 0'
                            }}>
                              {area.areaName}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                              <span style={{ 
                                fontSize: 'var(--font-size-sm)', 
                                color: feasibilityColor,
                                fontWeight: '600',
                                textTransform: 'uppercase'
                              }}>
                                {area.feasibility} Feasibility
                              </span>
                              <span style={{ 
                                fontSize: 'var(--font-size-sm)', 
                                color: 'var(--text-secondary)'
                              }}>
                                • {area.complexity} Complexity
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleAreaExclusion(area.areaName)
                            }}
                            style={{
                              padding: 'var(--spacing-1) var(--spacing-2)',
                              backgroundColor: isExcluded ? 'var(--primary-purple)' : 'transparent',
                              color: isExcluded ? 'var(--white)' : 'var(--text-secondary)',
                              border: '1px solid rgba(148, 163, 184, 0.3)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: 'var(--font-size-xs)',
                              cursor: 'pointer'
                            }}
                          >
                            {isExcluded ? 'Included' : 'Exclude'}
                          </button>
                          <span style={{ 
                            fontSize: 'var(--font-size-lg)',
                            color: 'var(--text-secondary)',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }}>
                            ▼
                          </span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ padding: 'var(--spacing-4)' }}>
                          <div style={{ marginBottom: 'var(--spacing-4)' }}>
                            <h5 style={{ 
                              fontSize: 'var(--font-size-sm)', 
                              fontWeight: '600', 
                              color: 'var(--white)',
                              margin: '0 0 var(--spacing-2) 0'
                            }}>
                              What's Possible
                            </h5>
                            <p style={{ 
                              fontSize: 'var(--font-size-sm)', 
                              color: 'var(--text-primary)',
                              margin: '0',
                              lineHeight: '1.5'
                            }}>
                              {area.explanation}
                            </p>
                          </div>

                          <div style={{ marginBottom: 'var(--spacing-4)' }}>
                            <h5 style={{ 
                              fontSize: 'var(--font-size-sm)', 
                              fontWeight: '600', 
                              color: 'var(--white)',
                              margin: '0 0 var(--spacing-2) 0'
                            }}>
                              Limitations & Considerations
                            </h5>
                            <p style={{ 
                              fontSize: 'var(--font-size-sm)', 
                              color: 'var(--text-primary)',
                              margin: '0',
                              lineHeight: '1.5'
                            }}>
                              {area.limitations}
                            </p>
                          </div>

                          <div>
                            <h5 style={{ 
                              fontSize: 'var(--font-size-sm)', 
                              fontWeight: '600', 
                              color: 'var(--white)',
                              margin: '0 0 var(--spacing-2) 0'
                            }}>
                              Recommendations
                            </h5>
                            <ul style={{ margin: '0', paddingLeft: 'var(--spacing-4)' }}>
                              {area.recommendations.map((rec, recIndex) => (
                                <li key={recIndex} style={{ 
                                  fontSize: 'var(--font-size-sm)', 
                                  color: 'var(--text-primary)',
                                  marginBottom: 'var(--spacing-1)',
                                  lineHeight: '1.5'
                                }}>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Generate Client Document Button */}
            {feasibilityAnalysis && (
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <button
                  onClick={generateClientDocument}
                  disabled={isGeneratingDocument || excludedAreas.length === feasibilityAnalysis.areas.length}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-4)',
                    backgroundColor: 'var(--primary-purple)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600',
                    cursor: isGeneratingDocument ? 'not-allowed' : 'pointer',
                    opacity: (isGeneratingDocument || excludedAreas.length === feasibilityAnalysis.areas.length) ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isGeneratingDocument ? '📝 Generating Document...' : '📄 Generate Client Document'}
                </button>
              </div>
            )}

            {/* Client Document Editor */}
            {isEditingDocument && documentSections.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--white)' }}>
                    📄 What's Possible & Your Role
                  </h3>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <button
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      style={{
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        backgroundColor: isPreviewMode ? 'var(--secondary-blue)' : 'transparent',
                        color: isPreviewMode ? 'var(--white)' : 'var(--text-secondary)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-size-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      {isPreviewMode ? 'Edit' : 'Preview'}
                    </button>
                    <button
                      onClick={saveDocumentDraft}
                      style={{
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-size-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={exportToPDF}
                      style={{
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        backgroundColor: 'var(--primary-purple)',
                        color: 'var(--white)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-size-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      Export PDF
                    </button>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                  AI-generated client education document. Edit each section before sharing with your client.
                </p>

                {documentSections.map((section, index) => (
                  <div key={section.id} style={{
                    marginBottom: 'var(--spacing-4)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: 'var(--spacing-4)',
                      backgroundColor: 'rgba(148, 163, 184, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <h4 style={{ 
                        fontSize: 'var(--font-size-base)', 
                        fontWeight: '600', 
                        color: 'var(--white)',
                        margin: '0'
                      }}>
                        {section.title}
                      </h4>
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <button
                          onClick={() => {
                            const newTitle = prompt('Enter new section title:', section.title)
                            if (newTitle) {
                              setDocumentSections(prev => prev.map(s => 
                                s.id === section.id ? { ...s, title: newTitle } : s
                              ))
                            }
                          }}
                          style={{
                            padding: 'var(--spacing-1) var(--spacing-2)',
                            backgroundColor: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--font-size-xs)',
                            cursor: 'pointer'
                          }}
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => removeDocumentSection(section.id)}
                          style={{
                            padding: 'var(--spacing-1) var(--spacing-2)',
                            backgroundColor: 'transparent',
                            color: '#EF4444',
                            border: '1px solid #EF4444',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--font-size-xs)',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: 'var(--spacing-4)' }}>
                      {isPreviewMode ? (
                        <div style={{
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--text-primary)',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {section.content}
                        </div>
                      ) : (
                        <textarea
                          value={section.content}
                          onChange={(e) => updateDocumentSection(section.id, e.target.value)}
                          rows={6}
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-3)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--text-primary)',
                            fontSize: 'var(--font-size-sm)',
                            resize: 'vertical',
                            lineHeight: '1.5'
                          }}
                          placeholder="Enter section content..."
                        />
                      )}
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--spacing-4)' }}>
                  <button
                    onClick={addDocumentSection}
                    style={{
                      padding: 'var(--spacing-2) var(--spacing-4)',
                      backgroundColor: 'transparent',
                      color: 'var(--primary-purple)',
                      border: '1px solid var(--primary-purple)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Section
                  </button>
                </div>
              </div>
            )}

            {/* Calculate Pricing Button */}
            {feasibilityAnalysis && (
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <button
                  onClick={calculatePricingBreakdown}
                  disabled={isCalculatingPricing || excludedAreas.length === feasibilityAnalysis.areas.length}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-4)',
                    backgroundColor: 'var(--secondary-blue)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600',
                    cursor: isCalculatingPricing ? 'not-allowed' : 'pointer',
                    opacity: (isCalculatingPricing || excludedAreas.length === feasibilityAnalysis.areas.length) ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isCalculatingPricing ? '💰 Calculating Pricing...' : '💰 Calculate 3-Component Pricing'}
                </button>
              </div>
            )}

            {/* Pricing Breakdown Display */}
            {pricingBreakdown && (
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>
                  💰 3-Component Pricing Breakdown
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                  AI-calculated pricing based on feasibility analysis and organizational context.
                </p>

                {(() => {
                  const adjustedPricing = getAdjustedPricing()
                  return (
                    <div>
                      {/* Pricing Tier */}
                      <div style={{ marginBottom: 'var(--spacing-4)' }}>
                        <div style={{
                          backgroundColor: 'var(--dark-black)',
                          padding: 'var(--spacing-4)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-purple)' }}>
                            {pricingBreakdown.pricingTier}
                          </div>
                          <p style={{ color: 'var(--text-secondary)', margin: 'var(--spacing-1) 0 0 0', fontSize: 'var(--font-size-sm)' }}>
                            {pricingBreakdown.developmentFee.explanation}
                          </p>
                        </div>
                      </div>

                      {/* Development Fee */}
                      <div style={{ marginBottom: 'var(--spacing-4)' }}>
                        <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: '600', color: 'var(--white)', margin: '0 0 var(--spacing-2) 0' }}>
                          1. Development Fee
                        </h4>
                        <div style={{
                          backgroundColor: 'var(--dark-black)',
                          padding: 'var(--spacing-4)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                              Custom AI solution development
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                              <input
                                type="number"
                                value={manualAdjustments.developmentFee !== null ? manualAdjustments.developmentFee : ''}
                                onChange={(e) => updateManualAdjustment('developmentFee', e.target.value)}
                                placeholder={adjustedPricing.developmentFee.toString()}
                                style={{
                                  width: '100px',
                                  padding: 'var(--spacing-1) var(--spacing-2)',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  backgroundColor: 'var(--card-bg)',
                                  color: 'var(--text-primary)',
                                  fontSize: 'var(--font-size-sm)',
                                  textAlign: 'right'
                                }}
                              />
                              <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>or</span>
                              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', color: 'var(--primary-purple)' }}>
                                ${adjustedPricing.developmentFee.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <p style={{ color: 'var(--text-secondary)', margin: '0', fontSize: 'var(--font-size-sm)' }}>
                            Range: ${pricingBreakdown.developmentFee.min.toLocaleString()} - ${pricingBreakdown.developmentFee.max.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Consulting & Setup */}
                      <div style={{ marginBottom: 'var(--spacing-4)' }}>
                        <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: '600', color: 'var(--white)', margin: '0 0 var(--spacing-2) 0' }}>
                          2. Consulting & Setup
                        </h4>
                        <div style={{
                          backgroundColor: 'var(--dark-black)',
                          padding: 'var(--spacing-4)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                              Implementation, training, and support
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                              <input
                                type="number"
                                value={manualAdjustments.consultingHours !== null ? manualAdjustments.consultingHours : ''}
                                onChange={(e) => updateManualAdjustment('consultingHours', e.target.value)}
                                placeholder={adjustedPricing.consultingSetup.estimatedHours.toString()}
                                style={{
                                  width: '80px',
                                  padding: 'var(--spacing-1) var(--spacing-2)',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  backgroundColor: 'var(--card-bg)',
                                  color: 'var(--text-primary)',
                                  fontSize: 'var(--font-size-sm)',
                                  textAlign: 'right'
                                }}
                              />
                              <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>hours × $150</span>
                              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', color: 'var(--secondary-blue)' }}>
                                ${adjustedPricing.consultingSetup.totalCost.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <p style={{ color: 'var(--text-secondary)', margin: '0', fontSize: 'var(--font-size-sm)' }}>
                            {pricingBreakdown.consultingSetup.breakdown}
                          </p>
                        </div>
                      </div>

                      {/* Ongoing Backend Costs */}
                      <div style={{ marginBottom: 'var(--spacing-4)' }}>
                        <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: '600', color: 'var(--white)', margin: '0 0 var(--spacing-2) 0' }}>
                          3. Ongoing Backend Costs
                        </h4>
                        <div style={{
                          backgroundColor: 'var(--dark-black)',
                          padding: 'var(--spacing-4)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid rgba(148, 163, 184, 0.2)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                              Hosting, APIs, and maintenance
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                              <input
                                type="number"
                                value={manualAdjustments.monthlyFee !== null ? manualAdjustments.monthlyFee : ''}
                                onChange={(e) => updateManualAdjustment('monthlyFee', e.target.value)}
                                placeholder={adjustedPricing.ongoingCosts.monthlyFee.toString()}
                                style={{
                                  width: '80px',
                                  padding: 'var(--spacing-1) var(--spacing-2)',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid rgba(148, 163, 184, 0.3)',
                                  backgroundColor: 'var(--card-bg)',
                                  color: 'var(--text-primary)',
                                  fontSize: 'var(--font-size-sm)',
                                  textAlign: 'right'
                                }}
                              />
                              <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>/month</span>
                              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'bold', color: 'var(--primary-purple)' }}>
                                ${adjustedPricing.ongoingCosts.monthlyFee}/month
                              </span>
                            </div>
                          </div>
                          <p style={{ color: 'var(--text-secondary)', margin: '0', fontSize: 'var(--font-size-sm)' }}>
                            {pricingBreakdown.ongoingCosts.breakdown}
                          </p>
                        </div>
                      </div>

                      {/* Total Project Cost */}
                      <div style={{ marginBottom: 'var(--spacing-4)' }}>
                        <div style={{
                          backgroundColor: 'var(--primary-purple)',
                          padding: 'var(--spacing-4)',
                          borderRadius: 'var(--radius-lg)',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--white)' }}>
                            ${adjustedPricing.totalProjectCost.toLocaleString()}
                          </div>
                          <p style={{ color: 'var(--white)', margin: 'var(--spacing-1) 0 0 0', fontSize: 'var(--font-size-sm)' }}>
                            Total Project Investment
                          </p>
                          <p style={{ color: 'var(--white)', margin: 'var(--spacing-2) 0 0 0', fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>
                            Plus ${adjustedPricing.ongoingCosts.monthlyFee}/month ongoing
                          </p>
                        </div>
                      </div>

                      {/* Summary */}
                      <div style={{
                        backgroundColor: 'var(--dark-black)',
                        padding: 'var(--spacing-4)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(148, 163, 184, 0.2)'
                      }}>
                        <p style={{ color: 'var(--text-primary)', margin: '0', fontSize: 'var(--font-size-sm)', lineHeight: '1.5' }}>
                          {adjustedPricing.summary}
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Add to Pipeline Button */}
            {pricingBreakdown && (
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <button
                  onClick={addToPipeline}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-4)',
                    backgroundColor: 'var(--secondary-blue)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: 'var(--spacing-3)'
                  }}
                >
                  📈 Add Prospect to Pipeline
                </button>
                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  textAlign: 'center'
                }}>
                  💡 This will create a prospect in your Project Pipeline that you can convert to an active project when ready.
                </div>
              </div>
            )}

            {/* Generate Enhanced SOW Button */}
            {pricingBreakdown && (
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <button
                  onClick={generateEnhancedSOW}
                  disabled={isGeneratingEnhancedSOW}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-4)',
                    backgroundColor: 'var(--primary-purple)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: '600',
                    cursor: isGeneratingEnhancedSOW ? 'not-allowed' : 'pointer',
                    opacity: isGeneratingEnhancedSOW ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isGeneratingEnhancedSOW ? '📄 Generating Enhanced SOW...' : '📄 Generate Enhanced Statement of Work'}
                </button>
              </div>
            )}

            {/* Enhanced SOW Editor */}
            {isEditingSOW && sowSections.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--white)' }}>
                    📄 Enhanced Statement of Work
                  </h3>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                    <button
                      onClick={() => setSowPreviewMode(!sowPreviewMode)}
                      style={{
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        backgroundColor: sowPreviewMode ? 'var(--secondary-blue)' : 'transparent',
                        color: sowPreviewMode ? 'var(--white)' : 'var(--text-secondary)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-size-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      {sowPreviewMode ? 'Edit' : 'Preview'}
                    </button>
                    <button
                      onClick={saveSOWTemplate}
                      style={{
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-size-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      Save Template
                    </button>
                    <button
                      onClick={exportSOWToPDF}
                      style={{
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        backgroundColor: 'var(--primary-purple)',
                        color: 'var(--white)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-size-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      Export PDF
                    </button>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                  Comprehensive SOW incorporating all discovery data, feasibility analysis, pricing breakdown, and client context.
                </p>

                {sowSections.map((section, index) => (
                  <div key={section.id} style={{
                    marginBottom: 'var(--spacing-4)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      padding: 'var(--spacing-4)',
                      backgroundColor: 'rgba(148, 163, 184, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <h4 style={{ 
                        fontSize: 'var(--font-size-base)', 
                        fontWeight: '600', 
                        color: 'var(--white)',
                        margin: '0'
                      }}>
                        {section.title}
                      </h4>
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <button
                          onClick={() => {
                            const newTitle = prompt('Enter new section title:', section.title)
                            if (newTitle) {
                              setSowSections(prev => prev.map(s => 
                                s.id === section.id ? { ...s, title: newTitle } : s
                              ))
                            }
                          }}
                          style={{
                            padding: 'var(--spacing-1) var(--spacing-2)',
                            backgroundColor: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--font-size-xs)',
                            cursor: 'pointer'
                          }}
                        >
                          Rename
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: 'var(--spacing-4)' }}>
                      {sowPreviewMode ? (
                        <div style={{
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--text-primary)',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {section.content}
                        </div>
                      ) : (
                        <textarea
                          value={section.content}
                          onChange={(e) => updateSOWSection(section.id, e.target.value)}
                          rows={8}
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-3)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            backgroundColor: 'var(--card-bg)',
                            color: 'var(--text-primary)',
                            fontSize: 'var(--font-size-sm)',
                            resize: 'vertical',
                            lineHeight: '1.5'
                          }}
                          placeholder="Enter section content..."
                        />
                      )}
                    </div>
                  </div>
                ))}

                {/* Template Management */}
                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  marginTop: 'var(--spacing-4)'
                }}>
                  <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: '600', color: 'var(--white)', margin: '0 0 var(--spacing-3) 0' }}>
                    📋 SOW Templates
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', margin: '0 0 var(--spacing-3) 0', fontSize: 'var(--font-size-sm)' }}>
                    Save this SOW as a template for similar projects, or load an existing template.
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                    {sowTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => loadSOWTemplate(template)}
                        style={{
                          padding: 'var(--spacing-2) var(--spacing-3)',
                          backgroundColor: 'transparent',
                          color: 'var(--primary-purple)',
                          border: '1px solid var(--primary-purple)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--font-size-sm)',
                          cursor: 'pointer'
                        }}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}




            {/* Analyze Button */}
            <button
              onClick={simulateAIAnalysis}
              disabled={!formData.clientType || isAnalyzing}
              style={{
                width: '100%',
                padding: 'var(--spacing-4)',
                backgroundColor: 'var(--primary-purple)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: '600',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                opacity: (!formData.clientType || isAnalyzing) ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {isAnalyzing ? '🤖 Analyzing Project...' : '🚀 Analyze Project & Generate Pricing'}
            </button>
          </div>

          {/* Results Section */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-6)' }}>
              <h2 className="text-xl font-semibold">
                {currentDocumentType === 'feasibility' && '📊 Feasibility Analysis'}
                {currentDocumentType === 'client' && '📋 Client Document'}
                {currentDocumentType === 'pricing' && '💰 Pricing Breakdown'}
                {currentDocumentType === 'sow' && '📄 Statement of Work'}
                {!currentDocumentType && '📄 Document Preview'}
              </h2>
              
              {documentToDisplay && (
                <button
                  onClick={copyDocumentToClipboard}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    backgroundColor: 'var(--primary-purple)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)'
                  }}
                >
                  📋 Copy Document
                </button>
              )}
            </div>
            
            {!documentToDisplay ? (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>📄</div>
                <p>Complete the workflow steps to generate professional documents that you can copy and paste into Google Docs.</p>
                <div style={{ marginTop: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                  <p><strong>Available Documents:</strong></p>
                  <p>• Feasibility Analysis - After analyzing opportunities</p>
                  <p>• Client Document - After generating client overview</p>
                  <p>• Pricing Breakdown - After calculating pricing</p>
                  <p>• Statement of Work - After generating SOW</p>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'var(--white)',
                color: 'var(--black)',
                padding: 'var(--spacing-6)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                maxHeight: '70vh',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: 'var(--font-size-sm)',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {documentToDisplay}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Prospect Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
              📈 Prospect Pipeline Management
            </h2>
            
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                <h3 style={{ color: 'var(--white)' }}>Current Prospects ({businessState.prospects.length})</h3>
                <button
                  onClick={() => {
                    if (formData.selectedService && formData.clientName) {
                      const newProspect = {
                        id: Date.now(),
                        clientName: formData.clientName,
                        email: formData.clientEmail,
                        organization: formData.clientContext.organizationType,
                        serviceType: formData.selectedService,
                        estimatedValue: businessState.serviceDefinitions[formData.selectedService]?.avgPrice || 0,
                        status: 'Discovery',
                        dateCreated: new Date().toISOString().split('T')[0],
                        notes: formData.discoveryNotes
                      }
                      setBusinessState(prev => ({
                        ...prev,
                        prospects: [...prev.prospects, newProspect]
                      }))
                      alert('Prospect added to pipeline!')
                    } else {
                      alert('Please complete the pricing analysis first to create a prospect.')
                    }
                  }}
                  style={{
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    backgroundColor: 'var(--secondary-blue)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ➕ Add Prospect from Pricing
                </button>
              </div>
              
              {businessState.prospects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>📈</div>
                  <p>No prospects yet. Complete a pricing analysis to create your first prospect.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
                  {businessState.prospects.map(prospect => (
                    <div key={prospect.id} className="card" style={{ padding: 'var(--spacing-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
                        <h4 style={{ color: 'var(--white)', margin: 0 }}>{prospect.clientName}</h4>
                        <select
                          value={prospect.status}
                          onChange={(e) => {
                            setBusinessState(prev => ({
                              ...prev,
                              prospects: prev.prospects.map(p => 
                                p.id === prospect.id ? { ...p, status: e.target.value } : p
                              )
                            }))
                          }}
                          style={{
                            padding: 'var(--spacing-1) var(--spacing-2)',
                            backgroundColor: 'var(--dark-black)',
                            color: 'var(--white)',
                            border: '1px solid rgba(148, 163, 184, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--font-size-xs)'
                          }}
                        >
                          <option value="Discovery">Discovery</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Negotiating">Negotiating</option>
                          <option value="Closed Won">Closed Won</option>
                          <option value="Closed Lost">Closed Lost</option>
                        </select>
                      </div>
                      
                      <div style={{ marginBottom: 'var(--spacing-3)' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>
                          Service: {businessState.serviceDefinitions[prospect.serviceType]?.name || prospect.serviceType}
                        </div>
                        <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                          ${prospect.estimatedValue?.toLocaleString() || 'TBD'}
                        </div>
                      </div>
                      
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                        Created: {prospect.dateCreated}
                      </div>
                      
                      {prospect.notes && (
                        <div style={{
                          backgroundColor: 'var(--dark-black)',
                          padding: 'var(--spacing-2)',
                          borderRadius: 'var(--radius-sm)',
                          marginTop: 'var(--spacing-3)',
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.4'
                        }}>
                          {prospect.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Revenue Tracking Tab */}
        {activeTab === 'revenue' && (
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
              💵 Revenue Tracking Dashboard
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
              {Object.entries(businessState.serviceDefinitions).map(([key, service]) => {
                const actualClients = businessState.prospects.filter(p => p.serviceType === key && p.status === 'Closed Won').length
                const actualRevenue = actualClients * service.avgPrice
                const target = businessState.targets[key]
                const progress = (actualClients / target.clients) * 100
                
                return (
                  <div key={key} style={{ textAlign: 'center', padding: 'var(--spacing-4)', backgroundColor: 'var(--dark-black)', borderRadius: 'var(--radius-lg)' }}>
                    <h4 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>{service.name}</h4>
                    <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-xl)', fontWeight: 'bold', marginBottom: 'var(--spacing-1)' }}>
                      ${actualRevenue.toLocaleString()}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                      of ${target.revenue.toLocaleString()} target
                    </div>
                    <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
                      {actualClients}/{target.clients} clients
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: 'var(--dark-black)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(progress, 100)}%`,
                        height: '100%',
                        backgroundColor: progress >= 100 ? '#10B981' : 'var(--primary-purple)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div style={{ backgroundColor: 'var(--dark-black)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Overall Progress</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                    ${Object.values(businessState.serviceDefinitions).reduce((sum, service, index) => {
                      const key = Object.keys(businessState.serviceDefinitions)[index]
                      const actualClients = businessState.prospects.filter(p => p.serviceType === key && p.status === 'Closed Won').length
                      return sum + (actualClients * service.avgPrice)
                    }, 0).toLocaleString()}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Revenue</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                    {businessState.prospects.filter(p => p.status === 'Closed Won').length}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Closed Clients</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#10B981', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                    {businessState.prospects.length}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Prospects</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Strategic Planning Tab */}
        {activeTab === 'planning' && (
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
              📊 Strategic Planning & Service Mix Modeling
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
              {/* Service Mix Planning */}
              <div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Service Mix Planning</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-4)' }}>
                  Adjust targets for each service type to model different business scenarios.
                </p>
                
                {Object.entries(businessState.serviceDefinitions).map(([key, service]) => {
                  const target = businessState.targets[key]
                  return (
                    <div key={key} style={{ marginBottom: 'var(--spacing-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
                        <label style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
                          {service.name}
                        </label>
                        <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
                          ${service.avgPrice.toLocaleString()} each
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          step={1}
                          value={target.clients}
                          onChange={(e) => {
                            const newClients = parseInt(e.target.value)
                            setBusinessState(prev => ({
                              ...prev,
                              targets: {
                                ...prev.targets,
                                [key]: {
                                  clients: newClients,
                                  revenue: newClients * service.avgPrice
                                }
                              }
                            }))
                          }}
                          style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: `linear-gradient(to right, var(--primary-purple) 0%, var(--primary-purple) ${(target.clients / 50) * 100}%, rgba(148, 163, 184, 0.3) ${(target.clients / 50) * 100}%, rgba(148, 163, 184, 0.3) 100%)`,
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ color: 'var(--white)', fontWeight: '600', minWidth: '30px' }}>
                          {target.clients}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Planning Summary */}
              <div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Planning Summary</h3>
                
                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  <div style={{ marginBottom: 'var(--spacing-3)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Annual Revenue Target</div>
                    <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>
                      ${Object.values(businessState.targets).reduce((sum, target) => sum + target.revenue, 0).toLocaleString()}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--spacing-3)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Total Clients Target</div>
                    <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                      {Object.values(businessState.targets).reduce((sum, target) => sum + target.clients, 0)}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Average Project Value</div>
                    <div style={{ color: '#10B981', fontSize: 'var(--font-size-lg)', fontWeight: 'bold' }}>
                      ${Math.round(Object.values(businessState.targets).reduce((sum, target) => sum + target.revenue, 0) / Object.values(businessState.targets).reduce((sum, target) => sum + target.clients, 0))}
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(148, 163, 184, 0.2)'
                }}>
                  <h4 style={{ color: 'var(--white)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-3)' }}>
                    Revenue by Service
                  </h4>
                  {Object.entries(businessState.targets).filter(([key]) => key !== 'total').map(([key, target]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        {businessState.serviceDefinitions[key]?.name || key}
                      </span>
                      <span style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
                        ${target.revenue.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PricingSOW
