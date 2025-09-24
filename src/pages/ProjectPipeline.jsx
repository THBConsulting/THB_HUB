import React, { useState } from 'react'

const ProjectPipeline = () => {
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'list'
  const [projects, setProjects] = useState([])

  const [newProject, setNewProject] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    projectTitle: '',
    projectDescription: '',
    estimatedValue: '',
    notes: ''
  })

  const [showAddForm, setShowAddForm] = useState(false)

  const statusConfig = {
    discovery: { label: 'Discovery', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
    proposal: { label: 'Proposal Sent', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
    'in-progress': { label: 'In Progress', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    completed: { label: 'Completed', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.1)' }
  }

  const updateProjectStatus = (projectId, newStatus) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, status: newStatus }
        : project
    ))
  }

  const addNewProject = () => {
    const project = {
      id: Date.now(),
      ...newProject,
      status: 'discovery',
      estimatedValue: parseFloat(newProject.estimatedValue),
      depositAmount: parseFloat(newProject.estimatedValue) * 0.5,
      depositReceived: false,
      finalPaymentAmount: parseFloat(newProject.estimatedValue) * 0.5,
      finalPaymentReceived: false,
      proposalSentDate: null,
      startDate: null,
      completionDate: null,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setProjects(prev => [...prev, project])
    setNewProject({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      projectTitle: '',
      projectDescription: '',
      estimatedValue: '',
      notes: ''
    })
    setShowAddForm(false)
  }

  const getRevenueSummary = () => {
    const totalEstimated = projects.reduce((sum, p) => sum + p.estimatedValue, 0)
    const depositsReceived = projects.reduce((sum, p) => sum + (p.depositReceived ? p.depositAmount : 0), 0)
    const finalPaymentsReceived = projects.reduce((sum, p) => sum + (p.finalPaymentReceived ? p.finalPaymentAmount : 0), 0)
    const pendingDeposits = projects.reduce((sum, p) => sum + (!p.depositReceived ? p.depositAmount : 0), 0)
    const pendingFinalPayments = projects.reduce((sum, p) => sum + (!p.finalPaymentReceived && p.status === 'completed' ? p.finalPaymentAmount : 0), 0)
    
    return {
      totalEstimated,
      depositsReceived,
      finalPaymentsReceived,
      pendingDeposits,
      pendingFinalPayments,
      totalReceived: depositsReceived + finalPaymentsReceived
    }
  }

  const revenue = getRevenueSummary()

  const ProjectCard = ({ project }) => (
    <div className="card" style={{ marginBottom: 'var(--spacing-4)', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-3)' }}>
        <h3 className="text-lg font-semibold" style={{ color: 'var(--white)', margin: 0 }}>
          {project.projectTitle}
        </h3>
        <div style={{
          padding: 'var(--spacing-1) var(--spacing-2)',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: statusConfig[project.status].bgColor,
          color: statusConfig[project.status].color,
          fontSize: 'var(--font-size-xs)',
          fontWeight: '600'
        }}>
          {statusConfig[project.status].label}
        </div>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
        {project.clientName}
      </p>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)' }}>
        {project.projectDescription}
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>Estimated Value</div>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: 'var(--white)' }}>
            ${project.estimatedValue.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>Deposit</div>
          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', color: project.depositReceived ? '#10B981' : '#F59E0B' }}>
            {project.depositReceived ? '✓ Received' : 'Pending'}
          </div>
        </div>
      </div>
      
      {project.notes && (
        <div style={{ 
          backgroundColor: 'var(--dark-black)', 
          padding: 'var(--spacing-2)', 
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--text-secondary)'
        }}>
          {project.notes}
        </div>
      )}
    </div>
  )

  const KanbanColumn = ({ status, projects }) => (
    <div style={{ flex: 1, minWidth: '300px' }}>
      <div style={{
        backgroundColor: statusConfig[status].bgColor,
        padding: 'var(--spacing-3)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--spacing-4)',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          color: statusConfig[status].color, 
          margin: 0, 
          fontSize: 'var(--font-size-lg)',
          fontWeight: '600'
        }}>
          {statusConfig[status].label}
        </h3>
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div style={{ minHeight: '400px' }}>
        {projects.map(project => (
          <div key={project.id} style={{ marginBottom: 'var(--spacing-3)' }}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          📈 Project Pipeline
        </h1>

        {/* Revenue Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', margin: 0 }}>
              ${revenue.totalEstimated.toLocaleString()}
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Total Pipeline</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', margin: 0 }}>
              ${revenue.totalReceived.toLocaleString()}
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Received</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#F59E0B', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', margin: 0 }}>
              ${revenue.pendingDeposits.toLocaleString()}
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Pending Deposits</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#10B981', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', margin: 0 }}>
              ${revenue.pendingFinalPayments.toLocaleString()}
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Pending Final</p>
          </div>
        </div>

        {/* View Toggle and Add Project */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: 'var(--spacing-2) var(--spacing-4)',
                backgroundColor: viewMode === 'kanban' ? 'var(--primary-purple)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--white)' : 'var(--text-secondary)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📋 Kanban Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: 'var(--spacing-2) var(--spacing-4)',
                backgroundColor: viewMode === 'list' ? 'var(--primary-purple)' : 'transparent',
                color: viewMode === 'list' ? 'var(--white)' : 'var(--text-secondary)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📝 List View
            </button>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
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
            ➕ Add Project
          </button>
        </div>

        {/* Add Project Form Modal */}
        {showAddForm && (
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
            <div className="card" style={{ width: '600px', maxHeight: '80vh', overflow: 'auto' }}>
              <h2 className="text-xl font-semibold mb-6">Add New Project</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={newProject.clientName}
                    onChange={(e) => setNewProject(prev => ({ ...prev, clientName: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                    Client Email *
                  </label>
                  <input
                    type="email"
                    value={newProject.clientEmail}
                    onChange={(e) => setNewProject(prev => ({ ...prev, clientEmail: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  value={newProject.projectTitle}
                  onChange={(e) => setNewProject(prev => ({ ...prev, projectTitle: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                  Project Description *
                </label>
                <textarea
                  value={newProject.projectDescription}
                  onChange={(e) => setNewProject(prev => ({ ...prev, projectDescription: e.target.value }))}
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
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                    Estimated Value *
                  </label>
                  <input
                    type="number"
                    value={newProject.estimatedValue}
                    onChange={(e) => setNewProject(prev => ({ ...prev, estimatedValue: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                    Client Phone
                  </label>
                  <input
                    type="tel"
                    value={newProject.clientPhone}
                    onChange={(e) => setNewProject(prev => ({ ...prev, clientPhone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-3)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--font-size-sm)'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', color: 'var(--text-secondary)' }}>
                  Notes
                </label>
                <textarea
                  value={newProject.notes}
                  onChange={(e) => setNewProject(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
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
                />
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{
                    padding: 'var(--spacing-3) var(--spacing-6)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={addNewProject}
                  disabled={!newProject.clientName || !newProject.clientEmail || !newProject.projectTitle || !newProject.projectDescription || !newProject.estimatedValue}
                  style={{
                    padding: 'var(--spacing-3) var(--spacing-6)',
                    backgroundColor: 'var(--primary-purple)',
                    color: 'var(--white)',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    opacity: (!newProject.clientName || !newProject.clientEmail || !newProject.projectTitle || !newProject.projectDescription || !newProject.estimatedValue) ? 0.6 : 1
                  }}
                >
                  Add Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board View */}
        {viewMode === 'kanban' && (
          projects.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>📈</div>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>No Projects Yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                Start building your project pipeline by adding your first project.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
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
                ➕ Add Your First Project
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--spacing-6)', overflowX: 'auto' }}>
              {Object.keys(statusConfig).map(status => (
                <KanbanColumn
                  key={status}
                  status={status}
                  projects={projects.filter(p => p.status === status)}
                />
              ))}
            </div>
          )
        )}

        {/* List View */}
        {viewMode === 'list' && (
          projects.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-4)' }}>📈</div>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>No Projects Yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                Start building your project pipeline by adding your first project.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
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
                ➕ Add Your First Project
              </button>
            </div>
          ) : (
            <div className="card">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                      <th style={{ padding: 'var(--spacing-4)', textAlign: 'left', color: 'var(--text-secondary)' }}>Client</th>
                      <th style={{ padding: 'var(--spacing-4)', textAlign: 'left', color: 'var(--text-secondary)' }}>Project</th>
                      <th style={{ padding: 'var(--spacing-4)', textAlign: 'left', color: 'var(--text-secondary)' }}>Status</th>
                      <th style={{ padding: 'var(--spacing-4)', textAlign: 'left', color: 'var(--text-secondary)' }}>Value</th>
                      <th style={{ padding: 'var(--spacing-4)', textAlign: 'left', color: 'var(--text-secondary)' }}>Deposit</th>
                      <th style={{ padding: 'var(--spacing-4)', textAlign: 'left', color: 'var(--text-secondary)' }}>Final Payment</th>
                      <th style={{ padding: 'var(--spacing-4)', textAlign: 'left', color: 'var(--text-secondary)' }}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                        <td style={{ padding: 'var(--spacing-4)' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--white)' }}>{project.clientName}</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{project.clientEmail}</div>
                          </div>
                        </td>
                        <td style={{ padding: 'var(--spacing-4)' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--white)' }}>{project.projectTitle}</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{project.projectDescription}</div>
                          </div>
                        </td>
                        <td style={{ padding: 'var(--spacing-4)' }}>
                          <div style={{
                            padding: 'var(--spacing-1) var(--spacing-2)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: statusConfig[project.status].bgColor,
                            color: statusConfig[project.status].color,
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: '600',
                            display: 'inline-block'
                          }}>
                            {statusConfig[project.status].label}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--spacing-4)', color: 'var(--white)', fontWeight: '600' }}>
                          ${project.estimatedValue.toLocaleString()}
                        </td>
                        <td style={{ padding: 'var(--spacing-4)' }}>
                          <div style={{ color: project.depositReceived ? '#10B981' : '#F59E0B', fontWeight: '600' }}>
                            {project.depositReceived ? '✓ Received' : 'Pending'}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--spacing-4)' }}>
                          <div style={{ color: project.finalPaymentReceived ? '#10B981' : '#F59E0B', fontWeight: '600' }}>
                            {project.finalPaymentReceived ? '✓ Received' : 'Pending'}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--spacing-4)', color: 'var(--text-secondary)' }}>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default ProjectPipeline
