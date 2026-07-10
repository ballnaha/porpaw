import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Line from "next-auth/providers/line";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./app/lib/prisma";
import { verifyPassword } from "./app/lib/password";

const lineClientId = process.env.AUTH_LINE_ID ?? process.env.LINE_CHANNEL_ID;
const lineClientSecret = process.env.AUTH_LINE_SECRET ?? process.env.LINE_CHANNEL_SECRET;
const lineConfigured = Boolean(lineClientId && lineClientSecret);
const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "production" ? undefined : "baebite-development-secret-change-before-production");

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: authSecret,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    ...(lineConfigured
      ? [
          Line({
            clientId: lineClientId!,
            clientSecret: lineClientSecret!,
          }),
        ]
      : []),
    Credentials({
      id: "credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        const valid = await verifyPassword(password, user?.passwordHash);

        if (!user || !valid || user.role !== "ADMIN") return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: "member-credentials",
      name: "Member",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = String(credentials?.username ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!username || !password) return null;

        const user = await prisma.user.findUnique({ where: { email: username } });
        const valid = await verifyPassword(password, user?.passwordHash);

        if (!user || !valid || user.role !== "USER") return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
    ...(process.env.NODE_ENV !== "production"
      ? [
          Credentials({
            id: "dev-line",
            name: "Dev LINE",
            credentials: {},
            async authorize() {
              return prisma.user.upsert({
                where: { email: "dev-line@baebite.local" },
                update: { name: "LINE Dev User", role: "USER" },
                create: {
                  name: "LINE Dev User",
                  email: "dev-line@baebite.local",
                  role: "USER",
                },
              });
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        session.user.role = token.role ?? "USER";
      }

      return session;
    },
  },
});
