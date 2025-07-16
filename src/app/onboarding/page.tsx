'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

const businessTypes = [
  { value: 'RESTAURANT', label: 'Restaurante/Pizzaria', emoji: '🍕' },
  { value: 'MEDICAL', label: 'Consultório Médico', emoji: '⚕️' },
  { value: 'BEAUTY', label: 'Salão de Beleza', emoji: '💅' },
  { value: 'LEGAL', label: 'Escritório de Advocacia', emoji: '⚖️' },
  { value: 'RETAIL', label: 'Loja de Varejo', emoji: '🛍️' },
  { value: 'OTHER', label: 'Outros', emoji: '🏢' }
]

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    phoneNumber: '',
    subdomain: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBusinessTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, businessType: type }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.businessType) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(`Erro ${response.status}: ${errorData.details || errorData.error || 'Erro desconhecido'}`)
      }

      const company = await response.json()
      console.log('Company created:', company)
      
      alert('Empresa criada com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating company:', error)
      alert(`Erro ao criar empresa: ${(error as any)?.message || "Erro desconhecido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && !formData.name) {
      alert('Informe o nome da sua empresa')
      return
    }
    if (step === 2 && !formData.businessType) {
      alert('Escolha o tipo do seu negócio')
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao WhatsAI Manager!
          </h1>
          <p className="text-gray-600">
            Vamos configurar sua empresa em poucos passos
          </p>
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  num <= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {num < step ? '✓' : num}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {step === 1 && 'Informações da Empresa'}
              {step === 2 && 'Tipo de Negócio'}
              {step === 3 && 'Configurações Finais'}
            </h2>
            <p className="text-gray-600">
              {step === 1 && 'Vamos começar com as informações básicas da sua empresa'}
              {step === 2 && 'Escolha o tipo do seu negócio para personalizar o atendimento'}
              {step === 3 && 'Últimas configurações para finalizar o setup'}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pizzaria do João"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subdomínio (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: pizzaria-joao"
                  value={formData.subdomain}
                  onChange={(e) => handleInputChange('subdomain', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Será usado para criar seu link personalizado
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Negócio *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {businessTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                        formData.businessType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleBusinessTypeSelect(type.value)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{type.emoji}</div>
                        <div className="text-sm font-medium">{type.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do WhatsApp (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: (11) 99999-9999"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Poderá ser configurado depois no painel
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  🎉 Sua empresa está quase pronta!
                </h3>
                <p className="text-green-700 text-sm">
                  Após criar sua empresa, você terá 7 dias gratuitos para testar todas as funcionalidades.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-4 py-2 rounded-md ${
                step === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Voltar
            </button>
            
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Próximo →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Criando...' : 'Criar Empresa'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}