// API Service utilities for THB Operations Hub

// Claude API Service
export const claudeAPI = {
  async analyzeProjectComplexity(projectData) {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    
    if (!apiKey) {
      console.warn('Claude API key not found');
      return {
        complexity: 5,
        pricing: '$5,000 - $15,000',
        timeline: '4-6 weeks',
        recommendations: ['Standard automation setup', 'Basic integration']
      };
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Analyze this automation project and provide complexity scoring, pricing recommendations, and timeline estimates:

Project Details:
- Client Type: ${projectData.clientType}
- Description: ${projectData.description}
- Features: ${projectData.features.join(', ')}
- Timeline: ${projectData.timeline}
- Budget: ${projectData.budget}

Client Context:
${projectData.clientContext ? `
- Organization Type: ${projectData.clientContext.organizationType || 'Not specified'}
- Organization Mission: ${projectData.clientContext.organizationMission || 'Not specified'}
- Team Size: ${projectData.clientContext.teamSize || 'Not specified'}
- Tech Comfort Level: ${projectData.clientContext.techComfortLevel || 'Not specified'}
- Primary Goal: ${projectData.clientContext.primaryGoal || 'Not specified'}
` : 'No client context provided'}

AI Opportunity Assessment:
${projectData.aiAssessment ? Object.entries(projectData.aiAssessment).map(([category, data]) => {
  const categoryNames = {
    contentCommunication: 'Content & Communication',
    dataAnalysis: 'Data & Analysis', 
    processAutomation: 'Process Automation',
    informationManagement: 'Information Management',
    stakeholderEngagement: 'Stakeholder Engagement'
  }
  return `${categoryNames[category] || category}:
- Current Activities: ${data.currentActivities || 'Not specified'}
- Pain Points: ${data.painPoints || 'Not specified'}
- Interested in AI: ${data.interested ? 'Yes' : 'No'}`
}).join('\n\n') : 'No assessment data provided'}

Please respond with a JSON object containing:
{
  "complexity": number (1-10),
  "pricing": "range string",
  "timeline": "estimate string",
  "recommendations": ["array", "of", "recommendations"],
  "aiOpportunities": ["array", "of", "identified", "ai", "opportunities"]
}`
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return {
          complexity: 6,
          pricing: '$8,000 - $20,000',
          timeline: '6-8 weeks',
          recommendations: ['AI-powered analysis', 'Custom automation']
        };
      }
    } catch (error) {
      console.error('Claude API error:', error);
      return {
        complexity: 5,
        pricing: '$5,000 - $15,000',
        timeline: '4-6 weeks',
        recommendations: ['Standard automation setup', 'Basic integration']
      };
    }
  },

  async generateSOW(projectData, analysis) {
    const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
    
    if (!apiKey) {
      return this.generateFallbackSOW(projectData, analysis);
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `Generate a professional Statement of Work (SOW) document for this automation project:

Project Details:
- Client: ${projectData.clientName || 'Client'}
- Type: ${projectData.clientType}
- Description: ${projectData.description}
- Features: ${projectData.features.join(', ')}
- Timeline: ${projectData.timeline}
- Budget: ${projectData.budget}

Analysis Results:
- Complexity: ${analysis.complexity}/10
- Pricing: ${analysis.pricing}
- Timeline: ${analysis.timeline}
- Recommendations: ${analysis.recommendations.join(', ')}

Please generate a complete SOW document with sections for:
1. Project Overview
2. Scope of Work
3. Deliverables
4. Timeline
5. Pricing
6. Terms and Conditions

Format as a professional business document.`
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      return this.generateFallbackSOW(projectData, analysis);
    }
  },

  generateFallbackSOW(projectData, analysis) {
    return `
STATEMENT OF WORK
THB Operations Hub - Automation Project

Project Overview:
This Statement of Work outlines the development and implementation of a custom automation solution for ${projectData.clientName || 'Client'}.

Scope of Work:
- Analysis and implementation of automation workflows
- Integration with existing systems
- Custom feature development as specified
- Testing and quality assurance
- Documentation and training

Deliverables:
- Fully functional automation system
- Technical documentation
- User training materials
- 30-day support period

Timeline: ${analysis.timeline}
Pricing: ${analysis.pricing}

Terms and Conditions:
- Payment terms: 50% upfront, 50% upon completion
- Intellectual property rights remain with THB Operations Hub
- Support included for 30 days post-delivery
- Additional features subject to change order

Generated on: ${new Date().toLocaleDateString()}
    `.trim();
  }
};

// OpenAI API Service
export const openAIAPI = {
  async extractActionItems(emailContent) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key not found');
      return this.generateFallbackActionItems(emailContent);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Extract action items from this email content and return them as a JSON array:

Email Content:
${emailContent}

Please return a JSON array of action items, each with:
{
  "task": "description of the task",
  "priority": "high|medium|low",
  "dueDate": "YYYY-MM-DD or null",
  "category": "business|personal|follow-up|deadline",
  "context": "brief context about the task"
}

If no action items are found, return an empty array.`
          }],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        return this.generateFallbackActionItems(emailContent);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackActionItems(emailContent);
    }
  },

  generateFallbackActionItems(emailContent) {
    // Simple fallback that looks for common action item patterns
    const actionItems = [];
    const lines = emailContent.split('\n');
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('follow up') || lowerLine.includes('follow-up')) {
        actionItems.push({
          task: line.trim(),
          priority: 'medium',
          dueDate: null,
          category: 'follow-up',
          context: 'Email follow-up required'
        });
      } else if (lowerLine.includes('deadline') || lowerLine.includes('due')) {
        actionItems.push({
          task: line.trim(),
          priority: 'high',
          dueDate: null,
          category: 'deadline',
          context: 'Time-sensitive task'
        });
      }
    });

    return actionItems;
  },

  async analyzeFeasibility(assessmentData) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key not found');
      return this.generateFallbackFeasibility(assessmentData);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Analyze the feasibility of AI automation opportunities for this organization. Provide detailed feasibility scores and recommendations for each area.

