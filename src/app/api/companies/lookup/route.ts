import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'API route temporarily disabled for build',
    defaultResponse: 'Olá! Como posso ajudá-lo(a)?'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'API route temporarily disabled for build',
    success: true,
    logged: false
  })
}