import type { Metadata } from 'next'
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CRM Dashboard - Mikee.ai',
  description: 'Secure CRM dashboard for managing contacts and leads',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider appearance={{
      cssLayerName: 'clerk'
    }}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SignedOut>
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">CRM Dashboard</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Sign in to access your contacts and leads
                  </p>
                </div>
                <div className="mt-8 flex justify-center gap-4">
                  <SignInButton mode="modal">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <nav className="bg-white border-b border-gray-200">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    Mikee.ai CRM
                  </Link>
                  <div className="flex items-center gap-6">
                    <Link 
                      href="/contacts" 
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Contacts
                    </Link>
                    <Link 
                      href="/batch-calls" 
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Batch Calls
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </nav>
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
