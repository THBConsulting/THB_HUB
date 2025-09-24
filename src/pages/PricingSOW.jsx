import React, { useState } from 'react'
import { claudeAPI, supabaseService } from '../services/api'

const PricingSOW = () => {
  const [formData, setFormData] = useState({
    clientType: '',
    clientName: '',
    clientEmail: '',
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
      contentCommunication: {
        currentActivities: '',
        painPoints: '',
        interested: false
      },
      dataAnalysis: {
        currentActivities: '',
        painPoints: '',
        interested: false
      },
      processAutomation: {
        currentActivities: '',
        painPoints: '',
        interested: false
      },
      informationManagement: {
        currentActivities: '',
        painPoints: '',
        interested: false
      },
      stakeholderEngagement: {
        currentActivities: '',
        painPoints: '',
        interested: false
      }
    },
    projectDescription: '',
    features: [],
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

  const aiAssessmentCategories = [
    {
      id: 'contentCommunication',
      title: 'Content & Communication',
      description: 'Reports, emails, presentations, social media, newsletters',
      icon: '📝'
    },
    {
      id: 'dataAnalysis',
      title: 'Data & Analysis',
      description: 'Surveys, feedback collection, research, data visualization',
      icon: '📊'
    },
    {
      id: 'processAutomation',
      title: 'Process Automation',
      description: 'Repetitive tasks, approvals, scheduling, workflows',
      icon: '⚙️'
    },
    {
      id: 'informationManagement',
      title: 'Information Management',
      description: 'Document creation, knowledge bases, search, file organization',
      icon: '📚'
    },
    {
      id: 'stakeholderEngagement',
      title: 'Stakeholder Engagement',
      description: 'Forms, dashboards, communication hubs, member portals',
      icon: '🤝'
    }
  ]

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

  const availableFeatures = [
    'Data Integration Hub',
    'Automated Workflows',
    'Custom Dashboard',
    'API Development',
    'Database Design',
    'User Management System',
    'Reporting & Analytics',
    'Mobile App Integration',
    'Third-party Integrations',
    'Custom Forms Builder',
    'Email Automation',
    'Document Management'
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

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const getAssessmentProgress = () => {
    const totalCategories = aiAssessmentCategories.length
    const completedCategories = aiAssessmentCategories.filter(category => {
      const assessment = formData.aiAssessment[category.id]
      return assessment.currentActivities.trim() !== '' || 
             assessment.painPoints.trim() !== '' || 
             assessment.interested
    }).length
    return Math.round((completedCategories / totalCategories) * 100)
  }

  const analyzeFeasibility = async () => {
    setIsAnalyzingFeasibility(true)
    
    try {
      // Get interested areas only
      const interestedAreas = aiAssessmentCategories.filter(category => {
        const assessment = formData.aiAssessment[category.id]
        return assessment.interested && (
          assessment.currentActivities.trim() !== '' || 
          assessment.painPoints.trim() !== ''
        )
      })

      if (interestedAreas.length === 0) {
        alert('Please complete at least one opportunity area and mark it as interested.')
        setIsAnalyzingFeasibility(false)
        return
      }

      // Prepare assessment data for AI analysis
      const assessmentData = interestedAreas.map(category => {
        const assessment = formData.aiAssessment[category.id]
        return {
          area: category.title,
          description: category.description,
          currentActivities: assessment.currentActivities,
          painPoints: assessment.painPoints,
          organizationType: formData.clientContext.organizationType,
          teamSize: formData.clientContext.teamSize,
          techComfortLevel: formData.clientContext.techComfortLevel,
          primaryGoal: formData.clientContext.primaryGoal
        }
      })

      // Use OpenAI API for feasibility analysis
      const feasibilityResult = await openAIAPI.analyzeFeasibility(assessmentData)
      setFeasibilityAnalysis(feasibilityResult)
      
    } catch (error) {
      console.error('Feasibility analysis failed:', error)
      alert('Failed to analyze feasibility. Please try again.')
    }
    
    setIsAnalyzingFeasibility(false)
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

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const simulateAIAnalysis = async () => {
    setIsAnalyzing(true)
    
    try {
      // Use real Claude API for analysis
      const analysisResult = await claudeAPI.analyzeProjectComplexity({
        clientType: formData.clientType,
        description: formData.projectDescription,
        features: formData.features,
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
      const featureMultiplier = 1 + (formData.features.length * 0.1)
      
      const finalPrice = Math.round(basePrice * clientMultiplier * timelineMultiplier * featureMultiplier)
      const minPrice = Math.round(finalPrice * 0.85)
      const maxPrice = Math.round(finalPrice * 1.15)
      
      const estimatedWeeks = Math.ceil(4 + (complexityScore * 0.8) + (formData.features.length * 0.3))
      
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

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          💰 Pricing & SOW Tool
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-8)' }}>
          {/* Form Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Project Information</h2>
            
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
                Help us understand your organization to provide better recommendations and pricing.
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

            {/* AI Opportunity Assessment */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--white)' }}>
                  🤖 AI Opportunity Assessment
                </h3>
                <div style={{
                  backgroundColor: 'var(--primary-purple)',
                  color: 'var(--white)',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '600'
                }}>
                  {getAssessmentProgress()}% Complete
                </div>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--font-size-sm)' }}>
                Help us identify AI opportunities across your organization through guided discovery questions.
              </p>

              {aiAssessmentCategories.map((category) => {
                const assessment = formData.aiAssessment[category.id]
                const isExpanded = expandedCategories[category.id]
                const isComplete = assessment.currentActivities.trim() !== '' || 
                                 assessment.painPoints.trim() !== '' || 
                                 assessment.interested

                return (
                  <div key={category.id} style={{
                    marginBottom: 'var(--spacing-4)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden'
                  }}>
                    <div
                      onClick={() => toggleCategoryExpansion(category.id)}
                      style={{
                        padding: 'var(--spacing-4)',
                        backgroundColor: isComplete ? 'rgba(168, 85, 247, 0.1)' : 'rgba(148, 163, 184, 0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: isExpanded ? '1px solid rgba(148, 163, 184, 0.2)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                        <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                        <div>
                          <h4 style={{ 
                            fontSize: 'var(--font-size-base)', 
                            fontWeight: '600', 
                            color: 'var(--white)',
                            margin: '0 0 var(--spacing-1) 0'
                          }}>
                            {category.title}
                          </h4>
                          <p style={{ 
                            fontSize: 'var(--font-size-sm)', 
                            color: 'var(--text-secondary)',
                            margin: '0'
                          }}>
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        {isComplete && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-purple)'
                          }} />
                        )}
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
                          <label style={{ 
                            display: 'block', 
                            marginBottom: 'var(--spacing-2)', 
                            color: 'var(--text-secondary)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: '500'
                          }}>
                            Current activities in this area
                          </label>
                          <textarea
                            value={assessment.currentActivities}
                            onChange={(e) => handleAIAssessmentChange(category.id, 'currentActivities', e.target.value)}
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
                            placeholder="Describe your current activities in this area..."
                          />
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-4)' }}>
                          <label style={{ 
                            display: 'block', 
                            marginBottom: 'var(--spacing-2)', 
                            color: 'var(--text-secondary)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: '500'
                          }}>
                            Pain points and challenges
                          </label>
                          <textarea
                            value={assessment.painPoints}
                            onChange={(e) => handleAIAssessmentChange(category.id, 'painPoints', e.target.value)}
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
                            placeholder="What challenges or pain points do you face in this area?"
                          />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          <input
                            type="checkbox"
                            id={`${category.id}-interested`}
                            checked={assessment.interested}
                            onChange={(e) => handleAIAssessmentChange(category.id, 'interested', e.target.checked)}
                            style={{
                              width: '16px',
                              height: '16px',
                              accentColor: 'var(--primary-purple)'
                            }}
                          />
                          <label 
                            htmlFor={`${category.id}-interested`}
                            style={{ 
                              color: 'var(--text-secondary)',
                              fontSize: 'var(--font-size-sm)',
                              cursor: 'pointer'
                            }}
                          >
                            Interested in AI solutions for this area
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Analyze Opportunities Button */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <button
                onClick={analyzeFeasibility}
                disabled={isAnalyzingFeasibility || getAssessmentProgress() === 0}
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
                  opacity: (isAnalyzingFeasibility || getAssessmentProgress() === 0) ? 0.6 : 1,
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

            {/* Project Description */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                Project Description *
              </label>
              <textarea
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                rows={4}
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
                placeholder="Describe the project goals, current challenges, and desired outcomes..."
              />
            </div>

            {/* Features */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                Requested Features
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-2)' }}>
                {availableFeatures.map(feature => (
                  <label key={feature} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      style={{ marginRight: 'var(--spacing-2)' }}
                    />
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Timeline */}
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

            {/* Analyze Button */}
            <button
              onClick={simulateAIAnalysis}
              disabled={!formData.clientType || !formData.projectDescription || isAnalyzing}
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
                opacity: (!formData.clientType || !formData.projectDescription || isAnalyzing) ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {isAnalyzing ? '🤖 Analyzing Project...' : '🚀 Analyze Project & Generate Pricing'}
            </button>
          </div>

          {/* Results Section */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">AI Analysis Results</h2>
            
            {!analysis ? (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>🤖</div>
                <p>Complete the form and click "Analyze Project" to get AI-powered pricing recommendations and complexity analysis.</p>
              </div>
            ) : (
              <div>
                {/* Complexity Score */}
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>Project Complexity</h3>
                  <div style={{
                    backgroundColor: 'var(--dark-black)',
                    padding: 'var(--spacing-4)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    border: '1px solid rgba(148, 163, 184, 0.2)'
                  }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-purple)' }}>
                      {analysis.complexityScore}/10
                    </div>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                      {analysis.complexityScore >= 8 ? 'High Complexity' : 
                       analysis.complexityScore >= 6 ? 'Medium-High Complexity' :
                       analysis.complexityScore >= 4 ? 'Medium Complexity' : 'Low-Medium Complexity'}
                    </p>
                  </div>
                </div>

                {/* Pricing */}
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>Pricing Recommendation</h3>
                  <div style={{
                    backgroundColor: 'var(--dark-black)',
                    padding: 'var(--spacing-4)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(148, 163, 184, 0.2)'
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3)' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-blue)' }}>
                        ${analysis.pricingRange.recommended.toLocaleString()}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Recommended Investment</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        Range: ${analysis.pricingRange.min.toLocaleString()}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        ${analysis.pricingRange.max.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ marginBottom: 'var(--spacing-6)' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>Project Timeline</h3>
                  <div style={{
                    backgroundColor: 'var(--dark-black)',
                    padding: 'var(--spacing-4)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    border: '1px solid rgba(148, 163, 184, 0.2)'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-purple)' }}>
                      {analysis.timeline} weeks
                    </div>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Estimated Duration</p>
                  </div>
                </div>

                {/* AI Opportunities */}
                {analysis.aiOpportunities && analysis.aiOpportunities.length > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-6)' }}>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>🤖 Identified AI Opportunities</h3>
                    <div style={{
                      backgroundColor: 'var(--dark-black)',
                      padding: 'var(--spacing-4)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(148, 163, 184, 0.2)'
                    }}>
                      <ul style={{ margin: 0, paddingLeft: 'var(--spacing-4)' }}>
                        {analysis.aiOpportunities.map((opportunity, index) => (
                          <li key={index} style={{ 
                            color: 'var(--text-primary)', 
                            marginBottom: 'var(--spacing-2)',
                            fontSize: 'var(--font-size-sm)'
                          }}>
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-6)' }}>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>💡 Recommendations</h3>
                    <div style={{
                      backgroundColor: 'var(--dark-black)',
                      padding: 'var(--spacing-4)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid rgba(148, 163, 184, 0.2)'
                    }}>
                      <ul style={{ margin: 0, paddingLeft: 'var(--spacing-4)' }}>
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index} style={{ 
                            color: 'var(--text-primary)', 
                            marginBottom: 'var(--spacing-2)',
                            fontSize: 'var(--font-size-sm)'
                          }}>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* SOW Generation */}
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--white)' }}>Statement of Work</h3>
                  <button
                    onClick={generateSOW}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
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
                    📄 Download SOW Document
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingSOW
