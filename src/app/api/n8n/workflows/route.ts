import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { n8nClient } from '@/lib/n8n'

export async function GET() {
  try {
    console.log('🔍 Testing N8N connection...')
    
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Test N8N connection by fetching workflows
    const workflows = await n8nClient.getWorkflows()
    
    console.log('✅ N8N connection successful!')
    console.log('📋 Raw workflows response:', workflows)
    console.log('📋 Workflows type:', typeof workflows)
    console.log('📋 Is array:', Array.isArray(workflows))
    
    // Ensure workflows is an array
    const workflowsArray = Array.isArray(workflows) ? workflows : []
    
    console.log('📋 Found workflows:', workflowsArray.length)
    
    return NextResponse.json({ 
      success: true, 
      count: workflowsArray.length,
      workflows: workflowsArray.map(w => ({
        id: w.id,
        name: w.name,
        active: w.active
      }))
    })
  } catch (error) {
    console.error('❌ N8N connection failed:', error)
    console.error('Error stack:', (error as any)?.stack)
    return NextResponse.json({ 
      error: 'N8N connection failed',
      details: (error as any)?.message 
    }, { status: 500 })
  }
}