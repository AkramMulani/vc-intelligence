"use client"

import { Menu } from "lucide-react"
import "./globals.css"
import Link from "next/link"
import { useState } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">

        <div className="flex h-screen">

          {/* Desktop Sidebar */}
          <aside className="hidden md:flex w-64 border-r bg-white px-6 py-8 flex-col">
            <h1 className="text-lg text-black font-semibold tracking-tight mb-8">
              VC Intelligence
            </h1>

            <nav className="flex flex-col gap-3 text-sm text-gray-600">
              <Link href="/companies" className="hover:text-black transition">
                Companies
              </Link>
              <Link href="/lists" className="hover:text-black transition">
                Lists
              </Link>
              <Link href="/saved" className="hover:text-black transition">
                Saved Searches
              </Link>
            </nav>

            <div className="mt-auto text-xs text-gray-400">
              Precision AI Scout
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {open && (
            <div className="fixed inset-0 z-40 flex md:hidden">
              <div className="w-64 bg-white p-6 space-y-6 shadow-lg">
                <h1 className="text-lg text-black font-semibold tracking-tight">
                  VC Intelligence
                </h1>

                <nav className="flex flex-col gap-4 text-sm text-gray-700">
                  <Link href="/companies" onClick={() => setOpen(false)}>
                    Companies
                  </Link>
                  <Link href="/lists" onClick={() => setOpen(false)}>
                    Lists
                  </Link>
                  <Link href="/saved" onClick={() => setOpen(false)}>
                    Saved Searches
                  </Link>
                </nav>
              </div>

              {/* Overlay background */}
              <div
                className="flex-1 bg-black/30"
                onClick={() => setOpen(false)}
              />
            </div>
          )}

          {/* Main Section */}
          <div className="flex-1 flex flex-col">

            {/* Mobile Topbar */}
            <div className="md:hidden flex items-center justify-between px-6 py-4 border-b bg-white">
              <h1 className="text-base text-black font-semibold">
                VC Intelligence
              </h1>

              <button
                onClick={() => setOpen(true)}
                className="text-sm text-black font-medium"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Content */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10">
              {children}
            </main>

          </div>

        </div>
      </body>
    </html>
  )
}
