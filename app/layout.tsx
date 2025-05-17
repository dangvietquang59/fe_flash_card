import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chinese Flashcards',
  description: 'Learn Chinese with flashcards',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="text-lg font-bold text-blue-800">Chinese Flashcards</Link>
           
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
