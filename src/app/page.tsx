export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              🚀 Plataforma SaaS de Atendimento Inteligente
            </div>
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
              <a href="/auth/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg transition-colors font-semibold text-center">
                Começar Gratuitamente →
              </a>
              <a href="#demo" className="border border-gray-300 hover:bg-gray-50 px-8 py-4 text-lg rounded-lg transition-colors text-center">
                Ver Demonstração
              </a>
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
                icon: "💬",
                title: "Atendimento 24/7",
                description: "Seu agente IA nunca dorme. Responde automaticamente a qualquer horário."
              },
              {
                icon: "⚡",
                title: "Integração com N8N",
                description: "Workflows personalizados e automações avançadas para cada negócio."
              },
              {
                icon: "👥",
                title: "Multi-usuário",
                description: "Equipe completa pode gerenciar o atendimento pelo painel."
              },
              {
                icon: "📊",
                title: "Relatórios Detalhados",
                description: "Métricas completas de atendimento e performance do seu bot."
              },
              {
                icon: "🛡️",
                title: "Segurança Total",
                description: "Dados protegidos com criptografia e conformidade LGPD."
              },
              {
                icon: "✅",
                title: "Configuração Simples",
                description: "Configure seu atendimento em minutos, não em dias."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
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
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="text-4xl mb-4">{business.emoji}</div>
                <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
              </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
              <div key={index} className={`bg-white p-8 rounded-xl shadow-lg relative transform hover:scale-105 transition-all duration-300 ${plan.popular ? 'border-2 border-blue-500 ring-4 ring-blue-100' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="text-green-500 mr-3 text-lg">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Veja Como Funciona
            </h2>
            <p className="text-xl text-gray-600">
              Demonstração do atendimento automático em ação
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Chat Demo - Pizzaria do João
                </h3>
                <div className="bg-gray-100 rounded-lg p-4 h-80 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                        <p className="text-sm">👋 Olá! Bem-vindo à Pizzaria do João! Como posso ajudá-lo hoje?</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm">Oi! Queria fazer um pedido</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                        <p className="text-sm">🍕 Perfeito! Temos pizzas, lanches e bebidas. Nosso cardápio está disponível em pizzariadojoao.com/cardapio. Qual pizza você gostaria?</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm">Pizza margherita grande</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                        <p className="text-sm">✅ Ótima escolha! Pizza Margherita Grande - R$ 35,00. Precisa de mais alguma coisa? Bebidas ou sobremesa?</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Agente IA ativo - Respondendo automaticamente
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🤖 IA Inteligente</h4>
                  <p className="text-blue-800">Entende contexto e responde de forma natural, como um atendente humano.</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">📋 Informações Precisas</h4>
                  <p className="text-green-800">Acesso ao cardápio, preços e informações da empresa em tempo real.</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">🔄 Disponível 24/7</h4>
                  <p className="text-purple-800">Atende clientes a qualquer hora, inclusive fora do horário comercial.</p>
                </div>
              </div>
            </div>
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
          <a href="/auth/sign-up" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg font-semibold transition-colors inline-block">
            Começar Gratuitamente Agora →
          </a>
          <p className="text-blue-200 mt-4">✅ 7 dias grátis • ✅ Sem cartão de crédito • ✅ Suporte incluído</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">WhatsAI Manager</h3>
              <p className="text-gray-400 mb-4">
                Automatize seu atendimento no WhatsApp com inteligência artificial.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">📧</a>
                <a href="#" className="text-gray-400 hover:text-white">💬</a>
                <a href="#" className="text-gray-400 hover:text-white">📱</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Parceiros</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2024 WhatsAI Manager. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Termos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">LGPD</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}