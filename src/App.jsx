import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

// Import module pages
import PricingSOW from './pages/PricingSOW'
import ProjectPipeline from './pages/ProjectPipeline'
import BusinessStrategy from './pages/BusinessStrategy'
import MonthlyExpenses from './pages/MonthlyExpenses'
import ActionItems from './pages/ActionItems'
import SpeakingOpportunities from './pages/SpeakingOpportunities'
import AIToolsResearch from './pages/AIToolsResearch'
import CalendarOverview from './pages/CalendarOverview'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pricing-sow" element={<Dashboard />} />
          <Route path="/project-pipeline" element={<Dashboard />} />
          <Route path="/business-strategy" element={<Dashboard />} />
          <Route path="/monthly-expenses" element={<Dashboard />} />
          <Route path="/action-items" element={<Dashboard />} />
          <Route path="/speaking-opportunities" element={<Dashboard />} />
          <Route path="/ai-tools-research" element={<Dashboard />} />
          <Route path="/calendar-overview" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
