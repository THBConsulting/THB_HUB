import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Navigation from './components/Navigation'

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
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pricing-sow" element={<PricingSOW />} />
            <Route path="/project-pipeline" element={<ProjectPipeline />} />
            <Route path="/business-strategy" element={<BusinessStrategy />} />
            <Route path="/monthly-expenses" element={<MonthlyExpenses />} />
            <Route path="/action-items" element={<ActionItems />} />
            <Route path="/speaking-opportunities" element={<SpeakingOpportunities />} />
            <Route path="/ai-tools-research" element={<AIToolsResearch />} />
            <Route path="/calendar-overview" element={<CalendarOverview />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
