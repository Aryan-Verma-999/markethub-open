import Link from 'next/link'
import { Listing } from '../lib/data'


export default function ListingCard({ l }: { l: Listing }) {
    return (
    <div className="border rounded overflow-hidden">
        <div className="h-40 bg-gray-100 flex items-center justify-center">Image</div>
        <div className="p-3">
            <h3 className="font-semibold text-lg"><Link href={`/listing/${l.id}`}>{l.title}</Link></h3>
            <div className="text-sm text-gray-600">{l.category} · {l.location}</div>
            <div className="mt-2 font-bold">₹{l.price.toLocaleString()}</div>
            <div className="mt-3 flex gap-2">
                <button className="flex-1 border py-1 rounded">Contact</button>
                <button className="px-3 py-1 border rounded">Save</button>
            </div>
        </div>
    </div>
)
}