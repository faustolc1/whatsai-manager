import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const company = await prisma.company.findFirst({
      where: {
        id: params.id,
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

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error('Get company error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { name, businessType, phoneNumber, greeting, businessHours, logoUrl } = data

    const company = await prisma.company.findFirst({
      where: {
        id: params.id,
        owner: {
          clerkId: userId
        }
      },
      include: {
        n8nWorkflow: true
      }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // Atualizar dados da empresa
    const updatedCompany = await prisma.company.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(businessType && { businessType }),
        ...(phoneNumber && { phoneNumber }),
        ...(greeting && { greeting }),
        ...(businessHours && { businessHours }),
        ...(logoUrl && { logoUrl })
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

    // TODO: Update N8N workflow if needed
    // Commented out to avoid build issues
    /*
    if (company.n8nWorkflow) {
      try {
        const workflowVariables: any = {}
        
        if (name) workflowVariables.empresa = name
        if (phoneNumber) workflowVariables.whatsapp = phoneNumber
        if (greeting) workflowVariables.saudacao = greeting
        if (businessHours) workflowVariables.horario = businessHours
        if (businessType) workflowVariables.tipo_negocio = businessType

        await updateCompanyWorkflow(company.n8nWorkflow.n8nId, workflowVariables)
        
        // Atualizar lastSync
        await prisma.n8nWorkflow.update({
          where: { id: company.n8nWorkflow.id },
          data: { lastSync: new Date() }
        })
      } catch (error) {
        console.error('Error updating N8N workflow:', error)
        // Continue without N8N update
      }
    }
    */

    return NextResponse.json(updatedCompany)
  } catch (error) {
    console.error('Update company error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🗑️ Deleting company:', params.id)
    
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const company = await prisma.company.findFirst({
      where: {
        id: params.id,
        owner: {
          clerkId: userId
        }
      },
      include: {
        n8nWorkflow: true
      }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    // TODO: Delete N8N workflow
    // Commented out to avoid build issues
    /*
    if (company.n8nWorkflow) {
      try {
        console.log('🔄 Deleting N8N workflow:', company.n8nWorkflow.n8nId)
        await n8nClient.deleteWorkflow(company.n8nWorkflow.n8nId)
        console.log('✅ N8N workflow deleted')
      } catch (error) {
        console.error('⚠️ Error deleting N8N workflow:', error)
        // Continue even if N8N deletion fails
      }
    }
    */

    // Delete company (cascade will delete related records)
    await prisma.company.delete({
      where: { id: params.id }
    })

    console.log('✅ Company deleted successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Delete company error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}