import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { readDb } from "@/lib/db/store";
import { createHash } from "node:crypto";

// This deployment uses one Node server. Attempts are limited per account.
const attempts = new Map<string, { count: number; until: number }>();
const version = (hash: string) => createHash("sha256").update(hash).digest("hex");

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
        if (typeof email !== "string" || typeof password !== "string" || !email || !password || email.length > 254 || Buffer.byteLength(password) > 72) return null;
        const key = email.trim().toLowerCase();
        const attempt = attempts.get(key);
        if (attempt && attempt.until > Date.now() && attempt.count >= 10) return null;
        if (!attempt || attempt.until <= Date.now()) {
          if (attempts.size >= 10000) attempts.clear();
          attempts.set(key, { count: 1, until: Date.now() + 15 * 60 * 1000 });
        } else attempt.count++;
        if (process.env.NODE_ENV === "production" && password === "ChangeMe123!") return null;

        const db = readDb();
        const user = db.users.find((u) => u.email.toLowerCase() === key);
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;
        attempts.delete(key);

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      const account = readDb().users.find(u => u.id === (user?.id ?? token.sub));
      if (!account) return null;
      if (user) {
        token.role = (user as { role?: string }).role;
        token.credentialVersion = version(account.passwordHash);
      }
      if (token.credentialVersion !== version(account.passwordHash)) return null;
      token.role = account.role;
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