Organization Context:
${assessmentData[0] ? `
- Organization Type: ${assessmentData[0].organizationType || 'Not specified'}
- Team Size: ${assessmentData[0].teamSize || 'Not specified'}
- Tech Comfort Level: ${assessmentData[0].techComfortLevel || 'Not specified'}
- Primary Goal: ${assessmentData[0].primaryGoal || 'Not specified'}
- Timeline Requirements: ${assessmentData[0].timeline || 'Not specified'}
- Budget Range: ${assessmentData[0].budgetRange || 'Not specified'}
` : 'No context provided'}

Opportunity Areas to Analyze:
${assessmentData.map(area => `
Area: ${area.area}
Description: ${area.description}
Current Activities: ${area.currentActivities}
Pain Points: ${area.painPoints}
`).join('\n')}

For each opportunity area, provide a JSON response with:
{
  "areas": [
    {
      "areaName": "exact area name",
      "feasibility": "High|Medium|Low",
      "explanation": "brief explanation of what's possible",
      "limitations": "potential limitations or workarounds needed",
      "complexity": "Low|Medium|High",
      "recommendations": ["specific", "actionable", "recommendations"]
    }
  ]
}

Consider factors like:
- Organization size and resources
- Tech comfort level
- Current pain points
- Implementation complexity
- ROI potential
- Timeline feasibility`
          }],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        return this.generateFallbackFeasibility(assessmentData);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackFeasibility(assessmentData);
    }
  },

  generateFallbackFeasibility(assessmentData) {
    return {
      areas: assessmentData.map(area => ({
        areaName: area.area,
        feasibility: 'Medium',
        explanation: `AI automation is feasible for ${area.area.toLowerCase()} based on your current activities and pain points.`,
        limitations: 'May require additional training and gradual implementation.',
        complexity: 'Medium',
        recommendations: [
          'Start with simple automation tasks',
          'Provide team training on new tools',
          'Implement gradually to ensure adoption'
        ]
      }))
    };
  },

  async generateClientDocument(documentData) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key not found');
      return this.generateFallbackClientDocument(documentData);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Generate a professional client-facing document explaining AI automation opportunities in plain language. This document should educate the client about what's possible and their role in the project.

Organization Context:
- Organization Type: ${documentData.organizationType || 'Not specified'}
- Team Size: ${documentData.teamSize || 'Not specified'}
- Tech Comfort Level: ${documentData.techComfortLevel || 'Not specified'}
- Primary Goal: ${documentData.primaryGoal || 'Not specified'}

Included Opportunity Areas:
${documentData.includedAreas.map(area => `
- ${area.areaName}: ${area.feasibility} feasibility, ${area.complexity} complexity
  Explanation: ${area.explanation}
  Recommendations: ${area.recommendations.join(', ')}
