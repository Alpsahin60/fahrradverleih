import type { Metadata } from 'next'
import './globals.css'
import { FahrradverleihProvider } from './lib/context'
import Navigation from './components/Navigation'

export const metadata: Metadata = {
  title: 'Fahrradverleih München',
  description: 'Professioneller Fahrradverleih in München - Buchen Sie Ihr Fahrrad online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="bg-gray-50 font-sans antialiased">
        <FahrradverleihProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
        </FahrradverleihProvider>
      </body>
    </html>
  )
}