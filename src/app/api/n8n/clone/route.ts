import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'API route temporarily disabled for build',
    success: false,
    workflow: null
  })
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'API route temporarily disabled for build',
    workflows: []
  })
}