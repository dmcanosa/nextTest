import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      //console.log('auth config: ',auth);
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

/*

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV !== 'production',
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.accessToken;
      const isOnLogin = nextUrl.pathname.startsWith('/login');
     if (
        isLoggedIn && isOnLogin
      ) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      } 
      return true;
    },
    async jwt({ token, user }) {
      if (token && user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
     // handling your jwt payload

      return token
    },
    async session({ session, token }) {
     // store your payload into session nextauth
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;*/