import { nanoid } from 'nanoid'


export type UserRole = 'buyer' | 'seller' | 'admin'


export type User = {
    id: string
    name: string
    role: UserRole
    company?: string
    city?: string
    phone_verified?: boolean
}


export type Listing = {
    id: string
    seller_id: string
    title: string
    category: string
    price: number
    negotiable: boolean
    condition: string
    specs?: Record<string, any>
    location?: string
    status: 'draft' | 'pending' | 'live' | 'sold'
    images: string[]
    created_at: string
}


const now = () => new Date().toISOString()


export const users: User[] = [
    { id: 'u1', name: 'AL Machinery', role: 'seller', city: 'Mumbai', phone_verified: true },
        { id: 'u2', name: 'Rohit', role: 'buyer', city: 'Bengaluru' }
]


export const listings: Listing[] = [
{
    id: 'l1', seller_id: 'u1', title: 'Food Mixer - Model X200', category: 'Food & Beverage', price: 45000,
    negotiable: true, condition: 'Used - Good', specs: { year: 2018, hours: 1200 }, location: 'Mumbai', status: 'live',
    images: ['/placeholder-1.jpg','/placeholder-2.jpg'], created_at: now()
},
{
    id: 'l2', seller_id: 'u1', title: 'Packaging Machine A12', category: 'Manufacturing', price: 120000,
    negotiable: false, condition: 'Used - Excellent', specs: { year: 2020 }, location: 'Pune', status: 'live',
    images: ['/placeholder-3.jpg'], created_at: now()
}
]


export function createListing(payload: Partial<Listing> & { seller_id: string }) {
const newListing: Listing = {
    id: nanoid(),
    seller_id: payload.seller_id,
    title: payload.title || 'Untitled',
    category: payload.category || 'Other',
    price: payload.price || 0,
    negotiable: !!payload.negotiable,
    condition: payload.condition || 'Used',
    specs: payload.specs || {},
    location: payload.location || '',
    status: payload.status || 'pending',
    images: payload.images || [],
    created_at: now(),
}
listings.unshift(newListing)
return newListing
}