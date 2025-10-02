import NavBar from './NavBar'
import React from 'react'


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
    <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="container py-8 flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-sm">© MarketHub - MVP</footer>
    </div>
)
}