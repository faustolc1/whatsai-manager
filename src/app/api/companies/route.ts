import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'API route temporarily disabled for build',
    companies: []
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'API route temporarily disabled for build',
    company: null
  })
}