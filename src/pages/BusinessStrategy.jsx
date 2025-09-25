import React, { useState, useEffect } from 'react'
import { useSharedData } from '../contexts/SharedDataContext'

const BusinessStrategy = () => {
  const { 
    projects, 
    prospects, 
    strategyGoals, 
    setStrategyGoals, 
    projectMetrics, 
    strategyScenarios 
  } = useSharedData()

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          📊 Business Strategy
        </h1>
        
        <div className="card">
          <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>
            Business Strategy Module
          </h2>
          
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: 'var(--font-size-base)', 
            marginBottom: 'var(--spacing-6)',
            lineHeight: '1.6'
          }}>
            This module is being redesigned. Please provide the new requirements.
          </p>
          
          <div style={{
            backgroundColor: 'var(--dark-black)',
            padding: 'var(--spacing-4)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Ready for redesign
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessStrategy
