interface N8nWorkflow {
  id: string
  name: string
  active: boolean
  nodes: any[]
  connections: any
  settings?: {
    variables?: Record<string, any>
  }
}

interface N8nCredential {
  id: string
  name: string
  type: string
  data: Record<string, any>
}

class N8nClient {
  private baseUrl: string
  private apiKey: string
  private username: string
  private password: string

  constructor() {
    this.baseUrl = process.env.N8N_API_BASE_URL || 'https://n8n.8k.net.br'
    this.apiKey = process.env.N8N_API_KEY || ''
    this.username = process.env.N8N_USERNAME || ''
    this.password = process.env.N8N_PASSWORD || ''
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const baseHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
    
    if (this.apiKey) {
      return {
        ...baseHeaders,
        'X-N8N-API-KEY': this.apiKey,
      }
    }
    
    // Try basic auth as fallback
    if (this.username && this.password) {
      const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64')
      return {
        ...baseHeaders,
        'Authorization': `Basic ${auth}`,
      }
    }
    
    throw new Error('No authentication method available. Please set N8N_API_KEY or N8N_USERNAME/N8N_PASSWORD')
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api/v1${endpoint}`
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`N8N API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async getWorkflows(): Promise<N8nWorkflow[]> {
    try {
      const response = await this.request('/workflows')
      console.log('🔍 N8N workflows response:', response)
      
      // Handle different response formats
      if (Array.isArray(response)) {
        return response
      }
      
      if (response.data && Array.isArray(response.data)) {
        return response.data
      }
      
      if (response.workflows && Array.isArray(response.workflows)) {
        return response.workflows
      }
      
      console.warn('Unexpected workflows response format:', response)
      return []
    } catch (error) {
      console.error('Error in getWorkflows:', error)
      throw error
    }
  }

  async getWorkflow(id: string): Promise<N8nWorkflow> {
    return this.request(`/workflows/${id}`)
  }

  async createWorkflow(workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    // Only send required fields for workflow creation (active is read-only)
    const workflowData: any = {
      name: workflow.name,
      nodes: workflow.nodes || [],
      connections: workflow.connections || {}
    }
    
    // Clean settings to only include allowed properties
    if (workflow.settings) {
      const cleanSettings: any = {}
      if (workflow.settings.variables) {
        cleanSettings.variables = workflow.settings.variables
      }
      if (Object.keys(cleanSettings).length > 0) {
        workflowData.settings = cleanSettings
      }
    }
    
    // Only add tags if they exist and are valid
    if ((workflow as any).tags && Array.isArray((workflow as any).tags)) {
      workflowData.tags = (workflow as any).tags
    }
    
    // Only add staticData if it exists
    if ((workflow as any).staticData) {
      workflowData.staticData = (workflow as any).staticData
    }
    
    console.log('📤 Sending workflow data to N8N:', {
      name: workflowData.name,
      nodesCount: workflowData.nodes.length,
      hasSettings: !!workflowData.settings
    })
    
    return this.request('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflowData),
    })
  }

