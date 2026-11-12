import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { readDb } from "@/lib/db/store";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const db = readDb();
        const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        (session.user as typeof session.user & { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});
