// FILE: pages/post.tsx
import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Post() {
  const { data: session } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Other')
  const [condition, setCondition] = useState('Used')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [negotiable, setNegotiable] = useState(false)
  const [files, setFiles] = useState<FileList | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!files) {
      setPreviews([])
      return
    }
    const urls: string[] = []
    Array.from(files).slice(0, 12).forEach((f) => {
      urls.push(URL.createObjectURL(f))
    })
    setPreviews(urls)
    return () => urls.forEach(u => URL.revokeObjectURL(u))
  }, [files])

  async function uploadLocalFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return []
    const fd = new FormData()
    Array.from(fileList).slice(0, 12).forEach((f) => fd.append('file', f))
    const res = await fetch('/api/uploads', { method: 'POST', body: fd })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error('Upload failed: ' + txt)
    }
    const json = await res.json()
    // expected: { files: [{ url, name }] }
    return json.files || []
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!session?.user) {
      alert('Please sign in to post a listing')
      return
    }
    setSubmitting(true)
    try {
      // Upload files first (local uploads)
      let uploaded: any[] = []
      if (files && files.length > 0) {
        setUploading(true)
        uploaded = await uploadLocalFiles(files)
        setUploading(false)
      }

      // Build payload. For local SQLite demo we store images as comma-separated string.
      const imagesCsv = uploaded.map(u => u.url).join(',')

      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        price: Number(price) || 0,
        negotiable,
        condition,
        specs: '',
        location: location.trim(),
        // store CSV for SQLite demo. Backend will accept and persist.
        images: imagesCsv,
        status: 'live' // directly go live for demo
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to create listing')
      }

      const data = await res.json()
      // redirect to listing detail
      if (data?.id) router.push(`/listing/${data.id}`)
      else router.push('/browse')

    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'Error creating listing')
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Post a Listing</h2>

        {!session?.user ? (
          <div className="p-4 border rounded">You must be signed in to post. <a href="/signin" className="text-indigo-600">Sign in</a></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 border p-6 rounded">
            <label className="block">
              <div className="text-sm font-medium">Title</div>
              <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border p-2 mt-1" name="title" required />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <div className="text-sm font-medium">Price (₹)</div>
                <input value={price} onChange={e=>setPrice(e.target.value)} className="w-full border p-2 mt-1" name="price" type="number" required />
              </label>

              <label className="block">
                <div className="text-sm font-medium">Category</div>
                <input value={category} onChange={e=>setCategory(e.target.value)} className="w-full border p-2 mt-1" name="category" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <div className="text-sm font-medium">Condition</div>
                <select value={condition} onChange={e=>setCondition(e.target.value)} className="w-full border p-2 mt-1" name="condition">
                  <option>Used</option>
                  <option>Used - Good</option>
                  <option>Used - Excellent</option>
                  <option>New</option>
                </select>
              </label>

              <label className="block">
                <div className="text-sm font-medium">Location (City)</div>
                <input value={location} onChange={e=>setLocation(e.target.value)} className="w-full border p-2 mt-1" name="location" />
              </label>
            </div>

            <label className="block">
              <div className="text-sm font-medium">Description</div>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full border p-2 mt-1" name="description" rows={4} />
            </label>

            <label className="block">
              <div className="text-sm font-medium">Images (min 0, max 12)</div>
              <input id="images" type="file" accept="image/*" multiple onChange={e=>setFiles(e.target.files)} className="mt-2" />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {previews.map((p, i) => (
                  <div key={i} className="h-24 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={p} alt={`preview-${i}`} className="object-cover h-full w-full" />
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center gap-2">
              <input type="checkbox" checked={negotiable} onChange={e=>setNegotiable(e.target.checked)} />
              <div className="text-sm">Negotiable</div>
            </label>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={submitting || uploading} className="px-4 py-2 bg-indigo-600 text-white rounded">
                {submitting ? 'Posting…' : 'Post Listing'}
              </button>
              {uploading && <div className="text-sm text-gray-600">Uploading images…</div>}
            </div>
          </form>
        )}
      </div>
    </Layout>
  )
}
