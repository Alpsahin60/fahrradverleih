'use client'

import { useState, useEffect } from 'react'

interface Fahrrad {
  id: string
  name: string
  hersteller: string
  status: 'FREI' | 'BELEGT'
  zustand: string
  typ: string
  istEBike: boolean
}

interface Ausleihe {
  id: string
  fahrradId: string
  fahrrad: Fahrrad
  datum: string
  rueckgabeDatum: string | null
  status: 'AKTIV' | 'ZURUECKGEGEBEN'
  name: string
  telefonnummer: string | null
  email: string | null
  createdAt: string
}

export default function AusleiheVerwaltung() {
  const [fahrraeder, setFahrraeder] = useState<Fahrrad[]>([])
  const [ausleihen, setAusleihen] = useState<Ausleihe[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    fahrradId: '',
    name: '',
    telefonnummer: '',
    email: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [fahrraederRes, ausleihenRes] = await Promise.all([
        fetch('/api/fahrraeder'),
        fetch('/api/ausleihen')
      ])
      
      const fahrraederData = await fahrraederRes.json()
      const ausleihenData = await ausleihenRes.json()
      
      setFahrraeder(fahrraederData)
      setAusleihen(ausleihenData)
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/ausleihen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await loadData()
        setShowForm(false)
        setFormData({ fahrradId: '', name: '', telefonnummer: '', email: '' })
        alert('Ausleihe erfolgreich erstellt!')
      } else {
        const error = await response.json()
        alert(`Fehler: ${error.message || 'Unbekannter Fehler'}`)
      }
    } catch (error) {
      console.error('Fehler:', error)
      alert('Fehler beim Erstellen der Ausleihe')
    } finally {
      setLoading(false)
    }
  }

  const rueckgabe = async (ausleiheId: string) => {
    if (!confirm('Fahrrad als zurückgegeben markieren?')) return

    try {
      const response = await fetch(`/api/ausleihen/${ausleiheId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ZURUECKGEGEBEN' })
      })

      if (response.ok) {
        await loadData()
        alert('Fahrrad erfolgreich zurückgegeben!')
      } else {
        alert('Fehler bei der Rückgabe')
      }
    } catch (error) {
      console.error('Fehler bei der Rückgabe:', error)
      alert('Fehler bei der Rückgabe')
    }
  }

  const verfuegbareFahrraeder = fahrraeder.filter(f => f.status === 'FREI')
  const aktiveAusleihen = ausleihen.filter(a => a.status === 'AKTIV')

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
        <h2 className="text-2xl font-bold text-gray-900">🎯 Ausleihverwaltung</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setFormData({ fahrradId: '', name: '', telefonnummer: '', email: '' })
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          disabled={verfuegbareFahrraeder.length === 0}
        >
          {showForm ? '✗ Abbrechen' : '➕ Neue Ausleihe'}
        </button>
      </div>

      <div className="text-sm text-gray-500 bg-white p-4 rounded-lg shadow">
        <strong>Verfügbare Fahrräder:</strong> {verfuegbareFahrraeder.length} | 
        <strong className="text-orange-600 ml-2">Aktive Ausleihen:</strong> {aktiveAusleihen.length} | 
        <strong className="text-green-600 ml-2">Gesamt Ausleihen:</strong> {ausleihen.length}
      </div>

      {verfuegbareFahrraeder.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">⚠️ Keine Fahrräder verfügbar. Alle Fahrräder sind aktuell verliehen.</p>
        </div>
      )}

      {showForm && verfuegbareFahrraeder.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Neue Ausleihe erstellen</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fahrrad auswählen *</label>
                <select
                  required
                  value={formData.fahrradId}
                  onChange={(e) => setFormData({ ...formData, fahrradId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Fahrrad auswählen</option>
                  {verfuegbareFahrraeder.map(fahrrad => (
                    <option key={fahrrad.id} value={fahrrad.id}>
                      {fahrrad.name} - {fahrrad.hersteller} ({fahrrad.typ}) 
                      {fahrrad.istEBike && ' ⚡'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Vor- und Nachname"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefonnummer</label>
                <input
                  type="tel"
                  value={formData.telefonnummer}
                  onChange={(e) => setFormData({ ...formData, telefonnummer: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional: +41 79 123 45 67"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional: beispiel@email.com"
                />
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                🎯 Ausleihe erstellen
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">🔄 Aktive Ausleihen</h3>
        {aktiveAusleihen.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">Keine aktiven Ausleihen vorhanden.</p>
          </div>
        ) : (
          aktiveAusleihen.map((ausleihe) => (
            <div key={ausleihe.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{ausleihe.fahrrad.name}</h4>
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    {ausleihe.fahrrad.istEBike && <span className="text-yellow-500">⚡</span>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div><strong>Kunde:</strong> {ausleihe.name}</div>
                    <div><strong>Telefon:</strong> {ausleihe.telefonnummer || 'Nicht angegeben'}</div>
                    <div><strong>E-Mail:</strong> {ausleihe.email || 'Nicht angegeben'}</div>
                    <div><strong>Ausgeliehen am:</strong> {new Date(ausleihe.datum).toLocaleDateString('de-DE')}</div>
                    <div><strong>Hersteller:</strong> {ausleihe.fahrrad.hersteller}</div>
                    <div><strong>Typ:</strong> {ausleihe.fahrrad.typ}</div>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => rueckgabe(ausleihe.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    ✅ Zurückgeben
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}