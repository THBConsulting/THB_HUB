import React, { useState, useEffect } from 'react'

const MonthlyExpenses = () => {
  const [viewMode, setViewMode] = useState('monthly') // 'monthly', 'yearly', 'trends'
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showAddForm, setShowAddForm] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: '2024-01-15',
      amount: 89.99,
      category: 'Software',
      subcategory: 'SaaS Tools',
      description: 'Adobe Creative Cloud',
      vendor: 'Adobe Inc.',
      taxDeductible: true,
      recurring: true,
      receipt: null
    },
    {
      id: 2,
      date: '2024-01-12',
      amount: 299.00,
      category: 'Equipment',
      subcategory: 'Hardware',
      description: 'MacBook Pro accessories',
      vendor: 'Apple Store',
      taxDeductible: true,
      recurring: false,
      receipt: null
    },
    {
      id: 3,
      date: '2024-01-10',
      amount: 150.00,
      category: 'Marketing',
      subcategory: 'Advertising',
      description: 'Google Ads campaign',
      vendor: 'Google',
      taxDeductible: true,
      recurring: true,
      receipt: null
    },
    {
      id: 4,
      date: '2024-01-08',
      amount: 45.00,
      category: 'Travel',
      subcategory: 'Transportation',
      description: 'Uber rides for client meetings',
      vendor: 'Uber',
      taxDeductible: true,
      recurring: false,
      receipt: null
    },
    {
      id: 5,
      date: '2024-01-05',
      amount: 199.00,
      category: 'Software',
      subcategory: 'Development Tools',
      description: 'JetBrains IDE licenses',
      vendor: 'JetBrains',
      taxDeductible: true,
      recurring: true,
      receipt: null
    }
  ])

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Software',
    subcategory: '',
    description: '',
    vendor: '',
    taxDeductible: true,
    recurring: false
  })

  const categories = {
    'Software': ['SaaS Tools', 'Development Tools', 'Design Software', 'Analytics'],
    'Marketing': ['Advertising', 'Social Media', 'Content Creation', 'Events'],
    'Equipment': ['Hardware', 'Office Supplies', 'Electronics', 'Furniture'],
    'Travel': ['Transportation', 'Accommodation', 'Meals', 'Conferences'],
    'Professional': ['Training', 'Certifications', 'Consulting', 'Legal'],
    'Utilities': ['Internet', 'Phone', 'Electricity', 'Office Rent'],
    'Insurance': ['Business Insurance', 'Health Insurance', 'Equipment Insurance'],
    'Other': ['Miscellaneous', 'Bank Fees', 'Taxes', 'Donations']
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getCurrentMonthExpenses = () => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })
  }

  const getCurrentYearExpenses = () => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getFullYear() === currentYear
    })
  }

  const getCategoryTotals = (expenseList) => {
    const totals = {}
    expenseList.forEach(expense => {
      if (!totals[expense.category]) {
        totals[expense.category] = 0
      }
      totals[expense.category] += expense.amount
    })
    return totals
  }

  const getMonthlyTrends = () => {
    const trends = {}
    for (let i = 0; i < 12; i++) {
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === i && expenseDate.getFullYear() === currentYear
      })
      trends[months[i]] = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    }
    return trends
  }

  const getRecurringExpenses = () => {
    return expenses.filter(expense => expense.recurring)
  }

  const addExpense = () => {
    if (!newExpense.amount || !newExpense.description) return
    
    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    }
    
    setExpenses(prev => [...prev, expense])
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: 'Software',
      subcategory: '',
      description: '',
      vendor: '',
      taxDeductible: true,
      recurring: false
    })
    setShowAddForm(false)
  }

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  const handleInputChange = (field, value) => {
    setNewExpense(prev => ({ ...prev, [field]: value }))
  }

  const currentExpenses = viewMode === 'monthly' ? getCurrentMonthExpenses() : getCurrentYearExpenses()
  const categoryTotals = getCategoryTotals(currentExpenses)
  const monthlyTrends = getMonthlyTrends()
  const recurringExpenses = getRecurringExpenses()
  const totalAmount = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const taxDeductibleTotal = currentExpenses
    .filter(expense => expense.taxDeductible)
    .reduce((sum, expense) => sum + expense.amount, 0)

  const ExpenseForm = () => (
    <div className="card">
      <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Add New Expense</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Date
          </label>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
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
            Amount ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={newExpense.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="0.00"
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
            Category
          </label>
          <select
            value={newExpense.category}
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
            {Object.keys(categories).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
            Subcategory
          </label>
          <select
            value={newExpense.subcategory}
            onChange={(e) => handleInputChange('subcategory', e.target.value)}
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
            <option value="">Select subcategory</option>
            {categories[newExpense.category]?.map(subcategory => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
          Description
        </label>
        <input
          type="text"
          value={newExpense.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of the expense"
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
          Vendor
        </label>
        <input
          type="text"
          value={newExpense.vendor}
          onChange={(e) => handleInputChange('vendor', e.target.value)}
          placeholder="Company or vendor name"
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

      <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          <input
            type="checkbox"
            checked={newExpense.taxDeductible}
            onChange={(e) => handleInputChange('taxDeductible', e.target.checked)}
            style={{ accentColor: 'var(--primary-purple)' }}
          />
          Tax Deductible
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          <input
            type="checkbox"
            checked={newExpense.recurring}
            onChange={(e) => handleInputChange('recurring', e.target.checked)}
            style={{ accentColor: 'var(--primary-purple)' }}
          />
          Recurring Expense
        </label>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
        <button onClick={addExpense} style={{ flex: 1 }}>
          💾 Add Expense
        </button>
        <button onClick={() => setShowAddForm(false)} style={{ flex: 1, backgroundColor: 'var(--medium-grey)' }}>
          Cancel
        </button>
      </div>
    </div>
  )

  const ExpenseChart = ({ data, title, color = 'var(--primary-purple)' }) => {
    const maxValue = Math.max(...Object.values(data))
    
    return (
      <div className="card">
        <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {Object.entries(data).map(([category, amount]) => (
            <div key={category} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
              <div style={{ minWidth: '120px', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {category}
              </div>
              <div style={{ flex: 1, height: '20px', backgroundColor: 'rgba(148, 163, 184, 0.2)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(amount / maxValue) * 100}%`,
                  height: '100%',
                  backgroundColor: color,
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ minWidth: '80px', textAlign: 'right', color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
                ${amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const TrendChart = ({ data, title, color = 'var(--secondary-blue)' }) => {
    const maxValue = Math.max(...Object.values(data))
    
    return (
      <div className="card">
        <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'end', gap: 'var(--spacing-2)', height: '200px' }}>
          {Object.entries(data).map(([month, amount]) => (
            <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                height: `${(amount / maxValue) * 180}px`,
                backgroundColor: color,
                borderRadius: '4px 4px 0 0',
                marginBottom: 'var(--spacing-2)',
                transition: 'height 0.3s ease'
              }} />
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)', textAlign: 'center' }}>
                {month.substring(0, 3)}
              </div>
              <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-xs)', fontWeight: '600', marginTop: 'var(--spacing-1)' }}>
                ${amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 'var(--spacing-8) 0' }}>
      <div className="container">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--white)' }}>
          💳 Monthly Expenses
        </h1>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-8)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Total {viewMode === 'monthly' ? 'Monthly' : 'Yearly'} Expenses
            </div>
            <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              ${totalAmount.toLocaleString()}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Tax Deductible
            </div>
            <div style={{ color: 'var(--primary-purple)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              ${taxDeductibleTotal.toLocaleString()}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Recurring Expenses
            </div>
            <div style={{ color: 'var(--secondary-blue)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {recurringExpenses.length}
            </div>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-2)' }}>
              Total Expenses
            </div>
            <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
              {expenses.length}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              {['monthly', 'yearly', 'trends'].map(mode => (
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
            
            {viewMode === 'monthly' && (
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  style={{
                    padding: 'var(--spacing-2)',
                    backgroundColor: 'var(--dark-black)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--white)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
                
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  style={{
                    padding: 'var(--spacing-2)',
                    backgroundColor: 'var(--dark-black)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--white)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  {[2023, 2024, 2025].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <button onClick={() => setShowImportModal(true)}>
              📊 Import CSV
            </button>
            <button onClick={() => setShowAddForm(true)}>
              ➕ Add Expense
            </button>
          </div>
        </div>

        {/* Add Expense Form */}
        {showAddForm && <ExpenseForm />}

        {/* Main Content */}
        {viewMode === 'trends' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
            <TrendChart
              title="Monthly Expense Trends"
              data={monthlyTrends}
              color="var(--secondary-blue)"
            />
            
            <ExpenseChart
              title="Yearly Category Breakdown"
              data={getCategoryTotals(getCurrentYearExpenses())}
              color="var(--primary-purple)"
            />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
            {/* Category Breakdown */}
            <ExpenseChart
              title={`${viewMode === 'monthly' ? 'Monthly' : 'Yearly'} Category Breakdown`}
              data={categoryTotals}
              color="var(--primary-purple)"
            />
            
            {/* Expense List */}
            <div className="card">
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>
                Recent Expenses ({currentExpenses.length})
              </h3>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {currentExpenses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-secondary)' }}>
                    No expenses found for this period
                  </div>
                ) : (
                  currentExpenses
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(expense => (
                      <div key={expense.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--spacing-3)',
                        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                        backgroundColor: 'var(--dark-black)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--spacing-2)'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
                            {expense.description}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                            {expense.vendor} • {expense.category}
                            {expense.taxDeductible && <span style={{ color: 'var(--primary-purple)', marginLeft: 'var(--spacing-2)' }}>• Tax Deductible</span>}
                            {expense.recurring && <span style={{ color: 'var(--secondary-blue)', marginLeft: 'var(--spacing-2)' }}>• Recurring</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: 'var(--white)', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>
                            ${expense.amount.toLocaleString()}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-xs)' }}>
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          style={{
                            marginLeft: 'var(--spacing-2)',
                            padding: 'var(--spacing-1)',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: 'var(--font-size-sm)'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Automation Placeholder */}
        <div style={{ marginTop: 'var(--spacing-8)' }}>
          <div className="card">
            <h2 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-6)' }}>🤖 Future Automation Features</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>📧</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Email Invoice Scanning</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Automatically extract expense data from email invoices and receipts
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
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Bulk Import</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Import expenses from bank statements, credit card exports, and accounting software
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'var(--dark-black)',
                padding: 'var(--spacing-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-3)' }}>🔄</div>
                <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-2)' }}>Recurring Setup</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  Automatically create recurring expense entries based on patterns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Import Modal */}
        {showImportModal && (
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
            <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
              <h3 style={{ color: 'var(--white)', marginBottom: 'var(--spacing-4)' }}>Import Expenses from CSV</h3>
              
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: 'var(--spacing-2)' }}>
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
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
                  CSV Format Expected:
                </label>
                <div style={{
                  backgroundColor: 'var(--dark-black)',
                  padding: 'var(--spacing-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'monospace'
                }}>
                  date,amount,category,description,vendor,taxDeductible,recurring<br/>
                  2024-01-15,89.99,Software,Adobe Creative Cloud,Adobe Inc.,true,true
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                <button onClick={() => setShowImportModal(false)} style={{ flex: 1 }}>
                  📥 Import Expenses
                </button>
                <button onClick={() => setShowImportModal(false)} style={{ flex: 1, backgroundColor: 'var(--medium-grey)' }}>
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

export default MonthlyExpenses