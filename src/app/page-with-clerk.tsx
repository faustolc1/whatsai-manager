import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, MessageSquare, Zap, Users, BarChart3, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🚀 Plataforma SaaS de Atendimento Inteligente
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              WhatsAI Manager
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Automatize seu atendimento no WhatsApp com <span className="text-blue-600 font-semibold">Inteligência Artificial</span>
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Crie agentes IA personalizados para sua empresa. Integração com N8N para workflows avançados. 
              7 dias grátis para começar!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                  Ver Demonstração
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recursos Completos para Seu Atendimento
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para automatizar e profissionalizar seu atendimento
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
                title: "Atendimento 24/7",
                description: "Seu agente IA nunca dorme. Responde automaticamente a qualquer horário."
              },
              {
                icon: <Zap className="h-8 w-8 text-yellow-600" />,
                title: "Integração com N8N",
                description: "Workflows personalizados e automações avançadas para cada negócio."
              },
              {
                icon: <Users className="h-8 w-8 text-green-600" />,
                title: "Multi-usuário",
                description: "Equipe completa pode gerenciar o atendimento pelo painel."
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
                title: "Relatórios Detalhados",
                description: "Métricas completas de atendimento e performance do seu bot."
              },
              {
                icon: <Shield className="h-8 w-8 text-red-600" />,
                title: "Segurança Total",
                description: "Dados protegidos com criptografia e conformidade LGPD."
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-indigo-600" />,
                title: "Configuração Simples",
                description: "Configure seu atendimento em minutos, não em dias."
              }
            ].map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Especializado Para Seu Negócio
            </h2>
            <p className="text-xl text-gray-600">
              Agentes IA treinados especificamente para cada tipo de empresa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Restaurantes & Pizzarias", emoji: "🍕" },
              { name: "Consultórios Médicos", emoji: "⚕️" },
              { name: "Salões de Beleza", emoji: "💅" },
              { name: "Escritórios de Advocacia", emoji: "⚖️" },
              { name: "Lojas de Varejo", emoji: "🛍️" },
              { name: "Outros Negócios", emoji: "🏢" }
            ].map((business, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">{business.emoji}</div>
                  <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Preços Simples e Transparentes
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis e escale conforme seu negócio cresce
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Gratuito",
                price: "R$ 0",
                period: "7 dias",
                features: [
                  "Teste completo da plataforma",
                  "Até 100 mensagens",
                  "1 agente IA",
                  "Suporte por email"
                ],
                cta: "Começar Grátis",
                popular: false
              },
              {
                name: "Profissional",
                price: "R$ 97",
                period: "por mês",
                features: [
                  "Mensagens ilimitadas",
                  "Até 3 agentes IA",
                  "Integração N8N completa",
                  "Relatórios avançados",
                  "Suporte prioritário"
                ],
                cta: "Escolher Plano",
                popular: true
              },
              {
                name: "Empresarial",
                price: "R$ 297",
                period: "por mês",
                features: [
                  "Tudo do Profissional",
                  "Agentes IA ilimitados",
                  "Multi-usuário",
                  "API personalizada",
                  "Suporte 24/7",
                  "Integração CRM"
                ],
                cta: "Falar com Vendas",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''} card-hover`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para Revolucionar seu Atendimento?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a centenas de empresas que já automatizaram seu WhatsApp
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Começar Gratuitamente Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}