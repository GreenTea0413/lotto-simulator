import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  )
  response.headers.set(
    "Permissions-Policy",
    "geolocation=*, microphone=(), camera=()"
  )

  response.headers.set(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 
        'self'
        https://dapi.kakao.com
        https://t1.daumcdn.net
        https://va.vercel-scripts.com
        'unsafe-inline'
        'unsafe-eval';
      script-src-elem 
        'self'
        https://dapi.kakao.com
        https://t1.daumcdn.net
        https://va.vercel-scripts.com
        'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src * blob: data:;
      connect-src *;
      font-src 'self';
      frame-src https://dapi.kakao.com https://t1.daumcdn.net;
    `.replace(/\s{2,}/g, " ").trim()
  )

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}