`).join('\n')}

Generate a JSON response with these sections:
{
  "executiveSummary": "Brief overview of the AI automation project and its benefits",
  "recommendedSolutions": "Detailed explanation of recommended AI solutions based on feasibility analysis",
  "solutionExamples": "Realistic examples of what each solution will look like in practice",
  "clientRole": "Clear explanation of the client's 20% responsibilities and time investment",
  "timeline": "Realistic timeline expectations for implementation",
  "nextSteps": "Specific next steps for moving forward with the project"
}

Write in a professional but accessible tone. Focus on:
- Plain language explanations
- Realistic expectations
- Clear client responsibilities
- Practical examples
- Actionable next steps`
          }],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        return this.generateFallbackClientDocument(documentData);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackClientDocument(documentData);
    }
  },

  generateFallbackClientDocument(documentData) {
    return {
      executiveSummary: `Based on your organization's profile and the feasibility analysis, we've identified several AI automation opportunities that can help you ${documentData.primaryGoal || 'achieve your goals'}. This document outlines what's possible and your role in making these solutions successful.`,
      recommendedSolutions: `We recommend focusing on ${documentData.includedAreas.map(area => area.areaName).join(', ')} based on your organization's size, tech comfort level, and current pain points. These solutions offer the best balance of impact and feasibility for your team.`,
      solutionExamples: `Each solution will be tailored to your specific needs. For example, content automation might include automated report generation, while process automation could streamline your approval workflows. We'll provide detailed examples during the project kickoff.`,
      clientRole: `Your role involves approximately 20% of the total effort, including providing feedback, testing solutions, and ensuring team adoption. This typically means 2-4 hours per week during implementation and ongoing support for your team.`,
      timeline: `Implementation typically takes 6-12 weeks depending on complexity. We'll start with the highest-impact, lowest-complexity solutions and build from there. Regular check-ins ensure we stay on track.`,
      nextSteps: `Next steps include: 1) Review and approve this document, 2) Schedule a project kickoff meeting, 3) Begin with the first solution implementation, 4) Regular progress reviews and adjustments as needed.`
    };
  },

  async calculatePricingBreakdown(projectData) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key not found');
      return this.generateFallbackPricingBreakdown(projectData);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Calculate a detailed pricing breakdown for this AI automation project using our 3-component pricing structure.

Project Context:
- Organization Type: ${projectData.clientContext.organizationType || 'Not specified'}
- Team Size: ${projectData.clientContext.teamSize || 'Not specified'}
- Tech Comfort Level: ${projectData.clientContext.techComfortLevel || 'Not specified'}
- Primary Goal: ${projectData.clientContext.primaryGoal || 'Not specified'}

Included Opportunity Areas:
${projectData.includedAreas.map(area => `
- ${area.areaName}: ${area.feasibility} feasibility, ${area.complexity} complexity
  Explanation: ${area.explanation}
`).join('\n')}

