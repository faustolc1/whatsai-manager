import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { n8nClient } from '@/lib/n8n'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Starting workflow clone process...')
    
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { companyId, sourceWorkflowId, companyData } = await request.json()
    
    console.log('📝 Clone request:', {
      companyId,
      sourceWorkflowId,
      companyName: companyData?.name
    })

    if (!companyId || !sourceWorkflowId) {
      return NextResponse.json({ 
        error: 'Missing required fields: companyId, sourceWorkflowId' 
      }, { status: 400 })
    }

    // Verify company belongs to user
    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        owner: {
          clerkId: userId
        }
      }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Prepare company data for workflow
    const workflowData = {
      name: company.name,
      businessType: company.businessType,
      phoneNumber: company.phoneNumber || '',
      greeting: company.greeting || `Olá! Bem-vindo(a) à ${company.name}`,
      businessHours: company.businessHours || '{"segunda": "09:00-18:00"}',
      ...companyData
    }

    console.log('🔄 Cloning workflow with data:', workflowData)

    // Clone the workflow
    const result = await n8nClient.cloneWorkflowTemplate(sourceWorkflowId, workflowData)
    
    console.log('✅ Workflow cloned successfully:', result.id)

    // Save workflow info to database
    await prisma.n8nWorkflow.create({
      data: {
        companyId: company.id,
        n8nId: result.id,
        name: result.name,
        isActive: result.active,
        config: JSON.stringify(workflowData)
      }
    })

    console.log('💾 Workflow saved to database')

    return NextResponse.json({
      success: true,
      workflow: {
        id: result.id,
        name: result.name,
        active: result.active
      }
    })

  } catch (error) {
    console.error('❌ Error cloning workflow:', error)
    return NextResponse.json({ 
      error: 'Failed to clone workflow',
      details: (error as any)?.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')

    if (!companyId) {
      return NextResponse.json({ error: 'Missing companyId' }, { status: 400 })
    }

    // Get company workflows
    const workflows = await prisma.n8nWorkflow.findMany({
      where: {
        companyId,
        company: {
          owner: {
            clerkId: userId
          }
        }
      },
      include: {
        company: true
      }
    })

    return NextResponse.json({ workflows })

  } catch (error) {
    console.error('❌ Error fetching workflows:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch workflows',
      details: (error as any)?.message 
    }, { status: 500 })
  }
}