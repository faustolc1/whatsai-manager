import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { n8nClient, workflowMapping, createCompanyWorkflow } from '@/lib/n8n'

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Testing workflow discovery...')
    
    // 1. List all workflows
    const allWorkflows = await n8nClient.getWorkflows()
    console.log('📋 All workflows:', allWorkflows.map(w => ({ id: w.id, name: w.name })))
    
    // 2. Test finding "clinica medica"
    const clinicaWorkflow = await n8nClient.findWorkflowByName('clinica medica')
    console.log('🏥 Clinica medica workflow:', clinicaWorkflow)
    
    // 3. Test workflow mapping
    const templateName = workflowMapping.MEDICAL
    console.log('📝 Template name for MEDICAL:', templateName)
    
    // 4. Test finding by mapped name
    const foundWorkflow = await n8nClient.findWorkflowByName(templateName)
    console.log('🎯 Found workflow by mapping:', foundWorkflow)
    
    return NextResponse.json({
      success: true,
      allWorkflows: allWorkflows.map(w => ({ id: w.id, name: w.name })),
      templateName,
      clinicaWorkflow: clinicaWorkflow ? { id: clinicaWorkflow.id, name: clinicaWorkflow.name } : null,
      foundWorkflow: foundWorkflow ? { id: foundWorkflow.id, name: foundWorkflow.name } : null
    })
    
  } catch (error) {
    console.error('❌ Test clone error:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: (error as any)?.message 
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🧪 Testing workflow clone...')
    
    // Test cloning with dummy data
    const testData = {
      name: 'Teste Clinica',
      businessType: 'MEDICAL' as const,
      phoneNumber: '11999999999',
      greeting: 'Olá! Bem-vindo à nossa clínica',
      businessHours: '{"segunda": "08:00-18:00"}'
    }
    
    const result = await createCompanyWorkflow(testData)
    console.log('✅ Test clone result:', result)
    
    return NextResponse.json({
      success: true,
      result
    })
    
  } catch (error) {
    console.error('❌ Test clone error:', error)
    return NextResponse.json({ 
      error: 'Clone test failed',
      details: (error as any)?.message 
    }, { status: 500 })
  }
}