Pricing Structure:
1. Development Fee: Based on complexity tiers
   - Tier 1 (1-2 areas, low complexity): $1,500-$3,000
   - Tier 2 (3-4 areas, medium complexity): $3,000-$5,000
   - Tier 3 (5+ areas, high complexity): $5,000-$7,500

2. Consulting & Setup: Hourly rate × estimated hours
   - Hourly rate: $150/hour
   - Hours based on complexity, team size, and tech comfort level

3. Ongoing Backend Costs: Monthly fees
   - Based on expected usage, integrations, and hosting needs

Return a JSON response with:
{
  "pricingTier": "Tier 1|Tier 2|Tier 3",
  "developmentFee": {
    "min": number,
    "max": number,
    "recommended": number,
    "explanation": "why this tier was selected"
  },
  "consultingSetup": {
    "hourlyRate": 150,
    "estimatedHours": number,
    "totalCost": number,
    "breakdown": "explanation of hours needed"
  },
  "ongoingCosts": {
    "monthlyFee": number,
    "annualFee": number,
    "breakdown": "explanation of ongoing costs"
  },
  "totalProjectCost": {
    "min": number,
    "max": number,
    "recommended": number
  },
  "summary": "brief explanation of the pricing structure"
}`
          }],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        return this.generateFallbackPricingBreakdown(projectData);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackPricingBreakdown(projectData);
    }
  },

  generateFallbackPricingBreakdown(projectData) {
    const areaCount = projectData.includedAreas.length;
    const avgComplexity = projectData.includedAreas.reduce((sum, area) => {
      const complexityScore = area.complexity === 'High' ? 3 : area.complexity === 'Medium' ? 2 : 1;
      return sum + complexityScore;
    }, 0) / areaCount;

    // Determine pricing tier
    let pricingTier, developmentFee;
    if (areaCount <= 2 && avgComplexity <= 1.5) {
      pricingTier = 'Tier 1';
      developmentFee = { min: 1500, max: 3000, recommended: 2250 };
    } else if (areaCount <= 4 && avgComplexity <= 2.5) {
      pricingTier = 'Tier 2';
      developmentFee = { min: 3000, max: 5000, recommended: 4000 };
    } else {
      pricingTier = 'Tier 3';
      developmentFee = { min: 5000, max: 7500, recommended: 6250 };
    }

    // Calculate consulting hours based on complexity and team size
    const baseHours = areaCount * 8; // 8 hours per area
    const complexityMultiplier = avgComplexity;
    const teamSizeMultiplier = projectData.clientContext.teamSize === '1-5' ? 0.8 : 
                               projectData.clientContext.teamSize === '6-15' ? 1.0 : 1.2;
    const techComfortMultiplier = projectData.clientContext.techComfortLevel === 'basic' ? 1.3 :
                                  projectData.clientContext.techComfortLevel === 'intermediate' ? 1.0 : 0.8;

    const estimatedHours = Math.round(baseHours * complexityMultiplier * teamSizeMultiplier * techComfortMultiplier);
    const hourlyRate = 150;
    const consultingTotal = estimatedHours * hourlyRate;

    // Calculate ongoing costs
    const monthlyFee = Math.round(50 + (areaCount * 25) + (avgComplexity * 20));
    const annualFee = monthlyFee * 12;

    const totalMin = developmentFee.min + consultingTotal;
    const totalMax = developmentFee.max + consultingTotal;
    const totalRecommended = developmentFee.recommended + consultingTotal;

    return {
      pricingTier,
      developmentFee: {
        ...developmentFee,
        explanation: `Selected ${pricingTier} based on ${areaCount} opportunity areas and ${avgComplexity.toFixed(1)} average complexity score.`
      },
      consultingSetup: {
        hourlyRate: 150,
        estimatedHours: estimatedHours,
        totalCost: consultingTotal,
        breakdown: `${estimatedHours} hours estimated based on ${areaCount} areas, complexity level, team size (${projectData.clientContext.teamSize}), and tech comfort level (${projectData.clientContext.techComfortLevel}).`
      },
      ongoingCosts: {
        monthlyFee: monthlyFee,
        annualFee: annualFee,
        breakdown: `Monthly hosting, API costs, and maintenance based on ${areaCount} active solutions and complexity level.`
      },
      totalProjectCost: {
        min: totalMin,
        max: totalMax,
        recommended: totalRecommended
      },
      summary: `Total project investment: $${totalRecommended.toLocaleString()} (one-time) plus $${monthlyFee}/month ongoing costs.`
    };
  },

  async generateEnhancedSOW(sowData) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key not found');
      return this.generateFallbackEnhancedSOW(sowData);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Generate a comprehensive, professional Statement of Work (SOW) for THB Operations Hub based on all the discovery and analysis data provided.

CLIENT INFORMATION:
- Client Name: ${sowData.clientName || 'TBD'}
- Client Email: ${sowData.clientEmail || 'TBD'}
- Organization Type: ${sowData.clientContext.organizationType || 'Not specified'}
- Organization Mission: ${sowData.clientContext.organizationMission || 'Not specified'}
- Team Size: ${sowData.clientContext.teamSize || 'Not specified'}
- Tech Comfort Level: ${sowData.clientContext.techComfortLevel || 'Not specified'}
- Primary Goal: ${sowData.clientContext.primaryGoal || 'Not specified'}

PROJECT SCOPE:
- Client Type: ${sowData.clientType || 'Not specified'}
- Timeline Requirements: ${sowData.timeline || 'Not specified'}

FEASIBILITY ANALYSIS RESULTS:
${sowData.includedAreas.map(area => `
- ${area.areaName}: ${area.feasibility} feasibility, ${area.complexity} complexity
  Explanation: ${area.explanation}
  Limitations: ${area.limitations}
  Recommendations: ${area.recommendations.join(', ')}
