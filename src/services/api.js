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
  }
};
