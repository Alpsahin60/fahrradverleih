'use client'

import { useFahrradverleih } from '../lib/context'
import Link from 'next/link'
import { useState } from 'react'

export default function FahrrraederPage() {
  const { fahrraeder } = useFahrradverleih()
  const [filterType, setFilterType] = useState<string>('alle')
  const [filterStatus, setFilterStatus] = useState<string>('alle')

  const getFilteredFahrraeder = () => {
    return fahrraeder.filter(fahrrad => {
      const typeMatch = filterType === 'alle' || fahrrad.type === filterType
      const statusMatch = filterStatus === 'alle' || 
                         (filterStatus === 'verfügbar' && fahrrad.verfügbar) ||
                         (filterStatus === 'ausgebucht' && !fahrrad.verfügbar)
      return typeMatch && statusMatch
    })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'stadtrad': 'Stadtrad',
      'ebike': 'E-Bike',
      'mountainbike': 'Mountainbike',
      'rennrad': 'Rennrad'
    }
    return labels[type] || type
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'stadtrad': '🚴‍♀️',
      'ebike': '⚡',
      'mountainbike': '🚵‍♂️',
      'rennrad': '🚴‍♂️'
    }
    return icons[type] || '🚲'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Alle Fahrräder</h1>
          <p className="text-gray-600">Entdecken Sie unsere komplette Fahrradflotte</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fahrradtyp
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="alle">Alle Typen</option>
                <option value="stadtrad">Stadtrad</option>
                <option value="ebike">E-Bike</option>
                <option value="mountainbike">Mountainbike</option>
                <option value="rennrad">Rennrad</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verfügbarkeit
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="alle">Alle anzeigen</option>
                <option value="verfügbar">Nur verfügbare</option>
                <option value="ausgebucht">Nur ausgebuchte</option>
              </select>
            </div>
          </div>
        </div>

        {/* Fahrräder Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredFahrraeder().map((fahrrad) => (
            <div key={fahrrad.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Status Badge */}
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    fahrrad.verfügbar 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {fahrrad.verfügbar ? 'Verfügbar' : 'Ausgebucht'}
                  </span>
                </div>
                
                {/* Fahrrad Header */}
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white text-center">
                  <div className="text-6xl mb-2">{getTypeIcon(fahrrad.type)}</div>
                  <h3 className="text-xl font-bold">{fahrrad.name}</h3>
                  <p className="text-blue-100">{getTypeLabel(fahrrad.type)}</p>
                </div>
              </div>

              {/* Fahrrad Details */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">{fahrrad.beschreibung}</p>
                
                {/* Features */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Ausstattung:</h4>
                  <div className="flex flex-wrap gap-1">
                    {fahrrad.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Standort */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600">📍 Standort: </span>
                  <span className="text-sm font-medium text-gray-900">{fahrrad.standort}</span>
                </div>

                {/* Preis */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">{fahrrad.preis}€</span>
                    <span className="text-gray-600 ml-1">/Tag</span>
                  </div>
                  {!fahrrad.verfügbar && fahrrad.ausgebuchtBis && (
                    <div className="text-sm text-red-600">
                      bis {formatDate(fahrrad.ausgebuchtBis)}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Link
                  href={fahrrad.verfügbar ? `/buchung?fahrradId=${fahrrad.id}` : '#'}
                  className={`w-full block text-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                    fahrrad.verfügbar
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {fahrrad.verfügbar ? 'Jetzt buchen' : 'Nicht verfügbar'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {getFilteredFahrraeder().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🚲</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Keine Fahrräder gefunden
            </h3>
            <p className="text-gray-600">
              Versuchen Sie andere Filtereinstellungen
            </p>
          </div>
        )}
      </div>
    </div>
  )
}