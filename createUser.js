// scripts/createDemoUser.js
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  const email = process.env.DEMO_USER_EMAIL || 'dev@local.test'
  const password = process.env.DEMO_USER_PASSWORD || 'password123'
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: 'Demo Seller', password: hashed, role: 'seller' }
  })
  console.log('Demo user ready:', user.email)
}
main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>prisma.$disconnect())
