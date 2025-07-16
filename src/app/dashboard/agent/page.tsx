'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface Company {
  id: string
  name: string
  businessType: string
  greeting?: string
  businessHours?: string
  n8nWorkflow?: {
    isActive: boolean
    webhookUrl?: string
  }
}

export default function AgentConfigPage() {
  const { user } = useUser()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Configurações do agente
  const [greeting, setGreeting] = useState('')
  const [businessHours, setBusinessHours] = useState({
    segunda: '09:00-18:00',
    terca: '09:00-18:00',
    quarta: '09:00-18:00',
    quinta: '09:00-18:00',
    sexta: '09:00-18:00',
    sabado: '09:00-14:00',
    domingo: 'fechado'
  })
  const [autoResponse, setAutoResponse] = useState(true)
  const [responseDelay, setResponseDelay] = useState(2)

  useEffect(() => {
    if (user) {
      fetchCompanies()
    }
  }, [user])

  useEffect(() => {
    if (selectedCompany) {
      loadCompanyConfig()
    }
  }, [selectedCompany])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
        if (data.length > 0) {
          setSelectedCompany(data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCompanyConfig = () => {
    if (!selectedCompany) return
    
    setGreeting(selectedCompany.greeting || 'Olá! Como posso ajudá-lo(a)?')
    
    if (selectedCompany.businessHours) {
      try {
        const hours = JSON.parse(selectedCompany.businessHours)
        setBusinessHours(hours)
      } catch (e) {
        console.warn('Failed to parse business hours')
      }
    }
  }

  const saveConfig = async () => {
    if (!selectedCompany) return
    
    setIsSaving(true)
    
    try {
      const response = await fetch(`/api/companies/${selectedCompany.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          greeting,
          businessHours: JSON.stringify(businessHours)
        })
      })
      
      if (response.ok) {
        alert('Configurações salvas com sucesso!')
        fetchCompanies() // Refresh data
      } else {
        alert('Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const testWebhook = async () => {
    if (!selectedCompany?.n8nWorkflow?.webhookUrl) {
      alert('URL do webhook não encontrada')
      return
    }

    try {
      const response = await fetch(selectedCompany.n8nWorkflow.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: '5511999999999',
          message: 'Teste do agente IA',
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        alert('Teste enviado com sucesso!')
      } else {
        alert('Erro no teste do webhook')
      }
    } catch (error) {
      console.error('Webhook test error:', error)
      alert('Erro ao testar webhook')
    }
  }

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma empresa encontrada
          </h2>
          <p className="text-gray-600 mb-4">
            Crie uma empresa primeiro para configurar o agente IA
          </p>
          <button 
            onClick={() => router.push('/onboarding')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Criar Empresa
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Voltar
              </button>
              <h1 className="text-xl font-bold text-gray-900">Configurar Agente IA</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {user.firstName || user.emailAddresses[0].emailAddress}</span>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Company Selector */}
          {companies.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <select
                value={selectedCompany?.id || ''}
                onChange={(e) => {
                  const company = companies.find(c => c.id === e.target.value)
                  setSelectedCompany(company || null)
                }}
                className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedCompany && (
            <div className="space-y-6">
              {/* Status do Agente */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status do Agente</h3>
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${selectedCompany.n8nWorkflow?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-900">
                    {selectedCompany.n8nWorkflow?.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                  {selectedCompany.n8nWorkflow?.webhookUrl && (
                    <button
                      onClick={testWebhook}
                      className="ml-auto bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Testar Webhook
                    </button>
                  )}
                </div>
              </div>

              {/* Configurações Básicas */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações Básicas</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem de Saudação
                    </label>
                    <textarea
                      value={greeting}
                      onChange={(e) => setGreeting(e.target.value)}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Ex: Olá! Bem-vindo(a) à nossa empresa. Como posso ajudá-lo(a)?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={autoResponse}
                          onChange={(e) => setAutoResponse(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Resposta Automática</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delay de Resposta (segundos)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={responseDelay}
                        onChange={(e) => setResponseDelay(parseInt(e.target.value))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Horário de Funcionamento */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Horário de Funcionamento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(businessHours).map(([day, hours]) => (
                    <div key={day}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {day}
                      </label>
                      <input
                        type="text"
                        value={hours}
                        onChange={(e) => setBusinessHours(prev => ({
                          ...prev,
                          [day]: e.target.value
                        }))}
                        placeholder="09:00-18:00 ou 'fechado'"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão Salvar */}
              <div className="flex justify-end">
                <button
                  onClick={saveConfig}
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}