// pages/api/listings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { category, q, city, page = '1', limit = '20' } = req.query
    const where: any = { status: 'live' }
    if (category) where.category = String(category)
    if (city) where.location = { contains: String(city), mode: 'insensitive' }
    if (q) where.title = { contains: String(q), mode: 'insensitive' }

    const pageInt = parseInt(String(page) || '1')
    const limitInt = Math.min(100, parseInt(String(limit) || '20'))

    const listings = await prisma.listing.findMany({
      where,
      skip: (pageInt - 1) * limitInt,
      take: limitInt,
      orderBy: { createdAt: 'desc' }
    })
    return res.status(200).json(listings)
  }

  if (req.method === 'POST') {
    // session / demo fallback
    const session = await getSession({ req })
    let sellerId: string | null = session?.user?.id as string || null

    if (!sellerId && process.env.DEMO_ALLOW_PUBLIC_POSTING === 'true') {
      const demoEmail = process.env.DEMO_USER_EMAIL || 'dev@local.test'
      let demoUser = await prisma.user.findUnique({ where: { email: demoEmail } })
      if (!demoUser) {
        demoUser = await prisma.user.create({
          data: { email: demoEmail, name: 'Demo Seller', role: 'seller', password: null }
        })
      }
      sellerId = demoUser.id
    }

    if (!sellerId) return res.status(401).json({ error: 'Unauthorized' })

    const body = req.body
    if (!body.title || typeof body.price === 'undefined') return res.status(400).json({ error: 'title and price required' })

    // normalize incoming images into an array
    let imagesArr: string[] = []
    if (Array.isArray(body.images)) imagesArr = body.images
    else if (typeof body.images === 'string' && body.images.trim().length > 0) {
      imagesArr = body.images.split(',').map((s: string) => s.trim()).filter(Boolean)
    }

    // same for docs
    let docsArr: string[] = []
    if (Array.isArray(body.docs)) docsArr = body.docs
    else if (typeof body.docs === 'string' && body.docs.trim().length > 0) {
      docsArr = body.docs.split(',').map((s: string) => s.trim()).filter(Boolean)
    }

    // base data for creation
    const baseData: any = {
      sellerId,
      title: String(body.title),
      category: body.category || 'Other',
      price: Number(body.price),
      negotiable: !!body.negotiable,
      condition: body.condition || 'Used',
      specs: body.specs ?? '',     // could be object or string depending on client
      location: body.location || '',
      status: body.status || 'live'
    }

    // Attempt 1: try to create using array fields (Postgres / schema with String[] / Json)
    try {
      const attemptData = {
        ...baseData,
        // if imagesArr is empty, send [] to avoid undefined
        images: imagesArr,
        docs: docsArr
      }
      const created = await prisma.listing.create({ data: attemptData })
      return res.status(201).json(created)
    } catch (err1: any) {
      // If first attempt fails (likely because connector doesn't accept arrays or Json), retry with stringified fallbacks
      console.warn('prisma create attempt 1 failed, retrying with SQLite-friendly payload:', err1?.message ?? err1)

      try {
        const fallbackData: any = {
          ...baseData,
          // convert to CSV strings for SQLite or older schemas
          images: imagesArr.length ? imagesArr.join(',') : '',
          docs: docsArr.length ? docsArr.join(',') : '',
          // ensure specs is string
          specs: typeof baseData.specs === 'string' ? baseData.specs : JSON.stringify(baseData.specs ?? {})
        }

        const created2 = await prisma.listing.create({ data: fallbackData })
        return res.status(201).json(created2)
      } catch (err2: any) {
        console.error('Both listing.create attempts failed', err1, err2)
        return res.status(500).json({ error: 'Could not create listing', detail: String(err2?.message ?? err2) })
      }
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end()
}
