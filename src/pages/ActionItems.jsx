import React, { useState, useEffect } from 'react'

const ActionItems = () => {
  const [viewMode, setViewMode] = useState('all') // 'all', 'business', 'personal', 'overdue'
  const [priorityFilter, setPriorityFilter] = useState('all') // 'all', 'high', 'medium', 'low'
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEmailIntegration, setShowEmailIntegration] = useState(false)
  
  const [actionItems, setActionItems] = useState([
    {
      id: 1,
      title: 'Follow up with TechStart Inc. about automation proposal',
      description: 'Client requested follow-up meeting to discuss automation implementation timeline',
      category: 'business',
      priority: 'high',
      dueDate: '2024-01-20',
      status: 'pending',
      emailSource: 'john.smith@techstart.com',
      emailDate: '2024-01-15',
      taskType: 'follow-up',
      estimatedTime: '30 minutes',
      notes: 'Client is interested in HubSpot automation',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Schedule quarterly review meeting with NonProfit Alliance',
      description: 'Board meeting to discuss Q1 automation projects and budget allocation',
      category: 'business',
      priority: 'medium',
      dueDate: '2024-01-25',
      status: 'pending',
      emailSource: 'sarah.johnson@nonprofitalliance.org',
      emailDate: '2024-01-14',
      taskType: 'meeting',
      estimatedTime: '1 hour',
      notes: 'Need to prepare presentation on automation ROI',
      createdAt: '2024-01-14T14:20:00Z'
    },
    {
      id: 3,
      title: 'Submit conference proposal for NonProfit Tech Summit',
      description: 'Deadline for speaking proposal on automation for nonprofits',
      category: 'business',
      priority: 'high',
      dueDate: '2024-01-18',
      status: 'pending',
      emailSource: 'conference@nonprofittech.org',
      emailDate: '2024-01-10',
      taskType: 'deadline',
      estimatedTime: '2 hours',
      notes: 'Topic: AI-powered automation for small nonprofits',
      createdAt: '2024-01-10T09:15:00Z'
    },
    {
      id: 4,
      title: 'Volunteer at local food bank this Saturday',
      description: 'Community service event organized by Rotary Club',
      category: 'personal',
      priority: 'medium',
      dueDate: '2024-01-20',
      status: 'pending',
      emailSource: 'volunteer@rotaryclub.org',
      emailDate: '2024-01-12',
      taskType: 'volunteer',
      estimatedTime: '4 hours',
      notes: 'Morning shift 8am-12pm',
      createdAt: '2024-01-12T16:45:00Z'
    },
    {
      id: 5,
      title: 'Review and approve final payment for GreenTech project',
      description: 'Client project completed, awaiting final invoice approval',
      category: 'business',
      priority: 'medium',
      dueDate: '2024-01-22',
      status: 'pending',
      emailSource: 'finance@greentech.com',
      emailDate: '2024-01-16',
      taskType: 'payment',
      estimatedTime: '15 minutes',
      notes: 'Project delivered successfully, client satisfied',
      createdAt: '2024-01-16T11:30:00Z'
    },
    {
      id: 6,
      title: 'Prepare presentation for Chamber of Commerce meeting',
      description: 'Speaking opportunity about business automation trends',
      category: 'business',
      priority: 'high',
      dueDate: '2024-01-30',
      status: 'pending',
      emailSource: 'events@chamberofcommerce.org',
      emailDate: '2024-01-08',
      taskType: 'presentation',
      estimatedTime: '3 hours',
      notes: '30-minute presentation, Q&A session included',
      createdAt: '2024-01-08T13:20:00Z'
    },
    {
      id: 7,
      title: 'Attend parent-teacher conference for Emma',
      description: 'Quarterly conference to discuss academic progress',
      category: 'personal',
      priority: 'high',
      dueDate: '2024-01-24',
      status: 'pending',
      emailSource: 'teacher@elementaryschool.edu',
      emailDate: '2024-01-13',
      taskType: 'family',
      estimatedTime: '45 minutes',
      notes: 'Scheduled for 3:30pm, bring progress report',
      createdAt: '2024-01-13T08:15:00Z'
    },
    {
      id: 8,
      title: 'Research new AI tools for client recommendations',
      description: 'Stay updated on latest automation tools for client proposals',
      category: 'business',
      priority: 'low',
      dueDate: '2024-01-28',
      status: 'pending',
      emailSource: 'newsletter@automationweekly.com',
      emailDate: '2024-01-15',
      taskType: 'research',
      estimatedTime: '1 hour',
      notes: 'Focus on nonprofit-friendly tools',
      createdAt: '2024-01-15T07:30:00Z'
    }
  ])

  const [newActionItem, setNewActionItem] = useState({
    title: '',
    description: '',
    category: 'business',
    priority: 'medium',
    dueDate: '',
    taskType: 'follow-up',
    estimatedTime: '30 minutes',
    notes: ''
  })

  const taskTypes = {
    'follow-up': { label: 'Follow-up', icon: '📞', color: 'var(--primary-purple)' },
    'meeting': { label: 'Meeting', icon: '📅', color: 'var(--secondary-blue)' },
    'deadline': { label: 'Deadline', icon: '⏰', color: '#EF4444' },
    'volunteer': { label: 'Volunteer', icon: '🤝', color: '#10B981' },
    'payment': { label: 'Payment', icon: '💰', color: '#F59E0B' },
    'presentation': { label: 'Presentation', icon: '🎤', color: '#8B5CF6' },
    'family': { label: 'Family', icon: '👨‍👩‍👧‍👦', color: '#EC4899' },
    'research': { label: 'Research', icon: '🔍', color: '#6B7280' }
  }

  const priorityColors = {
    'high': '#EF4444',
    'medium': '#F59E0B',
    'low': '#10B981'
  }

  const getFilteredItems = () => {
    let filtered = actionItems

    // Filter by view mode
    if (viewMode !== 'all') {
      if (viewMode === 'overdue') {
        filtered = filtered.filter(item => {
          const dueDate = new Date(item.dueDate)
          const today = new Date()
          return dueDate < today && item.status === 'pending'
        })
      } else {
        filtered = filtered.filter(item => item.category === viewMode)
      }
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(item => item.priority === priorityFilter)
    }

    return filtered.sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return new Date(a.dueDate) - new Date(b.dueDate)
    })
  }

  const getStats = () => {
    const total = actionItems.length
    const pending = actionItems.filter(item => item.status === 'pending').length
    const overdue = actionItems.filter(item => {
      const dueDate = new Date(item.dueDate)
      const today = new Date()
      return dueDate < today && item.status === 'pending'
    }).length
    const business = actionItems.filter(item => item.category === 'business').length
    const personal = actionItems.filter(item => item.category === 'personal').length

    return { total, pending, overdue, business, personal }
  }

  const markComplete = (id) => {
    setActionItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'completed' } : item
    ))
  }

  const snoozeTask = (id, days = 1) => {
    setActionItems(prev => prev.map(item => {
      if (item.id === id) {
        const currentDate = new Date(item.dueDate)
        currentDate.setDate(currentDate.getDate() + days)
        return { ...item, dueDate: currentDate.toISOString().split('T')[0] }
      }
      return item
    }))
  }

  const addActionItem = () => {
    if (!newActionItem.title || !newActionItem.dueDate) return

    const item = {
      id: Date.now(),
      ...newActionItem,
      status: 'pending',
      emailSource: 'Manual Entry',
      emailDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }

    setActionItems(prev => [...prev, item])
    setNewActionItem({
      title: '',
      description: '',
      category: 'business',
      priority: 'medium',
      dueDate: '',
      taskType: 'follow-up',
      estimatedTime: '30 minutes',
      notes: ''
    })
    setShowAddForm(false)
  }

  const handleInputChange = (field, value) => {
    setNewActionItem(prev => ({ ...prev, [field]: value }))
  }

  const filteredItems = getFilteredItems()
  const stats = getStats()

  const ActionItemCard = ({ item }) => {
    const isOverdue = new Date(item.dueDate) < new Date() && item.status === 'pending'
    const taskTypeInfo = taskTypes[item.taskType]
    
    return (
      <div style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-4)',
        border: isOverdue ? '2px solid #EF4444' : '1px solid rgba(148, 163, 184, 0.1)',
        marginBottom: 'var(--spacing-3)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--font-size-lg)' }}>{taskTypeInfo.icon}</span>
              <h3 style={{ color: 'var(--white)', fontSize: 'var(--font-size-lg)', fontWeight: '600', margin: 0 }}>
                {item.title}
              </h3>
              <div style={{
                padding: 'var(--spacing-1) var(--spacing-2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: '600',
                backgroundColor: priorityColors[item.priority],
                color: 'var(--white)',
                textTransform: 'uppercase'
              }}>
                {item.priority}
              </div>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
              {item.description}
            </p>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-3)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                📧 {item.emailSource}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                ⏱️ {item.estimatedTime}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                📅 {new Date(item.dueDate).toLocaleDateString()}
              </div>
            </div>
            
            {item.notes && (
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-2)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}>
                💡 {item.notes}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <button
              onClick={() => markComplete(item.id)}
              style={{
                padding: 'var(--spacing-2)',
                backgroundColor: 'var(--primary-purple)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600'
              }}
            >
              ✅ Complete
            </button>
            <button
              onClick={() => snoozeTask(item.id, 1)}
              style={{
                padding: 'var(--spacing-2)',
                backgroundColor: 'var(--secondary-blue)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600'
              }}
            >
              ⏰ Snooze 1 Day
            </button>
          </div>
        </div>
      </div>
    )
  }

  const AddActionItemForm = () => (
    <div className="card">
      <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Add New Action Item</h3>
      
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
          Title
        </label>
        <input
          type="text"
          value={newActionItem.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Brief description of the action item"
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

      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
          Description
        </label>
        <textarea
          value={newActionItem.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Detailed description of the task"
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Category
          </label>
          <select
            value={newActionItem.category}
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
            <option value="business">Business</option>
            <option value="personal">Personal</option>
          </select>
        </div>
        
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Priority
          </label>
          <select
            value={newActionItem.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
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
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Due Date
          </label>
          <input
            type="date"
            value={newActionItem.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
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
            Task Type
          </label>
          <select
            value={newActionItem.taskType}
            onChange={(e) => handleInputChange('taskType', e.target.value)}
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
            {Object.entries(taskTypes).map(([key, info]) => (
              <option key={key} value={key}>{info.icon} {info.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
          Notes
        </label>
        <textarea
          value={newActionItem.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional notes or context"
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
        <button onClick={addActionItem} style={{ flex: 1 }}>
          ➕ Add Action Item
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
          ✅ Action Items
        </h1>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Total Tasks
            </div>
            <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.total}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Pending
            </div>
            <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.pending}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Overdue
            </div>
            <div style={{ color: '#EF4444', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.overdue}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Business
            </div>
            <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.business}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Personal
            </div>
            <div style={{ color: '#10B981', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.personal}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['all', 'business', 'personal', 'overdue'].map(mode => (
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
              {['all', 'high', 'medium', 'low'].map(priority => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    backgroundColor: priorityFilter === priority ? 'var(--secondary-blue)' : 'transparent',
                    color: priorityFilter === priority ? 'var(--white)' : 'var(--text-secondary)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: 'var(--font-size-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <button onClick={() => setShowEmailIntegration(true)}>
              📧 Email Integration
            </button>
            <button onClick={() => setShowAddForm(true)}>
              ➕ Add Task
            </button>
          </div>
        </div>

        {/* Add Action Item Form */}
        {showAddForm && <AddActionItemForm />}

        {/* Action Items List */}
        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
            {viewMode === 'all' ? 'All' : viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Tasks ({filteredItems.length})
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>✅</div>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>No tasks found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {viewMode === 'overdue' ? 'No overdue tasks!' : 'Try adjusting your filters or add a new task.'}
              </p>
            </div>
          ) : (
            <div>
              {filteredItems.map(item => (
                <ActionItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* AI Integration Placeholder */}
        <div style={{ marginTop: 'var(--spacing-8)' }}>
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>🤖 AI Email Integration</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>📧</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Email Parsing</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Automatically scan emails for action items, deadlines, and follow-up requests
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>🧠</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Smart Categorization</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  AI-powered classification of business vs personal tasks with priority scoring
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>📅</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Calendar Sync</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Automatic calendar integration for due dates and meeting scheduling
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Integration Modal */}
        {showEmailIntegration && (
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
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Email Integration Setup</h3>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h4 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Gmail API Integration</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
                  Connect your Gmail account to automatically extract action items from emails.
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
                  • Gmail API authentication<br/>
                  • Email content parsing<br/>
                  • Natural language processing<br/>
                  • Automatic task creation
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h4 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Supported Email Types</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-2)' }}>
                  {Object.entries(taskTypes).map(([key, info]) => (
                    <div key={key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                      padding: 'var(--spacing-2)',
                      backgroundColor: 'var(--dark-black)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)'
                    }}>
                      <span>{info.icon}</span>
                      <span>{info.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                <button onClick={() => setShowEmailIntegration(false)} style={{ flex: 1 }}>
                  🔗 Connect Gmail
                </button>
                <button onClick={() => setShowEmailIntegration(false)} style={{ flex: 1, backgroundColor: 'var(--medium-grey)' }}>
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

export default ActionItems