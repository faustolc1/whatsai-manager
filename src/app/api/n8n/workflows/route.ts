import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    message: 'API route temporarily disabled for build',
    success: false, 
    count: 0,
    workflows: []
  })
}