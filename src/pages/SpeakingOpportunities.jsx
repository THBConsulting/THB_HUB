import React, { useState, useEffect } from 'react'

const SpeakingOpportunities = () => {
  const [viewMode, setViewMode] = useState('all') // 'all', 'upcoming', 'applied', 'confirmed', 'past'
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'research', 'applied', 'accepted', 'declined', 'completed'
  const [showAddForm, setShowAddForm] = useState(false)
  const [showResearchModal, setShowResearchModal] = useState(false)
  
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      eventName: 'NonProfit Technology Conference',
      organization: 'NTEN',
      eventDate: '2024-03-15',
      location: 'Portland, OR',
      applicationDeadline: '2024-01-30',
      status: 'applied',
      speakingTopics: ['Automation for Nonprofits', 'Digital Transformation', 'AI Tools for Small Organizations'],
      compensation: 'Travel + $500 honorarium',
      contactPerson: 'Sarah Johnson',
      contactEmail: 'sarah@nten.org',
      applicationDate: '2024-01-15',
      estimatedAttendees: 1200,
      targetAudience: 'Nonprofit IT professionals',
      followUpTasks: ['Send presentation outline', 'Confirm travel arrangements'],
      roi: {
        leadsGenerated: 0,
        newClients: 0,
        revenueGenerated: 0,
        networkingContacts: 0
      },
      notes: 'High-profile event with excellent networking opportunities'
    },
    {
      id: 2,
      eventName: 'Grant Writing Workshop Series',
      organization: 'Foundation Center',
      eventDate: '2024-04-20',
      location: 'Chicago, IL',
      applicationDeadline: '2024-02-15',
      status: 'research',
      speakingTopics: ['Grant Writing Automation', 'Digital Fundraising Tools'],
      compensation: 'Travel + $750 honorarium',
      contactPerson: 'Michael Chen',
      contactEmail: 'mchen@foundationcenter.org',
      applicationDate: null,
      estimatedAttendees: 300,
      targetAudience: 'Grant writers and development staff',
      followUpTasks: ['Research organization background', 'Prepare proposal'],
      roi: {
        leadsGenerated: 0,
        newClients: 0,
        revenueGenerated: 0,
        networkingContacts: 0
      },
      notes: 'Focus on automation tools for grant management'
    },
    {
      id: 3,
      eventName: 'Volunteer Management Summit',
      organization: 'VolunteerMatch',
      eventDate: '2024-05-10',
      location: 'San Francisco, CA',
      applicationDeadline: '2024-02-28',
      status: 'accepted',
      speakingTopics: ['Volunteer Management Technology', 'Digital Engagement Strategies'],
      compensation: 'Travel + $1000 honorarium',
      contactPerson: 'Lisa Rodriguez',
      contactEmail: 'lisa@volunteermatch.org',
      applicationDate: '2024-01-10',
      estimatedAttendees: 500,
      targetAudience: 'Volunteer coordinators and managers',
      followUpTasks: ['Prepare presentation materials', 'Schedule pre-event call'],
      roi: {
        leadsGenerated: 0,
        newClients: 0,
        revenueGenerated: 0,
        networkingContacts: 0
      },
      notes: 'Confirmed speaking slot - keynote presentation'
    },
    {
      id: 4,
      eventName: 'Association of Fundraising Professionals Conference',
      organization: 'AFP',
      eventDate: '2024-06-05',
      location: 'Denver, CO',
      applicationDeadline: '2024-03-01',
      status: 'research',
      speakingTopics: ['Fundraising Technology', 'Donor Management Systems'],
      compensation: 'Travel + $800 honorarium',
      contactPerson: 'David Thompson',
      contactEmail: 'dthompson@afpnet.org',
      applicationDate: null,
      estimatedAttendees: 2000,
      targetAudience: 'Fundraising professionals',
      followUpTasks: ['Review conference themes', 'Prepare speaking proposal'],
      roi: {
        leadsGenerated: 0,
        newClients: 0,
        revenueGenerated: 0,
        networkingContacts: 0
      },
      notes: 'Largest nonprofit fundraising conference in the region'
    },
    {
      id: 5,
      eventName: 'Small Nonprofit Leadership Retreat',
      organization: 'Nonprofit Leadership Alliance',
      eventDate: '2024-07-15',
      location: 'Austin, TX',
      applicationDeadline: '2024-04-15',
      status: 'declined',
      speakingTopics: ['Leadership Technology', 'Organizational Efficiency'],
      compensation: 'Travel + $600 honorarium',
      contactPerson: 'Jennifer Walsh',
      contactEmail: 'jwalsh@nla.org',
      applicationDate: '2024-01-20',
      estimatedAttendees: 150,
      targetAudience: 'Nonprofit executives',
      followUpTasks: ['Send decline email', 'Suggest alternative speakers'],
      roi: {
        leadsGenerated: 0,
        newClients: 0,
        revenueGenerated: 0,
        networkingContacts: 0
      },
      notes: 'Declined due to scheduling conflict with client project'
    },
    {
      id: 6,
      eventName: 'Digital Marketing for Nonprofits',
      organization: 'Nonprofit Marketing Summit',
      eventDate: '2024-08-20',
      location: 'Seattle, WA',
      applicationDeadline: '2024-05-01',
      status: 'completed',
      speakingTopics: ['Social Media Automation', 'Email Marketing Tools'],
      compensation: 'Travel + $900 honorarium',
      contactPerson: 'Robert Kim',
      contactEmail: 'rkim@npmarketing.org',
      applicationDate: '2024-02-01',
      estimatedAttendees: 400,
      targetAudience: 'Marketing and communications staff',
      followUpTasks: ['Send thank you email', 'Follow up with contacts'],
      roi: {
        leadsGenerated: 12,
        newClients: 2,
        revenueGenerated: 15000,
        networkingContacts: 25
      },
      notes: 'Excellent event - generated several qualified leads'
    }
  ])

  const [newOpportunity, setNewOpportunity] = useState({
    eventName: '',
    organization: '',
    eventDate: '',
    location: '',
    applicationDeadline: '',
    speakingTopics: [],
    compensation: '',
    contactPerson: '',
    contactEmail: '',
    estimatedAttendees: '',
    targetAudience: '',
    notes: ''
  })

  const expertiseAreas = [
    'Automation for Nonprofits',
    'Digital Transformation',
    'AI Tools for Small Organizations',
    'Grant Writing Automation',
    'Digital Fundraising Tools',
    'Volunteer Management Technology',
    'Digital Engagement Strategies',
    'Fundraising Technology',
    'Donor Management Systems',
    'Leadership Technology',
    'Organizational Efficiency',
    'Social Media Automation',
    'Email Marketing Tools',
    'CRM Implementation',
    'Data Analytics for Nonprofits'
  ]

  const statusColors = {
    'research': '#6B7280',
    'applied': '#F59E0B',
    'accepted': '#10B981',
    'declined': '#EF4444',
    'completed': '#8B5CF6'
  }

  const getFilteredOpportunities = () => {
    let filtered = opportunities

    // Filter by view mode
    if (viewMode !== 'all') {
      if (viewMode === 'upcoming') {
        filtered = filtered.filter(opp => {
          const eventDate = new Date(opp.eventDate)
          const today = new Date()
          return eventDate > today && ['applied', 'accepted'].includes(opp.status)
        })
      } else if (viewMode === 'applied') {
        filtered = filtered.filter(opp => opp.status === 'applied')
      } else if (viewMode === 'confirmed') {
        filtered = filtered.filter(opp => opp.status === 'accepted')
      } else if (viewMode === 'past') {
        filtered = filtered.filter(opp => opp.status === 'completed')
      }
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(opp => opp.status === statusFilter)
    }

    return filtered.sort((a, b) => {
      // Sort by application deadline for upcoming events, by event date for past events
      if (viewMode === 'past') {
        return new Date(b.eventDate) - new Date(a.eventDate)
      }
      return new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
    })
  }

  const getStats = () => {
    const total = opportunities.length
    const applied = opportunities.filter(opp => opp.status === 'applied').length
    const accepted = opportunities.filter(opp => opp.status === 'accepted').length
    const completed = opportunities.filter(opp => opp.status === 'completed').length
    const totalLeads = opportunities.reduce((sum, opp) => sum + opp.roi.leadsGenerated, 0)
    const totalRevenue = opportunities.reduce((sum, opp) => sum + opp.roi.revenueGenerated, 0)

    return { total, applied, accepted, completed, totalLeads, totalRevenue }
  }

  const updateStatus = (id, newStatus) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === id ? { ...opp, status: newStatus } : opp
    ))
  }

  const updateROI = (id, roiData) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === id ? { ...opp, roi: { ...opp.roi, ...roiData } } : opp
    ))
  }

  const addOpportunity = () => {
    if (!newOpportunity.eventName || !newOpportunity.organization) return

    const opportunity = {
      id: Date.now(),
      ...newOpportunity,
      status: 'research',
      applicationDate: null,
      followUpTasks: [],
      roi: {
        leadsGenerated: 0,
        newClients: 0,
        revenueGenerated: 0,
        networkingContacts: 0
      }
    }

    setOpportunities(prev => [...prev, opportunity])
    setNewOpportunity({
      eventName: '',
      organization: '',
      eventDate: '',
      location: '',
      applicationDeadline: '',
      speakingTopics: [],
      compensation: '',
      contactPerson: '',
      contactEmail: '',
      estimatedAttendees: '',
      targetAudience: '',
      notes: ''
    })
    setShowAddForm(false)
  }

  const handleInputChange = (field, value) => {
    setNewOpportunity(prev => ({ ...prev, [field]: value }))
  }

  const handleTopicToggle = (topic) => {
    setNewOpportunity(prev => ({
      ...prev,
      speakingTopics: prev.speakingTopics.includes(topic)
        ? prev.speakingTopics.filter(t => t !== topic)
        : [...prev.speakingTopics, topic]
    }))
  }

  const filteredOpportunities = getFilteredOpportunities()
  const stats = getStats()

  const OpportunityCard = ({ opportunity }) => {
    const isOverdue = new Date(opportunity.applicationDeadline) < new Date() && opportunity.status === 'research'
    const daysUntilDeadline = Math.ceil((new Date(opportunity.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24))
    
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
              <h3 style={{ color: 'var(--white)', fontSize: 'var(--font-size-lg)', fontWeight: '600', margin: 0 }}>
                {opportunity.eventName}
              </h3>
              <div style={{
                padding: 'var(--spacing-1) var(--spacing-2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: '600',
                backgroundColor: statusColors[opportunity.status],
                color: 'var(--white)',
                textTransform: 'capitalize'
              }}>
                {opportunity.status}
              </div>
            </div>
            
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
              <div style={{ marginBottom: 'var(--spacing-1)' }}>
                <strong>Organization:</strong> {opportunity.organization}
              </div>
              <div style={{ marginBottom: 'var(--spacing-1)' }}>
                <strong>Date:</strong> {new Date(opportunity.eventDate).toLocaleDateString()} • <strong>Location:</strong> {opportunity.location}
              </div>
              <div style={{ marginBottom: 'var(--spacing-1)' }}>
                <strong>Deadline:</strong> {new Date(opportunity.applicationDeadline).toLocaleDateString()}
                {daysUntilDeadline > 0 && daysUntilDeadline <= 30 && (
                  <span style={{ color: '#F59E0B', marginLeft: 'var(--spacing-2)' }}>
                    ({daysUntilDeadline} days left)
                  </span>
                )}
              </div>
              <div style={{ marginBottom: 'var(--spacing-1)' }}>
                <strong>Compensation:</strong> {opportunity.compensation}
              </div>
              <div style={{ marginBottom: 'var(--spacing-1)' }}>
                <strong>Attendees:</strong> {opportunity.estimatedAttendees} • <strong>Audience:</strong> {opportunity.targetAudience}
              </div>
            </div>
            
            <div style={{ marginBottom: 'var(--spacing-3)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-1)' }}>
                <strong>Speaking Topics:</strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                {opportunity.speakingTopics.map((topic, index) => (
                  <span key={index} style={{
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    backgroundColor: 'var(--primary-purple)',
                    color: 'var(--white)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-size-xs)'
                  }}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            
            {opportunity.status === 'completed' && (
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-3)'
              }}>
                <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: '600', marginBottom: 'var(--spacing-2)' }}>
                  ROI Results:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-2)' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                    Leads: {opportunity.roi.leadsGenerated}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                    New Clients: {opportunity.roi.newClients}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                    Revenue: ${opportunity.roi.revenueGenerated.toLocaleString()}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                    Contacts: {opportunity.roi.networkingContacts}
                  </div>
                </div>
              </div>
            )}
            
            {opportunity.notes && (
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-2)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-xs)',
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}>
                💡 {opportunity.notes}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {opportunity.status === 'research' && (
              <button
                onClick={() => updateStatus(opportunity.id, 'applied')}
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
                📝 Apply
              </button>
            )}
            {opportunity.status === 'applied' && (
              <button
                onClick={() => updateStatus(opportunity.id, 'accepted')}
                style={{
                  padding: 'var(--spacing-2)',
                  backgroundColor: '#10B981',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '600'
                }}
              >
                ✅ Accept
              </button>
            )}
            {opportunity.status === 'accepted' && (
              <button
                onClick={() => updateStatus(opportunity.id, 'completed')}
                style={{
                  padding: 'var(--spacing-2)',
                  backgroundColor: '#8B5CF6',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '600'
                }}
              >
                🎯 Complete
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const AddOpportunityForm = () => (
    <div className="card">
      <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Add New Speaking Opportunity</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Event Name
          </label>
          <input
            type="text"
            value={newOpportunity.eventName}
            onChange={(e) => handleInputChange('eventName', e.target.value)}
            placeholder="Conference or event name"
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
            Organization
          </label>
          <input
            type="text"
            value={newOpportunity.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            placeholder="Hosting organization"
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Event Date
          </label>
          <input
            type="date"
            value={newOpportunity.eventDate}
            onChange={(e) => handleInputChange('eventDate', e.target.value)}
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
            Application Deadline
          </label>
          <input
            type="date"
            value={newOpportunity.applicationDeadline}
            onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Location
          </label>
          <input
            type="text"
            value={newOpportunity.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="City, State"
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
            Estimated Attendees
          </label>
          <input
            type="number"
            value={newOpportunity.estimatedAttendees}
            onChange={(e) => handleInputChange('estimatedAttendees', e.target.value)}
            placeholder="Number of attendees"
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
      </div>

      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
          Speaking Topics (Select all that apply)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-2)' }}>
          {expertiseAreas.map(topic => (
            <label key={topic} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={newOpportunity.speakingTopics.includes(topic)}
                onChange={() => handleTopicToggle(topic)}
                style={{ accentColor: 'var(--primary-purple)' }}
              />
              {topic}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
          Notes
        </label>
        <textarea
          value={newOpportunity.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional notes about this opportunity"
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

      <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
        <button onClick={addOpportunity} style={{ flex: 1 }}>
          ➕ Add Opportunity
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
          🎤 Speaking Opportunities
        </h1>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Total Opportunities
            </div>
            <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.total}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Applied
            </div>
            <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.applied}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Confirmed
            </div>
            <div style={{ color: '#10B981', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.accepted}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Completed
            </div>
            <div style={{ color: '#8B5CF6', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.completed}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Total Leads
            </div>
            <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.totalLeads}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Revenue Generated
            </div>
            <div style={{ color: '#F59E0B', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['all', 'upcoming', 'applied', 'confirmed', 'past'].map(mode => (
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
              {['all', 'research', 'applied', 'accepted', 'declined', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    backgroundColor: statusFilter === status ? 'var(--secondary-blue)' : 'transparent',
                    color: statusFilter === status ? 'var(--white)' : 'var(--text-secondary)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: 'var(--font-size-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <button onClick={() => setShowResearchModal(true)}>
              🔍 Auto Research
            </button>
            <button onClick={() => setShowAddForm(true)}>
              ➕ Add Opportunity
            </button>
          </div>
        </div>

        {/* Add Opportunity Form */}
        {showAddForm && <AddOpportunityForm />}

        {/* Opportunities List */}
        <div style={{ marginBottom: 'var(--spacing-8)' }}>
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
            {viewMode === 'all' ? 'All' : viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Opportunities ({filteredOpportunities.length})
          </h2>
          
          {filteredOpportunities.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>🎤</div>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>No opportunities found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Try adjusting your filters or add a new speaking opportunity.
              </p>
            </div>
          ) : (
            <div>
              {filteredOpportunities.map(opportunity => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          )}
        </div>

        {/* Research Automation Placeholder */}
        <div style={{ marginTop: 'var(--spacing-8)' }}>
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>🔍 Automated Research Features</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>🌐</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Web Scraping</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Automatically discover new speaking opportunities from conference websites and directories
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
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Smart Matching</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  AI-powered matching based on your expertise areas and target audience preferences
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>📧</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Email Alerts</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Automated email notifications for new opportunities and approaching deadlines
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Research Modal */}
        {showResearchModal && (
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
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Automated Research Setup</h3>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h4 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Research Sources</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
                  Configure automated research from various nonprofit conference sources.
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
                  • Conference directory APIs<br/>
                  • Google Search integration<br/>
                  • Social media monitoring<br/>
                  • Email newsletter parsing
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h4 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Target Keywords</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-2)' }}>
                  {['nonprofit technology', 'grant writing', 'fundraising', 'volunteer management', 'digital transformation', 'automation'].map(keyword => (
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
                <button onClick={() => setShowResearchModal(false)} style={{ flex: 1 }}>
                  🔍 Start Research
                </button>
                <button onClick={() => setShowResearchModal(false)} style={{ flex: 1, backgroundColor: 'var(--medium-grey)' }}>
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

export default SpeakingOpportunities