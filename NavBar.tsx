'use client'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'


export default function NavBar() {
const { data: session } = useSession()
return (
<nav className="bg-white border-b">
<div className="container flex items-center justify-between h-16">
<Link href="/" className="font-bold">MarketHub</Link>
<div className="flex items-center gap-4">
<Link href="/browse">Browse</Link>
<Link href="/post" className="px-3 py-1 border rounded">Post</Link>
{session?.user ? (
<>
<Link href="/dashboard">Dashboard</Link>
<button onClick={() => signOut()} className="px-3 py-1 border rounded">Sign out</button>
</>
) : (
<Link href="/signin">Sign In</Link>
)}
</div>
</div>
</nav>
)
}