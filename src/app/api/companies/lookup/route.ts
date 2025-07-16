import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phoneNumber = searchParams.get('phone')
    const businessType = searchParams.get('businessType')
    
    console.log('🔍 Company lookup request:', { phoneNumber, businessType })
    
    // Validação
    if (!phoneNumber && !businessType) {
      return NextResponse.json({ 
        error: 'phone or businessType parameter required' 
      }, { status: 400 })
    }
    
    let company
    
    if (phoneNumber) {
      // Buscar por telefone específico
      company = await prisma.company.findFirst({
        where: {
          phoneNumber: phoneNumber
        },
        include: {
          subscription: {
            include: {
              plan: true
            }
          },
          n8nWorkflow: true
        }
      })
    } else if (businessType) {
      // Buscar template por tipo de negócio (para novos clientes)
      const template = await prisma.company.findFirst({
        where: {
          businessType: businessType as any
        },
        include: {
          subscription: {
            include: {
              plan: true
            }
          }
        }
      })
      
      if (template) {
        company = {
          id: 'template',
          name: 'Template',
          businessType: template.businessType,
          greeting: template.greeting,
          businessHours: template.businessHours,
          subscription: template.subscription
        }
      }
    }
    
    if (!company) {
      return NextResponse.json({ 
        error: 'Company not found',
        defaultResponse: 'Olá! Como posso ajudá-lo(a)?'
      }, { status: 404 })
    }
    
    // Verificar se a assinatura está ativa
    const isActive = company.subscription?.status === 'ACTIVE' || 
                    company.subscription?.status === 'TRIALING'
    
    if (!isActive && company.id !== 'template') {
      return NextResponse.json({ 
        error: 'Subscription inactive',
        defaultResponse: 'Desculpe, este serviço está temporariamente indisponível.'
      }, { status: 402 })
    }
    
    // Retornar dados para o N8N
    const response = {
      companyId: company.id,
      name: company.name,
      businessType: company.businessType,
      greeting: company.greeting || 'Olá! Como posso ajudá-lo(a)?',
      businessHours: company.businessHours ? JSON.parse(company.businessHours) : {},
      subscription: {
        status: company.subscription?.status || 'INACTIVE',
        plan: company.subscription?.plan?.name || 'Nenhum'
      },
      isActive
    }
    
    console.log('✅ Company lookup response:', response)
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Company lookup error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      defaultResponse: 'Desculpe, ocorreu um erro temporário.'
    }, { status: 500 })
  }
}

// POST para registrar nova conversa/lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, companyId, messageType, content } = body
    
    console.log('📝 Logging conversation:', { phoneNumber, companyId, messageType })
    
    // Aqui você pode implementar logging de conversas
    // Por enquanto, apenas confirma recebimento
    
    return NextResponse.json({ 
      success: true,
      logged: true
    })
    
  } catch (error) {
    console.error('❌ Conversation logging error:', error)
    return NextResponse.json({ 
      error: 'Failed to log conversation' 
    }, { status: 500 })
  }
}