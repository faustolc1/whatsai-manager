import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'API route temporarily disabled for build',
    success: false,
    allWorkflows: [],
    templateName: null,
    clinicaWorkflow: null,
    foundWorkflow: null
  })
}

export async function POST() {
  return NextResponse.json({
    message: 'API route temporarily disabled for build',
    success: false,
    result: null
  })
}