import { NextResponse } from 'next/server';

export function middleware() {
  // Admin routes are protected client-side via Firebase Auth.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
