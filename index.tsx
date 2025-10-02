import Layout from '../components/Layout'
import Link from 'next/link'


export default function Home() {
    return (
    <Layout>
        <section className="py-6">
            <h1 className="text-3xl font-bold">Buy & Sell Used Equipment</h1>
            <p className="mt-2 text-gray-600">Search marketplace by category, city or keywords.</p>
            <div className="mt-4 flex gap-2">
                <input className="flex-1 border p-2 rounded" placeholder="Keyword, model, brand" />
                <select className="border p-2 rounded"><option>All categories</option></select>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded">Search</button>
            </div>
        </section>
        <section className="mt-8">
            <h2 className="text-xl font-semibold">Popular categories</h2>
            <div className="mt-3 flex gap-3 flex-wrap">
                {['Food & Beverage','Manufacturing','Office','Tech','Other'].map(c => (
                    <Link key={c} href={`/browse?category=${encodeURIComponent(c)}`} className="px-4 py-2 border rounded">{c}</Link>
                ))}
            </div>
        </section>
        <section className="mt-8">
            <h2 className="text-xl font-semibold">Featured listings</h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="col-span-3 md:col-span-1 border p-4">Sample featured</div>
            </div>
        </section>
    </Layout>
    )
}