import Layout from '../components/Layout'
import useSWR from 'swr'
import ListingCard from '../components/ListingCard'


const fetcher = (u: string) => fetch(u).then(r => r.json())


export default function Browse({}) {
    const { data, error } = useSWR('/api/listings', fetcher)
    if (error) return <Layout><div>Error loading</div></Layout>
    if (!data) return <Layout><div>Loading...</div></Layout>
    return (
    <Layout>
        <div className="grid grid-cols-4 gap-6">
            <aside className="col-span-1 border p-4">Filters (category / location / price)</aside>
            <div className="col-span-3 grid grid-cols-2 gap-4">
                {data.map((l: any) => (
                    <ListingCard key={l.id} l={l} />
                ))}
            </div>
        </div>
    </Layout>
    )
}