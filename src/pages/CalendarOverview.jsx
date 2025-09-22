import React, { useState, useEffect } from 'react'

const CalendarOverview = () => {
  const [viewMode, setViewMode] = useState('week') // 'week', 'month', 'agenda'
  const [calendarFilter, setCalendarFilter] = useState('all') // 'all', 'work', 'personal', 'client', 'speaking'
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [showIntegrationModal, setShowIntegrationModal] = useState(false)
  
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'TechStart Inc. Discovery Call',
      type: 'client',
      startTime: '2024-01-22T10:00:00Z',
      endTime: '2024-01-22T11:00:00Z',
      location: 'Zoom',
      description: 'Initial discovery call to discuss automation needs',
      attendees: ['john.smith@techstart.com'],
      preparation: {
        completed: false,
        checklist: [
          'Review client website and services',
          'Prepare automation assessment questions',
          'Set up project proposal template',
          'Check calendar for follow-up availability'
        ],
        notes: 'High-priority prospect - focus on HubSpot automation'
      },
      projectId: 1,
      calendar: 'work'
    },
    {
      id: 2,
      title: 'NonProfit Alliance Board Meeting',
      type: 'client',
      startTime: '2024-01-23T14:00:00Z',
      endTime: '2024-01-23T15:30:00Z',
      location: 'NonProfit Alliance Office',
      description: 'Quarterly board meeting to discuss Q1 automation projects',
      attendees: ['sarah.johnson@nonprofitalliance.org', 'board@nonprofitalliance.org'],
      preparation: {
        completed: true,
        checklist: [
          'Prepare automation ROI presentation',
          'Review Q1 project status',
          'Prepare budget recommendations',
          'Bring project timeline updates'
        ],
        notes: 'Need to present automation ROI data and get budget approval'
      },
      projectId: 2,
      calendar: 'work'
    },
    {
      id: 3,
      title: 'Volunteer Management Summit - Speaking',
      type: 'speaking',
      startTime: '2024-01-25T09:00:00Z',
      endTime: '2024-01-25T10:00:00Z',
      location: 'San Francisco Convention Center',
      description: 'Keynote presentation on volunteer management technology',
      attendees: ['lisa@volunteermatch.org', '500+ attendees'],
      preparation: {
        completed: false,
        checklist: [
          'Finalize presentation slides',
          'Prepare demo environment',
          'Review audience questions',
          'Confirm travel arrangements',
          'Prepare networking materials'
        ],
        notes: 'Key opportunity for lead generation - focus on nonprofit automation'
      },
      projectId: null,
      calendar: 'work'
    },
    {
      id: 4,
      title: 'Emma Parent-Teacher Conference',
      type: 'personal',
      startTime: '2024-01-24T15:30:00Z',
      endTime: '2024-01-24T16:15:00Z',
      location: 'Elementary School',
      description: 'Quarterly conference to discuss academic progress',
      attendees: ['teacher@elementaryschool.edu'],
      preparation: {
        completed: false,
        checklist: [
          'Bring progress report',
          'Prepare questions about academic goals',
          'Review homework completion',
          'Discuss extracurricular activities'
        ],
        notes: 'Important to understand Emma\'s learning needs'
      },
      projectId: null,
      calendar: 'personal'
    },
    {
      id: 5,
      title: 'Chamber of Commerce Networking',
      type: 'networking',
      startTime: '2024-01-26T17:00:00Z',
      endTime: '2024-01-26T19:00:00Z',
      location: 'Chamber of Commerce Building',
      description: 'Monthly networking event for local business owners',
      attendees: ['50+ local business owners'],
      preparation: {
        completed: false,
        checklist: [
          'Prepare elevator pitch',
          'Bring business cards',
          'Research key attendees',
          'Prepare automation case studies'
        ],
        notes: 'Great opportunity to meet potential clients in the area'
      },
      projectId: null,
      calendar: 'work'
    },
    {
      id: 6,
      title: 'GreenTech Project Review',
      type: 'client',
      startTime: '2024-01-29T13:00:00Z',
      endTime: '2024-01-29T14:00:00Z',
      location: 'GreenTech Office',
      description: 'Project completion review and final payment discussion',
      attendees: ['finance@greentech.com', 'project.manager@greentech.com'],
      preparation: {
        completed: false,
        checklist: [
          'Prepare project completion report',
          'Document delivered features',
          'Prepare final invoice',
          'Plan next phase discussion'
        ],
        notes: 'Project completed successfully - discuss potential follow-up work'
      },
      projectId: 3,
      calendar: 'work'
    }
  ])

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'client',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    attendees: '',
    calendar: 'work',
    notes: ''
  })

  const eventTypes = {
    'client': { label: 'Client Meeting', icon: '🤝', color: 'var(--primary-purple)' },
    'personal': { label: 'Personal', icon: '👨‍👩‍👧‍👦', color: '#10B981' },
    'speaking': { label: 'Speaking Event', icon: '🎤', color: 'var(--secondary-blue)' },
    'networking': { label: 'Networking', icon: '🌐', color: '#F59E0B' },
    'internal': { label: 'Internal', icon: '🏢', color: '#6B7280' },
    'deadline': { label: 'Deadline', icon: '⏰', color: '#EF4444' }
  }

  const getCurrentWeekEvents = () => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime)
      return eventDate >= startOfWeek && eventDate <= endOfWeek
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    return events.filter(event => new Date(event.startTime) >= today)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5)
  }

  const getFilteredEvents = () => {
    let filtered = events

    if (calendarFilter !== 'all') {
      filtered = filtered.filter(event => event.type === calendarFilter)
    }

    return filtered.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  }

  const getStats = () => {
    const total = events.length
    const clientMeetings = events.filter(event => event.type === 'client').length
    const personalEvents = events.filter(event => event.type === 'personal').length
    const speakingEvents = events.filter(event => event.type === 'speaking').length
    const upcoming = events.filter(event => new Date(event.startTime) >= new Date()).length
    const preparationPending = events.filter(event => !event.preparation.completed).length

    return { total, clientMeetings, personalEvents, speakingEvents, upcoming, preparationPending }
  }

  const togglePreparationComplete = (id) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { 
        ...event, 
        preparation: { ...event.preparation, completed: !event.preparation.completed } 
      } : event
    ))
  }

  const addEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return

    const event = {
      id: Date.now(),
      ...newEvent,
      attendees: newEvent.attendees.split(',').map(a => a.trim()).filter(a => a),
      preparation: {
        completed: false,
        checklist: [],
        notes: newEvent.notes
      }
    }

    setEvents(prev => [...prev, event])
    setNewEvent({
      title: '',
      type: 'client',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      attendees: '',
      calendar: 'work',
      notes: ''
    })
    setShowAddEvent(false)
  }

  const handleInputChange = (field, value) => {
    setNewEvent(prev => ({ ...prev, [field]: value }))
  }

  const filteredEvents = getFilteredEvents()
  const currentWeekEvents = getCurrentWeekEvents()
  const upcomingEvents = getUpcomingEvents()
  const stats = getStats()

  const EventCard = ({ event }) => {
    const eventTypeInfo = eventTypes[event.type]
    const startTime = new Date(event.startTime)
    const endTime = new Date(event.endTime)
    const isUpcoming = startTime > new Date()
    const isToday = startTime.toDateString() === new Date().toDateString()
    
    return (
      <div style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-4)',
        border: isToday ? '2px solid var(--primary-purple)' : '1px solid rgba(148, 163, 184, 0.1)',
        marginBottom: 'var(--spacing-3)',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
              <span style={{ fontSize: 'var(--font-size-lg)' }}>{eventTypeInfo.icon}</span>
              <h3 style={{ color: 'var(--white)', fontSize: 'var(--font-size-lg)', fontWeight: '600', margin: 0 }}>
                {event.title}
              </h3>
              <div style={{
                padding: 'var(--spacing-1) var(--spacing-2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: '600',
                backgroundColor: eventTypeInfo.color,
                color: 'var(--white)',
                textTransform: 'capitalize'
              }}>
                {eventTypeInfo.label}
              </div>
            </div>
            
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              <div style={{ marginBottom: 'var(--spacing-1)' }}>
                <strong>Time:</strong> {startTime.toLocaleString()} - {endTime.toLocaleTimeString()}
              </div>
              <div style={{ marginBottom: 'var(--spacing-1)' }}>
                <strong>Location:</strong> {event.location}
              </div>
              {event.attendees.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-1)' }}>
                  <strong>Attendees:</strong> {event.attendees.join(', ')}
                </div>
              )}
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
              {event.description}
            </p>
            
            {event.preparation && (
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-3)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                  <span style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
                    Meeting Preparation:
                  </span>
                  <div style={{
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: '600',
                    backgroundColor: event.preparation.completed ? '#10B981' : '#F59E0B',
                    color: 'var(--white)'
                  }}>
                    {event.preparation.completed ? 'Completed' : 'Pending'}
                  </div>
                </div>
                
                {event.preparation.checklist.length > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-2)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--spacing-1)' }}>
                      Checklist:
                    </div>
                    <ul style={{ paddingLeft: 'var(--spacing-4)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                      {event.preparation.checklist.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {event.preparation.notes && (
                  <div style={{
                    backgroundColor: 'rgba(148, 163, 184, 0.1)',
                    padding: 'var(--spacing-2)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic'
                  }}>
                    💡 {event.preparation.notes}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {event.preparation && (
              <button
                onClick={() => togglePreparationComplete(event.id)}
                style={{
                  padding: 'var(--spacing-2)',
                  backgroundColor: event.preparation.completed ? '#10B981' : 'var(--primary-purple)',
                  color: 'var(--white)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '600'
                }}
              >
                {event.preparation.completed ? '✅ Complete' : '📋 Prepare'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const AddEventForm = () => (
    <div className="card">
      <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Add New Event</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Event Title
          </label>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Event title"
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
            Event Type
          </label>
          <select
            value={newEvent.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
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
            {Object.entries(eventTypes).map(([key, info]) => (
              <option key={key} value={key}>{info.icon} {info.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Start Time
          </label>
          <input
            type="datetime-local"
            value={newEvent.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
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
            End Time
          </label>
          <input
            type="datetime-local"
            value={newEvent.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
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
          Description
        </label>
        <textarea
          value={newEvent.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Event description"
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

      <div style={{ marginBottom: 'var(--spacing-6)' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
          Notes
        </label>
        <textarea
          value={newEvent.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Additional notes"
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
        <button onClick={addEvent} style={{ flex: 1 }}>
          ➕ Add Event
        </button>
        <button onClick={() => setShowAddEvent(false)} style={{ flex: 1, backgroundColor: 'var(--medium-grey)' }}>
          Cancel
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          📅 Calendar Overview
        </h1>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Total Events
            </div>
            <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.total}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Client Meetings
            </div>
            <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.clientMeetings}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Speaking Events
            </div>
            <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.speakingEvents}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Upcoming
            </div>
            <div style={{ color: '#10B981', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.upcoming}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Prep Pending
            </div>
            <div style={{ color: '#F59E0B', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {stats.preparationPending}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['week', 'month', 'agenda'].map(mode => (
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
              {['all', 'client', 'personal', 'speaking', 'networking'].map(type => (
                <button
                  key={type}
                  onClick={() => setCalendarFilter(type)}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    backgroundColor: calendarFilter === type ? 'var(--secondary-blue)' : 'transparent',
                    color: calendarFilter === type ? 'var(--white)' : 'var(--text-secondary)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: 'var(--font-size-sm)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <button onClick={() => setShowIntegrationModal(true)}>
              🔗 Google Calendar
            </button>
            <button onClick={() => setShowAddEvent(true)}>
              ➕ Add Event
            </button>
          </div>
        </div>

        {/* Add Event Form */}
        {showAddEvent && <AddEventForm />}

        {/* Calendar Content */}
        {viewMode === 'agenda' ? (
          <div style={{ marginBottom: 'var(--spacing-8)' }}>
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
              Upcoming Events ({upcomingEvents.length})
            </h2>
            
            {upcomingEvents.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>📅</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>No upcoming events</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Add events to your calendar or connect your Google Calendar.
                </p>
              </div>
            ) : (
              <div>
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: 'var(--spacing-8)' }}>
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
              {viewMode === 'week' ? 'This Week' : 'This Month'} ({filteredEvents.length})
            </h2>
            
            {filteredEvents.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>📅</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>No events found</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Try adjusting your filters or add a new event.
                </p>
              </div>
            ) : (
              <div>
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Google Calendar Integration Placeholder */}
        <div style={{ marginTop: 'var(--spacing-8)' }}>
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>🔗 Google Calendar Integration</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
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
                  Sync with Google Calendar for real-time event updates and seamless integration
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>🤖</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Smart Scheduling</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  AI-powered scheduling suggestions based on your productivity patterns and preferences
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
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Analytics</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Track meeting patterns, productivity insights, and time allocation across different activities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Modal */}
        {showIntegrationModal && (
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
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Google Calendar Integration</h3>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h4 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Calendar Connection</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
                  Connect your Google Calendar accounts to sync events and enable smart scheduling features.
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
                  • Google Calendar API integration<br/>
                  • Real-time event synchronization<br/>
                  • Meeting preparation automation<br/>
                  • Smart scheduling algorithms
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <h4 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Calendar Accounts</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-2)' }}>
                  {['Work Calendar', 'Personal Calendar', 'Speaking Events', 'Client Meetings'].map(calendar => (
                    <div key={calendar} style={{
                      padding: 'var(--spacing-2)',
                      backgroundColor: 'var(--dark-black)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)',
                      textAlign: 'center'
                    }}>
                      {calendar}
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                <button onClick={() => setShowIntegrationModal(false)} style={{ flex: 1 }}>
                  🔗 Connect Calendar
                </button>
                <button onClick={() => setShowIntegrationModal(false)} style={{ flex: 1, backgroundColor: 'var(--medium-grey)' }}>
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

export default CalendarOverview