import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { loginWithCredentials, loginWithGoogle } from "@/lib/api/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { user, token } = await loginWithCredentials(
            credentials.email as string,
            credentials.password as string
          )
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            image: user.avatar,
            accessToken: token,
          }
        } catch {
          return null
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id
        token.accessToken = user.accessToken
      }

      // When signing in with Google, exchange the id_token with Laravel
      if (account?.provider === "google" && account.id_token) {
        try {
          const response = await loginWithGoogle(account.id_token)
          token.accessToken = response.token
          token.userId = String(response.user.id)
        } catch {
          // If Laravel exchange fails, the token won't have an accessToken
        }
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      if (token.userId) {
        session.user.id = token.userId
      }
      return session
    },
  },
})
