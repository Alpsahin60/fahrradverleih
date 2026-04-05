'use client'

import { useState, useEffect } from 'react'

interface Props {
  onSuccess: () => void
}

interface Fahrrad {
  id: string
  name: string
  hersteller: string
  status: 'FREI' | 'BELEGT'
}

export default function AusleiheForm({ onSuccess }: Props) {
  const [fahrraeder, setFahrraeder] = useState<Fahrrad[]>([])
  const [formData, setFormData] = useState({
    fahrradId: '',
    name: '',
    adresse: '',
    plz: '',
    ort: '',
    telefonnummer: '',
    email: '',
    reisepassNr: ''
  })
  const [loading, setLoading] = useState(false)
  const [loadingFahrraeder, setLoadingFahrraeder] = useState(true)

  useEffect(() => {
    loadAvailableFahrraeder()
  }, [])

  const loadAvailableFahrraeder = async () => {
    try {
      const response = await fetch('/api/fahrraeder')
      const data = await response.json()
      setFahrraeder(data.filter((f: Fahrrad) => f.status === 'FREI'))
    } catch (error) {
      console.error('Fehler beim Laden der Fahrräder:', error)
    } finally {
      setLoadingFahrraeder(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/ausleihen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({
          fahrradId: '',
          name: '',
          adresse: '',
          plz: '',
          ort: '',
          telefonnummer: '',
          email: '',
          reisepassNr: ''
        })
        onSuccess()
        alert('Ausleihe erfolgreich erstellt!')
      } else {
        const error = await response.json()
        alert(error.error || 'Fehler beim Erstellen der Ausleihe')
      }
    } catch (error) {
      console.error('Fehler:', error)
      alert('Fehler beim Erstellen der Ausleihe')
    } finally {
      setLoading(false)
    }
  }

  if (loadingFahrraeder) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Neue Ausleihe erstellen</h2>
        
        {fahrraeder.length === 0 ? (
          <div className="text-center py-12 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-lg font-medium">⚠️ Keine verfügbaren Fahrräder</p>
            <p className="text-yellow-600 mt-2">
              Derzeit sind alle Fahrräder verliehen oder es wurden noch keine Fahrräder hinzugefügt.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fahrrad auswählen */}
            <div>
              <label htmlFor="fahrradId" className="block text-sm font-medium text-gray-700 mb-2">
                Fahrrad auswählen *
              </label>
              <select
                id="fahrradId"
                required
                value={formData.fahrradId}
                onChange={(e) => setFormData({ ...formData, fahrradId: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Fahrrad auswählen</option>
                {fahrraeder.map((fahrrad) => (
                  <option key={fahrrad.id} value={fahrrad.id}>
                    {fahrrad.name} - {fahrrad.hersteller}
                  </option>
                ))}
              </select>
              <p className="text-sm text-green-600 mt-1">
                ✅ {fahrraeder.length} verfügbare{fahrraeder.length !== 1 ? '' : 's'} Fahrrad{fahrraeder.length !== 1 ? 'räder' : ''}
              </p>
            </div>

            {/* Kundendaten */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kundendaten</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Vollständiger Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@beispiel.de"
                  />
                </div>

                <div>
                  <label htmlFor="telefonnummer" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefonnummer
                  </label>
                  <input
                    type="tel"
                    id="telefonnummer"
                    value={formData.telefonnummer}
                    onChange={(e) => setFormData({ ...formData, telefonnummer: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+49 123 456789"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Straße und Hausnummer"
                  />
                </div>

                <div>
                  <label htmlFor="plz" className="block text-sm font-medium text-gray-700 mb-2">
                    PLZ
                  </label>
                  <input
                    type="text"
                    id="plz"
                    value={formData.plz}
                    onChange={(e) => setFormData({ ...formData, plz: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12345"
                  />
                </div>

                <div>
                  <label htmlFor="ort" className="block text-sm font-medium text-gray-700 mb-2">
                    Ort
                  </label>
                  <input
                    type="text"
                    id="ort"
                    value={formData.ort}
                    onChange={(e) => setFormData({ ...formData, ort: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Stadtname"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="reisepassNr" className="block text-sm font-medium text-gray-700 mb-2">
                    Reisepass-Nr. / Ausweis-Nr.
                  </label>
                  <input
                    type="text"
                    id="reisepassNr"
                    value={formData.reisepassNr}
                    onChange={(e) => setFormData({ ...formData, reisepassNr: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ausweis- oder Reisepassnummer"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading || !formData.fahrradId || !formData.name}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Wird erstellt...' : '🎯 Ausleihe erstellen'}
              </button>
              <button
                type="button"
                onClick={() => setFormData({
                  fahrradId: '',
                  name: '',
                  adresse: '',
                  plz: '',
                  ort: '',
                  telefonnummer: '',
                  email: '',
                  reisepassNr: ''
                })}
                className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Zurücksetzen
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-900 mb-2">📋 Information:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Nur der Name ist ein Pflichtfeld</li>
            <li>• Zusätzliche Kundendaten helfen bei der Kontaktaufnahme</li>
            <li>• Nach der Erstellung wird das Fahrrad automatisch als "verliehen" markiert</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
