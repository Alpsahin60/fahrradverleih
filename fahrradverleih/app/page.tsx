'use client'

import Link from 'next/link'
import { useFahrradverleih } from './lib/context'

export default function Home() {
  const { getVerfügbareFahrräder, getAusgebuchteFahrräder } = useFahrradverleih()
  
  const verfügbareFahrräder = getVerfügbareFahrräder()
  const ausgebuchteFahrräder = getAusgebuchteFahrräder()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Entdecke München auf zwei Rädern
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Miete hochwertige Fahrräder für deinen perfekten Tag in München. 
            Einfach, günstig und umweltfreundlich durch die Stadt!
          </p>
          
          {/* Live Status */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg">
              <span className="text-2xl font-bold">{verfügbareFahrräder.length}</span>
              <p className="text-sm">Verfügbar</p>
            </div>
            <div className="bg-red-100 text-red-800 px-6 py-3 rounded-lg">
              <span className="text-2xl font-bold">{ausgebuchteFahrräder.length}</span>
              <p className="text-sm">Ausgebucht</p>
            </div>
          </div>

          <div className="space-x-4">
            <Link 
              href="/fahrraeder"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Fahrräder ansehen
            </Link>
            <Link 
              href="/buchung"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-block"
            >
              Jetzt buchen
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Unsere Fahrräder im Überblick
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {/* Stadtrad */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">🚴‍♀️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Stadtrad</h4>
              <p className="text-gray-600 mb-4">Komfort für die Innenstadt</p>
              <div className="text-2xl font-bold text-blue-600 mb-4">ab 8€/Tag</div>
              <div className="text-sm text-green-600">
                {verfügbareFahrräder.filter(f => f.type === 'stadtrad').length} verfügbar
              </div>
            </div>

            {/* E-Bike */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">E-Bike</h4>
              <p className="text-gray-600 mb-4">Elektrische Unterstützung</p>
              <div className="text-2xl font-bold text-blue-600 mb-4">ab 15€/Tag</div>
              <div className="text-sm text-green-600">
                {verfügbareFahrräder.filter(f => f.type === 'ebike').length} verfügbar
              </div>
            </div>

            {/* Mountainbike */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">🚵‍♂️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Mountainbike</h4>
              <p className="text-gray-600 mb-4">Für Trails & Natur</p>
              <div className="text-2xl font-bold text-blue-600 mb-4">ab 12€/Tag</div>
              <div className="text-sm text-green-600">
                {verfügbareFahrräder.filter(f => f.type === 'mountainbike').length} verfügbar
              </div>
            </div>

            {/* Rennrad */}
            <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">🚴‍♂️</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Rennrad</h4>
              <p className="text-gray-600 mb-4">Für sportliche Fahrer</p>
              <div className="text-2xl font-bold text-blue-600 mb-4">ab 14€/Tag</div>
              <div className="text-sm text-green-600">
                {verfügbareFahrräder.filter(f => f.type === 'rennrad').length} verfügbar
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Warum Fahrradverleih München?
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="font-bold text-gray-900 mb-2">Sicher</h4>
              <p className="text-gray-600">Hochwertige Schlösser und GPS-Tracking</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="font-bold text-gray-900 mb-2">Digital</h4>
              <p className="text-gray-600">Online buchen, einfach abholen</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="font-bold text-gray-900 mb-2">Fair</h4>
              <p className="text-gray-600">Transparente Preise, keine versteckten Kosten</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h4 className="font-bold text-gray-900 mb-2">Nachhaltig</h4>
              <p className="text-gray-600">Umweltfreundliche Mobilität in München</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-3">🚴‍♂️</span>
            <span className="text-xl font-bold">Fahrradverleih München</span>
          </div>
          <p className="text-gray-400 mb-4">
            Marienplatz 1, 80331 München | Tel: +49 89 123 456 789
          </p>
          <p className="text-gray-400">
            © 2026 Fahrradverleih München. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  )
}