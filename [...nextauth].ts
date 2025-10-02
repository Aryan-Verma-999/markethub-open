import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'


export default NextAuth({
adapter: PrismaAdapter(prisma as any),
secret: process.env.NEXTAUTH_SECRET,
session: { strategy: 'jwt' },
providers: [
CredentialsProvider({
name: 'Credentials',
credentials: {
email: { label: 'Email', type: 'email' },
password: { label: 'Password', type: 'password' }
},
async authorize(credentials) {
if (!credentials) return null
const user = await prisma.user.findUnique({ where: { email: credentials.email } })
if (!user || !user.password) return null
const isValid = await bcrypt.compare(credentials.password, user.password)
if (!isValid) return null
return { id: user.id, name: user.name, email: user.email }
}
}),
GoogleProvider({
clientId: process.env.GOOGLE_CLIENT_ID || '',
clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
})
],
callbacks: {
async session({ session, token, user }) {
// attach user id to session
if (token && session.user) session.user.id = token.sub
return session
}
}
})  