  async updateWorkflow(id: string, workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    return this.request(`/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workflow),
    })
  }

  async deleteWorkflow(id: string): Promise<void> {
    return this.request(`/workflows/${id}`, {
      method: 'DELETE',
    })
  }

  async activateWorkflow(id: string): Promise<void> {
    return this.request(`/workflows/${id}/activate`, {
      method: 'POST',
    })
  }

  async deactivateWorkflow(id: string): Promise<void> {
    return this.request(`/workflows/${id}/deactivate`, {
      method: 'POST',
    })
  }

  async executeWorkflow(id: string, data?: any): Promise<any> {
    return this.request(`/workflows/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify({ data }),
    })
  }

  async getCredentials(): Promise<N8nCredential[]> {
    return this.request('/credentials')
  }

  async createCredential(credential: Partial<N8nCredential>): Promise<N8nCredential> {
    return this.request('/credentials', {
      method: 'POST',
      body: JSON.stringify(credential),
    })
  }

  async updateCredential(id: string, credential: Partial<N8nCredential>): Promise<N8nCredential> {
    return this.request(`/credentials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(credential),
    })
  }

  async deleteCredential(id: string): Promise<void> {
    return this.request(`/credentials/${id}`, {
      method: 'DELETE',
    })
  }

  // Métodos específicos para o WhatsAI Manager
  async findWorkflowByName(workflowName: string): Promise<N8nWorkflow | null> {
    try {
      const workflows = await this.getWorkflows()
      console.log('🔍 Searching for workflow:', workflowName)
      console.log('📋 Available workflows:', workflows.map(w => w.name))
      
      // Normalize search term (remove accents, convert to lowercase)
      const normalizedSearch = this.normalizeString(workflowName)
      console.log('🔍 Normalized search:', normalizedSearch)
      
      const found = workflows.find(w => {
        const normalizedName = this.normalizeString(w.name)
        console.log(`🔍 Comparing "${normalizedName}" with "${normalizedSearch}"`)
        return normalizedName.includes(normalizedSearch) || normalizedSearch.includes(normalizedName)
      })
      
      console.log('🎯 Found workflow:', found ? found.name : 'null')
      return found || null
    } catch (error) {
      console.error('Error finding workflow by name:', error)
      return null
    }
  }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]/g, '') // Remove special characters
  }

  async cloneWorkflowTemplate(templateId: string, companyData: {
    name: string
    businessType: string
    phoneNumber: string
    greeting: string
    businessHours: string
  }): Promise<N8nWorkflow> {
    console.log('🔄 Getting template workflow:', templateId)
    const template = await this.getWorkflow(templateId)
    console.log('📋 Template workflow:', template.name)
    
    // Clean the template data - remove server-generated fields
    const cleanWorkflow = {
      name: `Atendimento - ${companyData.name}`,
      nodes: template.nodes || [],
      connections: template.connections || {},
      settings: {
        variables: {
          ...template.settings?.variables,
          empresa: companyData.name,
          whatsapp: companyData.phoneNumber,
          horario: companyData.businessHours,
          saudacao: companyData.greeting,
          tipo_negocio: companyData.businessType,
        }
      }
    }
    
    // Only add tags if they exist and are valid
    if ((template as any).tags && Array.isArray((template as any).tags)) {
      (cleanWorkflow as any).tags = (template as any).tags
    }
    
    // Only add staticData if it exists
    if ((template as any).staticData) {
      (cleanWorkflow as any).staticData = (template as any).staticData
    }

    console.log('🔧 Creating new workflow with data:', {
      name: cleanWorkflow.name,
      nodesCount: cleanWorkflow.nodes.length,
      hasConnections: !!cleanWorkflow.connections,
      variables: cleanWorkflow.settings.variables
    })

    return this.createWorkflow(cleanWorkflow)
  }

  async cloneWorkflowByName(templateName: string, companyData: {
    name: string
    businessType: string
    phoneNumber: string
    greeting: string
    businessHours: string
  }): Promise<N8nWorkflow> {
    const template = await this.findWorkflowByName(templateName)
    
    if (!template) {
      throw new Error(`Template workflow '${templateName}' not found`)
    }
    
    return this.cloneWorkflowTemplate(template.id, companyData)
  }

  async updateWorkflowVariables(id: string, variables: Record<string, any>): Promise<N8nWorkflow> {
    const workflow = await this.getWorkflow(id)
    
    const updatedWorkflow = {
      ...workflow,
      settings: {
        ...workflow.settings,
        variables: {
          ...workflow.settings?.variables,
          ...variables
        }
      }
    }

    return this.updateWorkflow(id, updatedWorkflow)
  }

  async createWebhook(workflowId: string, webhookName: string): Promise<string> {
    const webhook = await this.request('/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        workflowId,
        webhookName,
        method: 'POST',
        path: `/${workflowId}/${webhookName}`,
      }),
    })

    return webhook.url
  }

  async testWebhook(webhookUrl: string, data: any): Promise<any> {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return response.json()
  }
}

export const n8nClient = new N8nClient()

// Mapeamento de categorias de negócio para nomes de workflow
export const workflowMapping = {
  RESTAURANT: 'pizzaria',
  MEDICAL: 'consultorio',
  BEAUTY: 'salao de beleza',
  LEGAL: 'escritorio advocacia',
  RETAIL: 'loja varejo',
  OTHER: 'generico'
}

// Templates de workflow para diferentes tipos de negócio
export const workflowTemplates = {
  RESTAURANT: {
    name: 'Pizzaria',
    description: 'Template para restaurantes, pizzarias e hamburguerias',
    variables: {
      cardapio_link: 'https://example.com/cardapio',
      horario_funcionamento: '18:00 às 23:00',
      delivery_disponivel: true,
      taxa_entrega: 'R$ 5,00',
      tempo_entrega: '30-45 minutos'
    }
  },
  MEDICAL: {
    name: 'Clinica Medica',
    description: 'Template para consultórios médicos e clínicas',
    variables: {
      especialidade: 'Clínica Geral',
      horario_funcionamento: '08:00 às 18:00',
      agendamento_online: true,
      planos_aceitos: ['Unimed', 'Bradesco Saúde'],
      telefone_emergencia: '(11) 99999-9999'
    }
  },
  BEAUTY: {
    name: 'Salao de Beleza',
    description: 'Template para salões de beleza, cabeleireiros e estética',
    variables: {
      servicos: ['Corte', 'Escova', 'Coloração', 'Manicure'],
      horario_funcionamento: '09:00 às 19:00',
      agendamento_online: true,
      promocoes: 'Desconto de 10% para novos clientes'
    }
  },
  LEGAL: {
    name: 'Escritorio Advocacia',
    description: 'Template para escritórios de advocacia',
    variables: {
      areas_atuacao: ['Direito Civil', 'Trabalhista', 'Penal'],
      horario_funcionamento: '08:00 às 18:00',
      consulta_gratuita: true,
      oab_numero: 'OAB/SP 123456'
    }
  },
  RETAIL: {
    name: 'Loja Varejo',
    description: 'Template para lojas de varejo e e-commerce',
    variables: {
      categoria_produtos: 'Roupas e Acessórios',
      horario_funcionamento: '09:00 às 21:00',
      entrega_disponivel: true,
      formas_pagamento: ['Dinheiro', 'Cartão', 'PIX'],
      trocas_devolucoes: '30 dias para trocas'
    }
  },
  OTHER: {
    name: 'Generico',
    description: 'Template genérico para outros tipos de negócio',
    variables: {
      horario_funcionamento: '08:00 às 18:00',
      servicos_principais: 'Consulte nossos serviços',
      contato_adicional: 'Entre em contato para mais informações'
    }
  }
}

export async function createCompanyWorkflow(companyData: {
  name: string
  businessType: keyof typeof workflowTemplates
  phoneNumber: string
  greeting: string
  businessHours: string
}) {
  try {
    console.log('🔍 Setting up workflow connection for:', companyData)
    
    // Get the workflow name based on business type
    const templateName = workflowMapping[companyData.businessType] || workflowMapping.OTHER
    console.log('📋 Looking for existing workflow:', templateName)
    
    // Find existing shared workflow
    const existingWorkflow = await n8nClient.findWorkflowByName(templateName)
    
    if (!existingWorkflow) {
      throw new Error(`Workflow template '${templateName}' not found. Please create it first in N8N.`)
    }
    
    console.log('✅ Found existing workflow:', existingWorkflow.id, existingWorkflow.name)
    
    // Ensure workflow is active
    if (!existingWorkflow.active) {
      await n8nClient.activateWorkflow(existingWorkflow.id)
      console.log('✅ Workflow activated')
    }
    
    // Extract webhook URL from workflow
    const webhookUrl = extractWebhookUrl(existingWorkflow.nodes)
    
    return {
      workflowId: existingWorkflow.id,
      isActive: true,
      webhookUrl: webhookUrl,
      isShared: true // Flag indicating this is a shared workflow
    }
  } catch (error) {
    console.error('❌ Erro ao configurar workflow:', error)
    console.error('❌ Error details:', {
      message: (error as any)?.message,
      stack: (error as any)?.stack,
      name: (error as any)?.name
    })
    throw error
  }
}

function extractWebhookUrl(nodes: any[]): string | undefined {
  try {
    const webhookNode = nodes?.find(node => 
      node.type === 'n8n-nodes-base.webhook' || 
      node.type?.includes('webhook')
    )
    
    if (webhookNode) {
      // Try different possible webhook URL properties
      return webhookNode.webhookUrl || 
             webhookNode.parameters?.path || 
             webhookNode.parameters?.webhookUrl
    }
    
    return undefined
  } catch (error) {
    console.error('Error extracting webhook URL:', error)
    return undefined
  }
}

export async function updateCompanyWorkflow(workflowId: string, variables: Record<string, any>) {
  try {
    const workflow = await n8nClient.updateWorkflowVariables(workflowId, variables)
    return workflow
  } catch (error) {
    console.error('Erro ao atualizar workflow:', error)
    throw error
  }
}