import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = { api: { bodyParser: false } }

const uploadDir = path.join(process.cwd(), 'public', 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')

  const form = formidable({ uploadDir, keepExtensions: true, maxFiles: 12, maxFieldsSize: 50 * 1024 * 1024 })
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'upload failed', details: String(err) })
    const uploaded = Object.values(files).flat().map((f: any) => ({ url: `/uploads/${path.basename(f.filepath)}`, name: f.originalFilename }))
    res.status(200).json({ files: uploaded })
  })
}
