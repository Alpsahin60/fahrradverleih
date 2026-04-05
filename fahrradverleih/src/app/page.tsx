'use client'

import { useState } from 'react'
import FahrradVerwaltung from '@/components/FahrradVerwaltung'
import UebersichtStatus from '@/components/UebersichtStatus'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'fahrradverwaltung' | 'home'>('home')

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🚴 RentABike Fahrradverleih by AlpSahin</h1>
          <p className="text-blue-100 mt-2">Professioneller Fahrradverleih - preiswert und unkompliziert</p>
        </div>
      </header>

      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'home'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => setActiveTab('fahrradverwaltung')}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'fahrradverwaltung'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🚲 Fahrradverwaltung
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'fahrradverwaltung' && <FahrradVerwaltung />}
        {activeTab === 'home' && <UebersichtStatus />}
      </main>
    </div>
  )
}