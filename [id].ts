import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const { id } = req.query
const listing = await prisma.listing.findUnique({ where: { id: String(id) } })
if (!listing) return res.status(404).json({ error: 'Not found' })
if (req.method === 'GET') return res.status(200).json(listing)
res.setHeader('Allow', ['GET'])
res.status(405).end()
}