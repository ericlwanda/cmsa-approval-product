import NextAuth, { DefaultSession} from "next-auth";
import authConfig from "./auth.config";
import { User } from "@/types/user";



declare module "@auth/core" {
  interface Session {
    user: User;
  }
}





export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/Login",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          userInfo: u.userInfo,
          AccessToken: u.AccessToken,
          success: u.success,
          message: u.message,
        };
      }
      return token;
    },
    async session({ session, user, token }) {
      session.sessionToken = token.AccessToken as string;
      if (session.user) {
        return {
          ...session,
          user: {
            ...session.user,
            userInfo: token.userInfo,
            AccessToken: token.AccessToken,
            success: token.success,
            message: token.message,
          },
        };
      }
      
      return session;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
