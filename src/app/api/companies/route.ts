import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { createCompanyWorkflow } from '@/lib/n8n'

const prisma = new PrismaClient()

// Add headers for debugging
export const runtime = 'nodejs'

function generateSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const companies = await prisma.company.findMany({
      where: {
        owner: {
          clerkId: userId
        }
      },
      include: {
        subscription: {
          include: {
            plan: true
          }
        },
        n8nWorkflow: true,
        whatsappConfig: true
      }
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error('Get companies error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/companies - Starting...')
    
    const { userId } = auth()
    console.log('👤 User ID:', userId)
    
    if (!userId) {
      console.log('❌ No user ID found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('📝 Request body:', body)
    
    const { name, businessType, phoneNumber, subdomain } = body

    if (!name || !businessType) {
      console.log('❌ Missing required fields')
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verificar se o usuário já existe no banco
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      // Buscar dados do usuário no Clerk
      const { clerkClient } = await import('@clerk/nextjs/server')
      const clerkUser = await clerkClient.users.getUser(userId)
      
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser.firstName || clerkUser.username || 'Usuário',
          imageUrl: clerkUser.imageUrl
        }
      })
    }

    // Gerar slug único
    const baseSlug = generateSlug(subdomain || name)
    let slug = baseSlug
    let counter = 1
    
    while (await prisma.company.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Gerar subdomain único
    let uniqueSubdomain = subdomain || generateSlug(name)
    counter = 1
    
    while (await prisma.company.findUnique({ where: { subdomain: uniqueSubdomain } })) {
      uniqueSubdomain = `${subdomain || generateSlug(name)}-${counter}`
      counter++
    }

    // Criar empresa
    const company = await prisma.company.create({
      data: {
        name,
        businessType,
        phoneNumber,
        subdomain: uniqueSubdomain,
        slug,
        ownerId: dbUser.id,
        greeting: `Olá! Bem-vindo(a) à ${name}. Como posso ajudá-lo(a)?`,
        businessHours: '{"segunda": "09:00-18:00", "terca": "09:00-18:00", "quarta": "09:00-18:00", "quinta": "09:00-18:00", "sexta": "09:00-18:00", "sabado": "09:00-14:00", "domingo": "fechado"}'
      }
    })

    // Criar subscription com trial de 7 dias
    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 7)

    // Buscar ou criar plano gratuito
    let freePlan = await prisma.plan.findFirst({
      where: { name: 'Gratuito' }
    })

    if (!freePlan) {
      freePlan = await prisma.plan.create({
        data: {
          name: 'Gratuito',
          description: 'Período de teste gratuito',
          price: 0,
          interval: 'MONTHLY',
          features: ['Teste por 7 dias', 'Suporte básico', 'Até 100 mensagens'],
          maxContacts: 100,
          maxMessages: 100
        }
      })
    }

    const subscription = await prisma.subscription.create({
      data: {
        companyId: company.id,
        status: 'TRIALING',
        trialStart: new Date(),
        trialEnd: trialEnd,
        planId: freePlan.id,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEnd
      }
    })

    // TODO: Create N8N workflow for the company
    // Temporarily commented out to fix build issues
    console.log('⚠️ N8N workflow creation temporarily disabled for build')
    
    /*
    try {
      console.log('🔄 Creating N8N workflow...')
      const workflowResult = await createCompanyWorkflow({
        name: company.name,
        businessType: company.businessType as any,
        phoneNumber: company.phoneNumber || '',
        greeting: company.greeting || '',
        businessHours: company.businessHours || ''
      })
      
      // Save N8N workflow to database
      await prisma.n8nWorkflow.create({
        data: {
          companyId: company.id,
          n8nId: workflowResult.workflowId,
          name: workflowResult.isShared ? `Shared: ${company.businessType}` : `Atendimento - ${company.name}`,
          isActive: workflowResult.isActive,
          isShared: workflowResult.isShared || false,
          webhookUrl: workflowResult.webhookUrl,
          config: JSON.stringify({
            businessType: company.businessType,
            phoneNumber: company.phoneNumber,
            greeting: company.greeting,
            businessHours: company.businessHours,
            isShared: workflowResult.isShared || false
          })
        }
      })

      console.log('✅ N8N workflow created and saved')
    } catch (n8nError) {
      console.error('⚠️ N8N workflow creation failed:', n8nError)
      // Continue without N8N - can be configured later
    }
    */

    // Retornar empresa criada com relacionamentos
    const createdCompany = await prisma.company.findUnique({
      where: { id: company.id },
      include: {
        subscription: {
          include: {
            plan: true
          }
        },
        n8nWorkflow: true,
        whatsappConfig: true
      }
    })

    console.log('✅ Company created successfully:', createdCompany)
    return NextResponse.json(createdCompany, { status: 201 })
  } catch (error) {
    console.error('❌ Create company error:', error)
    console.error('Error details:', (error as any)?.message)
    console.error('Stack trace:', (error as any)?.stack)
    return NextResponse.json({ error: 'Internal server error', details: (error as any)?.message }, { status: 500 })
  }
}