`).join('\n')}

PRICING BREAKDOWN:
- Pricing Tier: ${sowData.pricingBreakdown.pricingTier}
- Development Fee: $${sowData.pricingBreakdown.developmentFee.recommended.toLocaleString()}
- Consulting & Setup: ${sowData.pricingBreakdown.consultingSetup.estimatedHours} hours × $${sowData.pricingBreakdown.consultingSetup.hourlyRate} = $${sowData.pricingBreakdown.consultingSetup.totalCost.toLocaleString()}
- Ongoing Monthly Costs: $${sowData.pricingBreakdown.ongoingCosts.monthlyFee}/month
- Total Project Investment: $${sowData.pricingBreakdown.totalProjectCost.recommended.toLocaleString()}

CLIENT DOCUMENT REFERENCE:
${sowData.clientDocument ? `
- Executive Summary: ${sowData.clientDocument.executiveSummary}
- Client Role: ${sowData.clientDocument.clientRole}
- Timeline: ${sowData.clientDocument.timeline}
- Next Steps: ${sowData.clientDocument.nextSteps}
` : 'No client document generated'}

Generate a professional SOW with these sections:
1. Executive Summary
2. Project Scope & Objectives
3. Detailed Deliverables (for each opportunity area)
4. Pricing & Investment
5. Project Timeline & Milestones
6. Client Responsibilities
7. Terms & Conditions
8. Next Steps & Approval Process

Use professional language, include THB Operations Hub branding, and make it comprehensive yet accessible. Return as structured JSON with each section as a separate field.`
          }],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        return this.generateFallbackEnhancedSOW(sowData);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackEnhancedSOW(sowData);
    }
  },

  generateFallbackEnhancedSOW(sowData) {
    const includedAreas = sowData.includedAreas || [];
    const pricing = sowData.pricingBreakdown || {};
    
    return {
      executiveSummary: `This Statement of Work outlines the development and implementation of AI automation solutions for ${sowData.clientName || 'Client'}. Based on our comprehensive feasibility analysis, we will implement ${includedAreas.length} key automation areas to help achieve your primary goal of ${sowData.clientContext.primaryGoal || 'improving operational efficiency'}.`,
      
      projectScope: `The project encompasses the design, development, and implementation of custom AI automation solutions across ${includedAreas.map(area => area.areaName).join(', ')}. This scope is based on our detailed feasibility analysis and organizational assessment, ensuring solutions are tailored to your team size (${sowData.clientContext.teamSize}), tech comfort level (${sowData.clientContext.techComfortLevel}), and specific pain points.`,
      
      deliverables: includedAreas.map(area => ({
        area: area.areaName,
        description: area.explanation,
        deliverables: [
          `Custom ${area.areaName.toLowerCase()} automation solution`,
          'Technical documentation and user guides',
          'Team training and implementation support',
          '30-day post-launch support and optimization'
        ],
        timeline: area.complexity === 'High' ? '3-4 weeks' : area.complexity === 'Medium' ? '2-3 weeks' : '1-2 weeks'
      })),
      
      pricing: {
        developmentFee: pricing.developmentFee?.recommended || 0,
        consultingSetup: pricing.consultingSetup?.totalCost || 0,
        ongoingMonthly: pricing.ongoingCosts?.monthlyFee || 0,
        totalProject: pricing.totalProjectCost?.recommended || 0,
        tier: pricing.pricingTier || 'Tier 1'
      },
      
      timeline: {
        totalDuration: `${Math.ceil(includedAreas.length * 2.5)} weeks`,
        milestones: [
          'Week 1: Project kickoff and detailed requirements gathering',
          'Week 2-3: Development of first automation solution',
          'Week 4-5: Testing, refinement, and team training',
          'Week 6-7: Implementation of remaining solutions',
          'Week 8: Final testing, documentation, and go-live'
        ]
      },
      
      clientResponsibilities: [
        'Provide timely feedback during development phases',
        'Participate in testing and validation sessions',
        'Ensure team availability for training sessions',
        'Provide access to necessary systems and data',
        'Designate a project liaison for ongoing communication',
        'Review and approve deliverables at each milestone'
      ],
      
      termsConditions: [
        'Payment terms: 50% deposit required to begin work, remaining balance due upon completion',
        'Intellectual property rights remain with THB Operations Hub',
        'Support included for 30 days post-delivery',
        'Additional features or changes subject to change order',
        'Project timeline may be adjusted based on client feedback cycles',
        'Confidentiality agreement covers all project information'
      ],
      
      nextSteps: [
        'Review and approve this Statement of Work',
        'Sign agreement and provide initial deposit',
        'Schedule project kickoff meeting',
        'Begin detailed requirements gathering',
        'Start development of first automation solution'
      ]
    };
  }
};

// Supabase Service
export const supabaseService = {
  async initialize() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase configuration not found');
      return null;
    }

    // Dynamic import of Supabase client
    try {
      const { createClient } = await import('@supabase/supabase-js');
      return createClient(supabaseUrl, supabaseKey);
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
      return null;
    }
  },

  async saveProject(projectData) {
    const supabase = await this.initialize();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving project:', error);
      return null;
    }
  },

  async getProjects() {
    const supabase = await this.initialize();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async saveActionItem(actionItem) {
    const supabase = await this.initialize();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('action_items')
        .insert([actionItem])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving action item:', error);
      return null;
    }
  },

  async getActionItems() {
    const supabase = await this.initialize();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching action items:', error);
      return [];
    }
  },

  async analyzeBusinessStrategy(strategyData) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key not found');
      return this.generateFallbackBusinessStrategy(strategyData);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Analyze this business strategy configuration and provide strategic insights:

Strategy Model:
- Revenue Target: $${strategyData.strategyModel.revenueTarget.toLocaleString()}
- Service Mix: ${JSON.stringify(strategyData.strategyModel.serviceTypes)}
- Client Mix: ${JSON.stringify(strategyData.strategyModel.clientMix)}
- Capacity: ${JSON.stringify(strategyData.strategyModel.capacity)}

