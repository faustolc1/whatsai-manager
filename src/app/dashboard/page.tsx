'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface Company {
  id: string
  name: string
  businessType: string
  phoneNumber?: string
  subdomain: string
  greeting?: string
  businessHours?: string
  subscription?: {
    status: string
    trialEnd?: string
    currentPeriodEnd?: string
    plan?: {
      name: string
      price: number
    }
  }
  n8nWorkflow?: {
    isActive: boolean
    webhookUrl?: string
  }
  whatsappConfig?: {
    isConnected: boolean
    phoneNumber?: string
  }
}

export default function DashboardPage() {
  const { user } = useUser()
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCompanies()
    }
  }, [user])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TRIALING':
        return 'bg-blue-100 text-blue-800'
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'PAST_DUE':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'TRIALING':
        return 'Período de Teste'
      case 'ACTIVE':
        return 'Ativo'
      case 'PAST_DUE':
        return 'Pagamento Pendente'
      case 'CANCELED':
        return 'Cancelado'
      default:
        return status
    }
  }

  const calculateTrialDaysRemaining = (trialEnd: string) => {
    const now = new Date()
    const end = new Date(trialEnd)
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const deleteCompany = async (companyId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.')) {
      return
    }

    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Empresa excluída com sucesso!')
        // Refresh companies list
        fetchCompanies()
      } else {
        const error = await response.json()
        alert(`Erro ao excluir empresa: ${error.details || error.error}`)
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      alert('Erro ao excluir empresa')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (isLoading) {
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
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">WhatsAI Manager</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Olá, {user.firstName || user.emailAddresses[0].emailAddress}</span>
                <UserButton />
              </div>
            </div>
          </div>
        </nav>

        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma empresa encontrada
            </h2>
            <p className="text-gray-600 mb-4">
              Crie sua primeira empresa para começar a usar o WhatsAI Manager
            </p>
            <button 
              onClick={() => router.push('/onboarding')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Criar Empresa
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">WhatsAI Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {user.firstName || user.emailAddresses[0].emailAddress}</span>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Company Selector */}
          {companies.length > 1 && (
            <div className="mb-6">
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
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status da Conta</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedCompany.subscription?.status || 'INACTIVE')}`}>
                          {getStatusText(selectedCompany.subscription?.status || 'INACTIVE')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedCompany.subscription?.status === 'TRIALING' && selectedCompany.subscription.trialEnd
                          ? `${calculateTrialDaysRemaining(selectedCompany.subscription.trialEnd)} dias`
                          : selectedCompany.subscription?.status === 'ACTIVE' 
                            ? 'Ativo'
                            : 'Configurar'
                        }
                      </div>
                      <p className="text-sm text-gray-500">
                        {selectedCompany.subscription?.status === 'TRIALING' 
                          ? 'restantes no teste'
                          : selectedCompany.subscription?.status === 'ACTIVE'
                            ? 'Renovação automática'
                            : 'Selecione um plano'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">WhatsApp</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${selectedCompany.whatsappConfig?.isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-sm text-gray-900">
                          {selectedCompany.whatsappConfig?.isConnected ? 'Conectado' : 'Desconectado'}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl">📱</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Agente IA</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${selectedCompany.n8nWorkflow?.isActive ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-sm text-gray-900">
                          {selectedCompany.n8nWorkflow?.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    <div className="text-2xl">🤖</div>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Negócio</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany.businessType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subdomínio</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany.subdomain}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCompany.phoneNumber || 'Não informado'}</p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                      Editar Informações
                    </button>
                    <button 
                      onClick={() => deleteCompany(selectedCompany.id)}
                      disabled={isDeleting}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {isDeleting ? 'Excluindo...' : 'Excluir Empresa'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Próximos Passos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <div className="text-2xl mr-3">📱</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Conectar WhatsApp</div>
                      <div className="text-sm text-gray-500">Configure seu número</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => router.push('/dashboard/agent')}
                    className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    <div className="text-2xl mr-3">🤖</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Configurar Agente IA</div>
                      <div className="text-sm text-gray-500">Personalize as respostas</div>
                    </div>
                  </button>
                  
                  <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <div className="text-2xl mr-3">⚙️</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Configurações</div>
                      <div className="text-sm text-gray-500">Ajustes da empresa</div>
                    </div>
                  </button>
                  
                  <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <div className="text-2xl mr-3">💳</div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Planos e Pagamento</div>
                      <div className="text-sm text-gray-500">Gerencie sua assinatura</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}