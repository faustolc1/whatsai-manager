import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/api/webhooks(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}