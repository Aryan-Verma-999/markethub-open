import { getCsrfToken, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '../components/Layout'


export default function SignInPage({ csrfToken }: { csrfToken: string }) {
const router = useRouter()
const [error, setError] = useState('')
async function handleSubmit(e: any) {
e.preventDefault()
const form = new FormData(e.target)
const res = await signIn('credentials', { redirect: false, email: form.get('email'), password: form.get('password') })
if (res?.ok) router.push('/')
else setError('Invalid credentials')
}


return (
<Layout>
<div className="max-w-md mx-auto mt-16 p-6 border rounded">
<h1 className="text-2xl font-bold mb-4">Sign in</h1>
{error && <div className="mb-3 text-sm text-red-600">{error}</div>}
<form onSubmit={handleSubmit} className="space-y-4">
<input name="csrfToken" type="hidden" defaultValue={csrfToken} />
<label className="block"><div className="text-sm">Email</div><input name="email" type="email" className="w-full border p-2 mt-1 rounded" required/></label>
<label className="block"><div className="text-sm">Password</div><input name="password" type="password" className="w-full border p-2 mt-1 rounded" required/></label>
<button className="w-full py-2 bg-indigo-600 text-white rounded">Sign in</button>
</form>
</div>
</Layout>
)
}


export async function getServerSideProps(context: any) {
return { props: { csrfToken: await getCsrfToken(context) } }
}