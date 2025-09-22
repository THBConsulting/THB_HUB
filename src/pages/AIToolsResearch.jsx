import React, { useState, useEffect } from 'react'

const AIToolsResearch = () => {
  const [viewMode, setViewMode] = useState('all') // 'all', 'bookmarked', 'tested', 'recommended'
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all', 'email', 'social', 'crm', 'analytics', 'content'
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAggregationModal, setShowAggregationModal] = useState(false)
  
  const [tools, setTools] = useState([
    {
      id: 1,
      name: 'Zapier AI',
      category: 'automation',
      description: 'AI-powered workflow automation with natural language processing',
      rating: 4.5,
      price: '$20/month',
      complexity: 'medium',
      clientApplicability: 'high',
      integrationScore: 9,
      source: 'Product Hunt',
      dateAdded: '2024-01-15',
      bookmarked: true,
      tested: false,
      recommended: true,
      features: ['Natural language automation', 'AI-powered triggers', 'Smart suggestions'],
      pros: ['Easy to use', 'Great AI integration', 'Extensive app connections'],
      cons: ['Limited AI features in free tier', 'Can be expensive for complex workflows'],
      useCases: ['Email automation', 'Data synchronization', 'Lead management'],
      clientTypes: ['Small businesses', 'Nonprofits', 'E-commerce'],
      notes: 'Excellent for clients who want AI-powered automation without coding'
    },
    {
      id: 2,
      name: 'Jasper AI',
      category: 'content',
      description: 'AI content generation for marketing, blogs, and social media',
      rating: 4.2,
      price: '$39/month',
      complexity: 'low',
      clientApplicability: 'high',
      integrationScore: 7,
      source: 'LinkedIn',
      dateAdded: '2024-01-12',
      bookmarked: true,
      tested: true,
      recommended: true,
      features: ['Content templates', 'Brand voice training', 'SEO optimization'],
      pros: ['High-quality content', 'Brand consistency', 'SEO-friendly'],
      cons: ['Expensive for small businesses', 'Limited customization'],
      useCases: ['Blog writing', 'Social media content', 'Email marketing'],
      clientTypes: ['Marketing agencies', 'Content creators', 'E-commerce'],
      notes: 'Great for nonprofits needing consistent content creation'
    },
    {
      id: 3,
      name: 'HubSpot AI',
      category: 'crm',
      description: 'AI-powered CRM with predictive analytics and automation',
      rating: 4.7,
      price: '$45/month',
      complexity: 'high',
      clientApplicability: 'medium',
      integrationScore: 10,
      source: 'HubSpot Blog',
      dateAdded: '2024-01-10',
      bookmarked: false,
      tested: true,
      recommended: true,
      features: ['Predictive lead scoring', 'AI chatbots', 'Automated follow-ups'],
      pros: ['Comprehensive platform', 'Excellent AI features', 'Great integrations'],
      cons: ['Complex setup', 'Expensive for small businesses'],
      useCases: ['Lead management', 'Customer service', 'Sales automation'],
      clientTypes: ['Mid-size businesses', 'Sales teams', 'Marketing agencies'],
      notes: 'Best for established businesses with complex sales processes'
    },
    {
      id: 4,
      name: 'Loom AI',
      category: 'communication',
      description: 'AI-powered video creation and editing for training and communication',
      rating: 4.3,
      price: '$8/month',
      complexity: 'low',
      clientApplicability: 'high',
      integrationScore: 6,
      source: 'YouTube',
      dateAdded: '2024-01-08',
      bookmarked: true,
      tested: false,
      recommended: true,
      features: ['AI video editing', 'Auto-transcription', 'Screen recording'],
      pros: ['Easy to use', 'Affordable', 'Great for training'],
      cons: ['Limited AI features', 'Basic editing tools'],
      useCases: ['Training videos', 'Client communication', 'Documentation'],
      clientTypes: ['Nonprofits', 'Training organizations', 'Remote teams'],
      notes: 'Perfect for nonprofits creating training materials'
    },
    {
      id: 5,
      name: 'Notion AI',
      category: 'productivity',
      description: 'AI-powered workspace with writing assistance and automation',
      rating: 4.4,
      price: '$8/month',
      complexity: 'medium',
      clientApplicability: 'high',
      integrationScore: 8,
      source: 'Twitter',
      dateAdded: '2024-01-05',
      bookmarked: false,
      tested: true,
      recommended: false,
      features: ['AI writing assistant', 'Task automation', 'Database management'],
      pros: ['All-in-one workspace', 'Good AI integration', 'Flexible structure'],
      cons: ['Steep learning curve', 'Limited automation features'],
      useCases: ['Project management', 'Documentation', 'Knowledge base'],
      clientTypes: ['Small teams', 'Consultants', 'Project managers'],
      notes: 'Good for internal use but limited automation for client projects'
    },
    {
      id: 6,
      name: 'Copy.ai',
      category: 'content',
      description: 'AI copywriting tool for marketing and sales content',
      rating: 4.1,
      price: '$35/month',
      complexity: 'low',
      clientApplicability: 'medium',
      integrationScore: 5,
      source: 'Product Hunt',
      dateAdded: '2024-01-03',
      bookmarked: false,
      tested: false,
      recommended: false,
      features: ['Copy templates', 'A/B testing', 'Brand voice training'],
      pros: ['Good copy quality', 'Easy to use', 'Multiple templates'],
      cons: ['Limited customization', 'Expensive for volume'],
      useCases: ['Ad copy', 'Email marketing', 'Sales pages'],
      clientTypes: ['Marketing agencies', 'E-commerce', 'SaaS companies'],
      notes: 'Decent alternative to Jasper but less comprehensive'
    }
  ])

  const [newTool, setNewTool] = useState({
    name: '',
    category: 'automation',
    description: '',
    price: '',
    complexity: 'medium',
    clientApplicability: 'medium',
    integrationScore: 5,
    source: '',
    features: [],
    pros: '',
    cons: '',
    useCases: '',
    clientTypes: '',
    notes: ''
  })

  const categories = {
    'automation': { label: 'Automation', icon: '⚡', color: 'var(--primary-purple)' },
    'content': { label: 'Content Creation', icon: '✍️', color: 'var(--secondary-blue)' },
    'crm': { label: 'CRM & Sales', icon: '📊', color: '#10B981' },
    'communication': { label: 'Communication', icon: '💬', color: '#F59E0B' },
    'productivity': { label: 'Productivity', icon: '📈', color: '#8B5CF6' },
    'analytics': { label: 'Analytics', icon: '📊', color: '#EF4444' }
  }

  const complexityColors = {
    'low': '#10B981',
    'medium': '#F59E0B',
    'high': '#EF4444'
  }

  const applicabilityColors = {
    'low': '#EF4444',
    'medium': '#F59E0B',
    'high': '#10B981'
  }

  const getFilteredTools = () => {
    let filtered = tools

    // Filter by view mode
    if (viewMode !== 'all') {
      if (viewMode === 'bookmarked') {
        filtered = filtered.filter(tool => tool.bookmarked)
      } else if (viewMode === 'tested') {
        filtered = filtered.filter(tool => tool.tested)
      } else if (viewMode === 'recommended') {
        filtered = filtered.filter(tool => tool.recommended)
      }
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tool => tool.category === categoryFilter)
    }

    return filtered.sort((a, b) => {
      // Sort by rating first, then by date added
      if (a.rating !== b.rating) {
        return b.rating - a.rating
      }
      return new Date(b.dateAdded) - new Date(a.dateAdded)
    })
  }

  const getStats = () => {
    const total = tools.length
    const bookmarked = tools.filter(tool => tool.bookmarked).length
    const tested = tools.filter(tool => tool.tested).length
    const recommended = tools.filter(tool => tool.recommended).length
    const avgRating = tools.reduce((sum, tool) => sum + tool.rating, 0) / tools.length
    const highApplicability = tools.filter(tool => tool.clientApplicability === 'high').length

    return { total, bookmarked, tested, recommended, avgRating, highApplicability }
  }

  const toggleBookmark = (id) => {
    setTools(prev => prev.map(tool => 
      tool.id === id ? { ...tool, bookmarked: !tool.bookmarked } : tool
    ))
  }

  const toggleTested = (id) => {
    setTools(prev => prev.map(tool => 
      tool.id === id ? { ...tool, tested: !tool.tested } : tool
    ))
  }

  const toggleRecommended = (id) => {
    setTools(prev => prev.map(tool => 
      tool.id === id ? { ...tool, recommended: !tool.recommended } : tool
    ))
  }

  const addTool = () => {
    if (!newTool.name || !newTool.description) return

    const tool = {
      id: Date.now(),
      ...newTool,
      rating: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      bookmarked: false,
      tested: false,
      recommended: false,
      features: newTool.features.split(',').map(f => f.trim()).filter(f => f),
      pros: newTool.pros.split(',').map(p => p.trim()).filter(p => p),
      cons: newTool.cons.split(',').map(c => c.trim()).filter(c => c),
      useCases: newTool.useCases.split(',').map(u => u.trim()).filter(u => u),
      clientTypes: newTool.clientTypes.split(',').map(c => c.trim()).filter(c => c)
    }

    setTools(prev => [...prev, tool])
    setNewTool({
      name: '',
      category: 'automation',
      description: '',
      price: '',
      complexity: 'medium',
      clientApplicability: 'medium',
      integrationScore: 5,
      source: '',
      features: [],
      pros: '',
      cons: '',
      useCases: '',
      clientTypes: '',
      notes: ''
    })
    setShowAddForm(false)
  }

  const handleInputChange = (field, value) => {
    setNewTool(prev => ({ ...prev, [field]: value }))
  }

  const filteredTools = getFilteredTools()
  const stats = getStats()

  const ToolCard = ({ tool }) => {
    const categoryInfo = categories[tool.category]
    
    return (
      <div style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-4)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        marginBottom: 'var(--spacing-3)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--font-size-lg)' }}>{categoryInfo.icon}</span>
              <h3 style={{ color: 'var(--white)', fontSize: 'var(--font-size-lg)', fontWeight: '600', margin: 0 }}>
                {tool.name}
              </h3>
              <div style={{
                padding: 'var(--spacing-1) var(--spacing-2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: '600',
                backgroundColor: categoryInfo.color,
                color: 'var(--white)',
                textTransform: 'capitalize'
              }}>
                {categoryInfo.label}
              </div>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
              {tool.description}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                <strong>Price:</strong> {tool.price}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                <strong>Rating:</strong> ⭐ {tool.rating}/5
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                <strong>Complexity:</strong> 
                <span style={{ color: complexityColors[tool.complexity], marginLeft: 'var(--spacing-1)' }}>
                  {tool.complexity}
                </span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                <strong>Client Fit:</strong> 
                <span style={{ color: applicabilityColors[tool.clientApplicability], marginLeft: 'var(--spacing-1)' }}>
                  {tool.clientApplicability}
                </span>
              </div>
            </div>
            
            <div style={{ marginBottom: 'var(--spacing-3)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>
                <strong>Key Features:</strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                {tool.features.map((feature, index) => (
                  <span key={index} style={{
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    backgroundColor: 'var(--primary-purple)',
                    color: 'var(--white)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-size-xs)'
                  }}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: 'var(--spacing-3)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>
                <strong>Best For:</strong> {tool.clientTypes.join(', ')}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                <strong>Use Cases:</strong> {tool.useCases.join(', ')}
              </div>
            </div>
            
            {tool.notes && (
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-2)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}>
                💡 {tool.notes}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <button
              onClick={() => toggleBookmark(tool.id)}
              style={{
                padding: 'var(--spacing-2)',
                backgroundColor: tool.bookmarked ? '#F59E0B' : 'transparent',
                color: tool.bookmarked ? 'var(--white)' : 'var(--text-secondary)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600'
              }}
            >
              {tool.bookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
            </button>
            <button
              onClick={() => toggleTested(tool.id)}
              style={{
                padding: 'var(--spacing-2)',
                backgroundColor: tool.tested ? '#10B981' : 'transparent',
                color: tool.tested ? 'var(--white)' : 'var(--text-secondary)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600'
              }}
            >
              {tool.tested ? '✅ Tested' : '🧪 Test'}
            </button>
            <button
              onClick={() => toggleRecommended(tool.id)}
              style={{
                padding: 'var(--spacing-2)',
                backgroundColor: tool.recommended ? 'var(--primary-purple)' : 'transparent',
                color: tool.recommended ? 'var(--white)' : 'var(--text-secondary)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600'
              }}
            >
              {tool.recommended ? '⭐ Recommended' : '⭐ Recommend'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const AddToolForm = () => (
    <div className="card">
      <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Add New AI Tool</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Tool Name
          </label>
          <input
            type="text"
            value={newTool.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="AI tool name"
            style={{
              width: '100%',
              padding: 'var(--spacing-2)',
              backgroundColor: 'var(--dark-black)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--white)',
              fontSize: 'var(--font-size-sm)'
            }}
          />
        </div>
        
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Category
          </label>
          <select
            value={newTool.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-2)',
              backgroundColor: 'var(--dark-black)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--white)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            {Object.entries(categories).map(([key, info]) => (
              <option key={key} value={key}>{info.icon} {info.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
          Description
        </label>
        <textarea
          value={newTool.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of the tool and its capabilities"
          rows={3}
          style={{
            width: '100%',
            padding: 'var(--spacing-2)',
            backgroundColor: 'var(--dark-black)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--white)',
            fontSize: 'var(--font-size-sm)',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Price
          </label>
          <input
            type="text"
            value={newTool.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="$X/month"
            style={{
              width: '100%',
              padding: 'var(--spacing-2)',
              backgroundColor: 'var(--dark-black)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--white)',
              fontSize: 'var(--font-size-sm)'
            }}
          />
        </div>
        
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Complexity
          </label>
          <select
            value={newTool.complexity}
            onChange={(e) => handleInputChange('complexity', e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-2)',
              backgroundColor: 'var(--dark-black)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--white)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Client Applicability
          </label>
          <select
            value={newTool.clientApplicability}
            onChange={(e) => handleInputChange('clientApplicability', e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-2)',
              backgroundColor: 'var(--dark-black)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--white)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
          Notes
        </label>
        <textarea
          value={newTool.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional notes about this tool"
          rows={2}
          style={{
            width: '100%',
            padding: 'var(--spacing-2)',
            backgroundColor: 'var(--dark-black)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--white)',
            fontSize: 'var(--font-size-sm)',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
        <button onClick={addTool} style={{ flex: 1 }}>
          ➕ Add Tool
        </button>
        <button onClick={() => setShowAddForm(false)} style={{ flex: 1, backgroundColor: 'var(--medium-grey)' }}>
          Cancel
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          🤖 AI Tools Research
        </h1>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Total Tools
            </div>
            <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.total}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Bookmarked
            </div>
            <div style={{ color: '#F59E0B', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.bookmarked}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Tested
            </div>
            <div style={{ color: '#10B981', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.tested}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Recommended
            </div>
            <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.recommended}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Avg Rating
            </div>
            <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.avgRating.toFixed(1)}/5
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              High Client Fit
            </div>
            <div style={{ color: '#10B981', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.highApplicability}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['all', 'bookmarked', 'tested', 'recommended'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    backgroundColor: viewMode === mode ? 'var(--primary-purple)' : 'transparent',
                    color: viewMode === mode ? 'var(--white)' : 'var(--text-secondary)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: 'var(--font-size-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['all', 'automation', 'content', 'crm', 'communication', 'productivity', 'analytics'].map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    backgroundColor: categoryFilter === category ? 'var(--secondary-blue)' : 'transparent',
                    color: categoryFilter === category ? 'var(--white)' : 'var(--text-secondary)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: 'var(--font-size-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <button onClick={() => setShowAggregationModal(true)}>
              📰 Auto Research
            </button>
            <button onClick={() => setShowAddForm(true)}>
              ➕ Add Tool
            </button>
          </div>
        </div>

        {/* Add Tool Form */}
        {showAddForm && <AddToolForm />}

        {/* Tools List */}
        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
            {viewMode === 'all' ? 'All' : viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Tools ({filteredTools.length})
          </h2>
          
          {filteredTools.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>🤖</div>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>No tools found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Try adjusting your filters or add a new AI tool.
              </p>
            </div>
          ) : (
            <div>
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>

        {/* Content Aggregation Placeholder */}
        <div style={{ marginTop: 'var(--spacing-8)' }}>
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>📰 Automated Content Aggregation</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>🔍</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>News Aggregation</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Automatically collect AI tool announcements from Product Hunt, LinkedIn, and industry blogs
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>📊</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Trend Analysis</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  AI-powered analysis of emerging trends and market insights in automation tools
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>🎯</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Client Matching</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Smart recommendations based on client needs, industry, and current tech stack
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregation Modal */}
        {showAggregationModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ maxWidth: '600px', width: '90%' }}>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Content Aggregation Setup</h3>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h4 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Research Sources</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
                  Configure automated research from various AI and automation sources.
                </p>
                
                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'monospace',
                  marginBottom: 'var(--spacing-3)'
                }}>
                  🔧 Future Implementation:<br/>
                  • Product Hunt API integration<br/>
                  • LinkedIn automation discussions<br/>
                  • YouTube tutorial monitoring<br/>
                  • Industry blog RSS feeds
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h4 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Research Keywords</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-2)' }}>
                  {['AI automation', 'workflow tools', 'business automation', 'CRM AI', 'content generation', 'social media automation'].map(keyword => (
                    <div key={keyword} style={{
                      padding: 'var(--spacing-2)',
                      backgroundColor: 'var(--dark-black)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)',
                      textAlign: 'center'
                    }}>
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                <button onClick={() => setShowAggregationModal(false)} style={{ flex: 1 }}>
                  🔍 Start Research
                </button>
                <button onClick={() => setShowAggregationModal(false)} style={{ flex: 1, backgroundColor: 'var(--medium-grey)' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIToolsResearch