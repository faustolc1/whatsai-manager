import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criar planos padrão
  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      description: 'Período de teste de 7 dias',
      price: 0,
      interval: 'MONTHLY' as const,
      features: [
        'Teste completo da plataforma',
        'Até 100 mensagens',
        '1 agente IA',
        'Suporte por email'
      ],
      maxContacts: 100,
      maxMessages: 100,
      isActive: true,
      isPopular: false
    },
    {
      id: 'pro',
      name: 'Profissional',
      description: 'Para pequenas e médias empresas',
      price: 97,
      interval: 'MONTHLY' as const,
      features: [
        'Mensagens ilimitadas',
        'Até 3 agentes IA',
        'Integração N8N completa',
        'Relatórios avançados',
        'Suporte prioritário'
      ],
      maxContacts: 1000,
      maxMessages: 10000,
      isActive: true,
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      description: 'Para grandes empresas',
      price: 297,
      interval: 'MONTHLY' as const,
      features: [
        'Tudo do Profissional',
        'Agentes IA ilimitados',
        'Multi-usuário',
        'API personalizada',
        'Suporte 24/7',
        'Integração CRM'
      ],
      maxContacts: 10000,
      maxMessages: 100000,
      isActive: true,
      isPopular: false
    }
  ]

  console.log('Criando planos...')
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    })
  }

  console.log('Seed executado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })