import { useRouter } from 'next/router'
import useSWR from 'swr'
import Layout from '../../components/Layout'


const fetcher = (u: string) => fetch(u).then(r => r.json())


export default function ListingPage() {
    const { query } = useRouter()
    const id = Array.isArray(query.id) ? query.id[0] : query.id
    const { data, error } = useSWR(() => id ? `/api/listings/${id}` : null, fetcher)
    if (error) return <Layout><div>Error loading</div></Layout>
    if (!data) return <Layout><div>Loading...</div></Layout>
    return (
    <Layout>
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <div className="h-72 bg-gray-100">Gallery</div>
                <h1 className="text-2xl font-bold mt-4">{data.title}</h1>
                <div className="mt-2">{data.category} · {data.location}</div>
                <div className="mt-4 text-xl font-semibold">₹{data.price.toLocaleString()}</div>
                <div className="mt-6">Specs: <pre className="bg-gray-50 p-2 rounded">{JSON.stringify(data.specs, null, 2)}</pre></div>
            </div>
            <aside className="col-span-1 border p-4">
                <div className="font-semibold">Seller</div>
                <div className="mt-3">
                    <button className="w-full py-2 border rounded">Message Seller</button>
                    <button className="w-full py-2 border rounded mt-2">Request Quote</button>
                </div>
            </aside>
        </div>
    </Layout>
    )
}