'use client'

import { useState, useEffect } from 'react'

interface Ausleihe {
  id: string
  datum: string
  status: 'AKTIV' | 'ZURUECKGEGEBEN'
  name: string
  adresse?: string
  plz?: string
  ort?: string
  telefonnummer?: string
  email?: string
  reisepassNr?: string
  fahrrad: {
    id: string
    name: string
    hersteller: string
  }
}

export default function AusleiheListe() {
  const [ausleihen, setAusleihen] = useState<Ausleihe[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'alle' | 'aktiv' | 'zurueckgegeben'>('alle')

  useEffect(() => {
    loadAusleihen()
  }, [])

  const loadAusleihen = async () => {
    try {
      const response = await fetch('/api/ausleihen')
      const data = await response.json()
      setAusleihen(data)
    } catch (error) {
      console.error('Fehler beim Laden der Ausleihen:', error)
    } finally {
      setLoading(false)
    }
  }

  const returnBike = async (ausleiheId: string) => {
    if (!confirm('Möchten Sie das Fahrrad als zurückgegeben markieren?')) {
      return
    }

    try {
      const response = await fetch(`/api/ausleihen/${ausleiheId}/zurueckgeben`, {
        method: 'PUT'
      })

      if (response.ok) {
        loadAusleihen() // Reload data
        alert('Fahrrad erfolgreich zurückgegeben!')
      } else {
        alert('Fehler beim Zurückgeben des Fahrrads')
      }
    } catch (error) {
      console.error('Fehler beim Zurückgeben:', error)
      alert('Fehler beim Zurückgeben des Fahrrads')
    }
  }

  const filteredAusleihen = ausleihen.filter(ausleihe => {
    if (filter === 'aktiv') return ausleihe.status === 'AKTIV'
    if (filter === 'zurueckgegeben') return ausleihe.status === 'ZURUECKGEGEBEN'
    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ausleihen verwalten</h2>
        <div className="text-sm text-gray-500">
          Gesamt: {ausleihen.length} | 
          Aktiv: {ausleihen.filter(a => a.status === 'AKTIV').length} | 
          Zurückgegeben: {ausleihen.filter(a => a.status === 'ZURUECKGEGEBEN').length}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('alle')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'alle'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Alle ({ausleihen.length})
        </button>
        <button
          onClick={() => setFilter('aktiv')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'aktiv'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Aktive ({ausleihen.filter(a => a.status === 'AKTIV').length})
        </button>
        <button
          onClick={() => setFilter('zurueckgegeben')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'zurueckgegeben'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Zurückgegeben ({ausleihen.filter(a => a.status === 'ZURUECKGEGEBEN').length})
        </button>
      </div>

      <div className="grid gap-4">
        {filteredAusleihen.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">
              {filter === 'alle' ? 'Noch keine Ausleihen vorhanden.' : `Keine ${filter}en Ausleihen gefunden.`}
            </p>
          </div>
        ) : (
          filteredAusleihen.map((ausleihe) => (
            <div key={ausleihe.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {ausleihe.fahrrad.name} ({ausleihe.fahrrad.hersteller})
                  </h3>
                  <p className="text-gray-600">Ausgeliehen am: {formatDate(ausleihe.datum)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ausleihe.status === 'AKTIV' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {ausleihe.status === 'AKTIV' ? '🔴 Aktiv' : '✅ Zurückgegeben'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Kundendaten:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {ausleihe.name}</p>
                    {ausleihe.email && <p><strong>E-Mail:</strong> {ausleihe.email}</p>}
                    {ausleihe.telefonnummer && <p><strong>Telefon:</strong> {ausleihe.telefonnummer}</p>}
                    {ausleihe.reisepassNr && <p><strong>Reisepass:</strong> {ausleihe.reisepassNr}</p>}
                  </div>
                </div>
                
                {(ausleihe.adresse || ausleihe.plz || ausleihe.ort) && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Adresse:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {ausleihe.adresse && <p>{ausleihe.adresse}</p>}
                      {(ausleihe.plz || ausleihe.ort) && (
                        <p>{ausleihe.plz} {ausleihe.ort}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {ausleihe.status === 'AKTIV' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => returnBike(ausleihe.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    ✅ Fahrrad zurückgeben
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
