import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type UserRole = 'Faculty' | 'Student' | 'TA';

// Define protected routes and their allowed roles
const protectedRoutes: Record<string, UserRole[]> = {
  '/faculty': ['Faculty'],
  '/student': ['Student'],
  '/TA': ['TA'],
};

const publicRoutes = ['/login', '/signup', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/api/'))) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get authentication data from cookies or headers
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  const userRole = request.cookies.get('role')?.value as UserRole;
  const user = request.cookies.get('user')?.value;

  // If no authentication data, redirect to login
  if (!token || !userRole || !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user role is authorized for the route
  const routeKey = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  );

  if (routeKey) {
    const allowedRoles = protectedRoutes[routeKey];
    
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      let redirectUrl: string;
      switch (userRole) {
        case 'Student':
          redirectUrl = '/student';
          break;
        case 'Faculty':
          redirectUrl = '/faculty';
          break;
        case 'TA':
          redirectUrl = '/TA';
          break;
        default:
          redirectUrl = '/login';
      }
      
      if (redirectUrl !== pathname) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
