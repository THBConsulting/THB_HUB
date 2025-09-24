import React, { useState } from 'react'
import { claudeAPI, supabaseService } from '../services/api'

const PricingSOW = () => {
  const [formData, setFormData] = useState({
    clientType: '',
    projectDescription: '',
    features: [],
    timeline: '',
    budgetRange: '',
    clientName: '',
    clientEmail: ''
  })

  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sowDocument, setSowDocument] = useState('')
  const [isGeneratingSOW, setIsGeneratingSOW] = useState(false)

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
        budget: formData.budgetRange
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