Calculated Metrics:
- Total Revenue: $${strategyData.metrics.totalRevenue.toLocaleString()}
- Total Projects: ${strategyData.metrics.totalProjects}
- Weekly Hours Needed: ${strategyData.metrics.weeklyHoursNeeded.toFixed(0)}
- Clients Needed: ${strategyData.metrics.clientsNeeded}
- Prospects Needed: ${strategyData.metrics.prospectsNeeded}

Selected Path: ${strategyData.selectedPath.name}

Please provide a comprehensive analysis in JSON format with:
{
  "feasibilityScore": number (1-10),
  "feasibilityExplanation": "brief explanation of feasibility score",
  "timeCommitment": "analysis of time requirements vs capacity",
  "marketReality": "assessment of market conditions and prospect needs",
  "riskAssessment": "identification of key risks and mitigation strategies",
  "growthPotential": "evaluation of scalability and growth opportunities",
  "recommendations": ["specific actionable recommendations"]
}

Focus on realistic business constraints, market conditions, and actionable insights.`
          }],
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        return this.generateFallbackBusinessStrategy(strategyData);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackBusinessStrategy(strategyData);
    }
  },

  generateFallbackBusinessStrategy(strategyData) {
    const { metrics, strategyModel } = strategyData;
    
    // Calculate feasibility score based on capacity constraints
    let feasibilityScore = 7;
    let feasibilityExplanation = 'Strategy appears feasible with current capacity constraints.';
    
    if (metrics.weeklyHoursNeeded > strategyModel.capacity.weeklyHours) {
      feasibilityScore = 4;
      feasibilityExplanation = 'Strategy exceeds available capacity - consider reducing scope or increasing capacity.';
    } else if (metrics.totalProjects > strategyModel.capacity.maxConcurrentProjects) {
      feasibilityScore = 5;
      feasibilityExplanation = 'Strategy exceeds concurrent project limits - consider project sequencing.';
    }

    return {
      feasibilityScore,
      feasibilityExplanation,
      timeCommitment: `Estimated ${metrics.weeklyHoursNeeded.toFixed(0)} hours per week required for project delivery. ${metrics.weeklyHoursNeeded > strategyModel.capacity.weeklyHours ? 'Exceeds available capacity.' : 'Within available capacity.'}`,
      marketReality: `Need to maintain ${metrics.prospectsNeeded} active prospects in pipeline. Focus on ${strategyModel.clientMix.nonprofit}% nonprofits, ${strategyModel.clientMix.smallBusiness}% small businesses, ${strategyModel.clientMix.enterprise}% enterprise clients.`,
      riskAssessment: 'Moderate risk due to client concentration. Consider diversifying client base and developing recurring revenue streams.',
      growthPotential: 'Good scalability potential with platform approach. Focus on Tier 2/3 projects for better margins.',
      recommendations: [
        'Focus on Tier 2 projects for better profit margins',
        'Develop referral program to reduce prospecting needs',
        'Consider hiring contractor for overflow work',
        'Build recurring revenue through backend services',
        'Create standardized processes for Tier 1 projects'
      ]
    };
  }
};

// Supabase API Service for backend persistence
let supabaseClient = null

export const supabaseAPI = {
  async initialize() {
    // Return existing client if already initialized
    if (supabaseClient) {
      return supabaseClient
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not found')
      return null
    }

    try {
      const { createClient } = await import('@supabase/supabase-js')
      supabaseClient = createClient(supabaseUrl, supabaseKey)
      return supabaseClient
    } catch (error) {
      console.error('Error initializing Supabase:', error)
      return null
    }
  },

  async saveProjects(projects) {
    // Disabled for now - using localStorage only
    // const supabase = await this.initialize()
    // if (!supabase) return

    // try {
    //   const { error } = await supabase
    //     .from('projects')
    //     .upsert(projects.map(project => ({
    //       ...project,
    //       updated_at: new Date().toISOString()
    //     })), { onConflict: 'id' })

    //   if (error) {
    //     if (error.code === 'PGRST205') {
    //       console.warn('Projects table not found in Supabase. Please run the SQL setup script.')
    //       return
    //     }
    //     throw error
    //   }
    // } catch (error) {
    //   console.error('Error saving projects to Supabase:', error)
    // }
  },

  async saveProspects(prospects) {
    // Disabled for now - using localStorage only
    // const supabase = await this.initialize()
    // if (!supabase) return

    // try {
    //   const { error } = await supabase
    //     .from('prospects')
    //     .upsert(prospects.map(prospect => ({
    //       ...prospect,
    //       updated_at: new Date().toISOString()
    //     })), { onConflict: 'id' })

    //   if (error) {
    //     if (error.code === 'PGRST205') {
    //       console.warn('Prospects table not found in Supabase. Please run the SQL setup script.')
    //       return
    //     }
    //     throw error
    //   }
    // } catch (error) {
    //   console.error('Error saving prospects to Supabase:', error)
    // }
  },

  async saveStrategyGoals(strategyGoals) {
    // Disabled for now - using localStorage only
    // const supabase = await this.initialize()
    // if (!supabase) return

    // try {
    //   const { error } = await supabase
    //     .from('strategy_goals')
    //     .upsert({
    //       id: 1, // Single strategy goals record
    //       ...strategyGoals,
    //       updated_at: new Date().toISOString()
    //     }, { onConflict: 'id' })

    //   if (error) {
    //     if (error.code === 'PGRST205') {
    //       console.warn('Strategy goals table not found in Supabase. Please run the SQL setup script.')
    //       return
    //     }
    //     throw error
    //   }
    // } catch (error) {
    //   console.error('Error saving strategy goals to Supabase:', error)
    // }
  },

  async loadProjects() {
    // Disabled for now - using localStorage only
    // const supabase = await this.initialize()
    // if (!supabase) return []

    // try {
    //   const { data, error } = await supabase
    //     .from('projects')
    //     .select('*')
    //     .order('created_at', { ascending: false })

    //   if (error) {
    //     if (error.code === 'PGRST205') {
    //       console.warn('Projects table not found in Supabase. Please run the SQL setup script.')
    //       return []
    //     }
    //     throw error
    //   }
    //   return data || []
    // } catch (error) {
    //   console.error('Error loading projects from Supabase:', error)
    //   return []
    // }
    return []
  },

  async loadProspects() {
    // Disabled for now - using localStorage only
    // const supabase = await this.initialize()
    // if (!supabase) return []

    // try {
    //   const { data, error } = await supabase
    //     .from('prospects')
    //     .select('*')
    //     .order('created_at', { ascending: false })

    //   if (error) {
    //     if (error.code === 'PGRST205') {
    //       console.warn('Prospects table not found in Supabase. Please run the SQL setup script.')
    //       return []
    //     }
    //     throw error
    //   }
    //   return data || []
    // } catch (error) {
    //   console.error('Error loading prospects from Supabase:', error)
    //   return []
    // }
    return []
  },

  async loadStrategyGoals() {
    // Disabled for now - using localStorage only
    // const supabase = await this.initialize()
    // if (!supabase) return null

    // try {
    //   const { data, error } = await supabase
    //     .from('strategy_goals')
    //     .select('*')
    //     .eq('id', 1)
    //     .single()

    //   if (error) {
    //     if (error.code === 'PGRST205') {
    //       console.warn('Strategy goals table not found in Supabase. Please run the SQL setup script.')
    //       return null
    //     }
    //     throw error
    //   }
    //   return data
    // } catch (error) {
    //   console.error('Error loading strategy goals from Supabase:', error)
    //   return null
    // }
    return null
  }
};
