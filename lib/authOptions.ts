import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error("Invalid credentials");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials");
                }

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    debug: process.env.NODE_ENV === "development",
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                if (!user.email) return false;
                try {
                    const dbUser = await prisma.user.upsert({
                        where: { email: user.email },
                        create: {
                            email: user.email,
                            name: user.name,
                            imageUrl: user.image,
                        },
                        update: {
                            name: user.name,
                            imageUrl: user.image,
                        },
                    });
                    // Attach the database ID to the user object so it flows to the JWT callback
                    user.id = dbUser.id;
                    return true;
                } catch (error) {
                    console.log("Error saving user", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.imageUrl = (user as any).imageUrl; // Type assertion since imageUrl is custom
            }

            // Handle updates if needed
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }

            // Ensure we have an ID for existing tokens if possible (fallback lookup)
            if (!token.id && token.email) {
                const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.imageUrl = dbUser.imageUrl || "";
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.imageUrl = token.imageUrl;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
