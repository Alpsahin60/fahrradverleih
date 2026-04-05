'use client'

import { useState } from 'react'

interface Props {
  onSuccess: () => void
}

export default function FahrradForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    hersteller: '',
    zustand: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/fahrraeder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ name: '', hersteller: '', zustand: '' })
        onSuccess()
        alert('Fahrrad erfolgreich hinzugefügt!')
      } else {
        alert('Fehler beim Hinzufügen des Fahrrads')
      }
    } catch (error) {
      console.error('Fehler:', error)
      alert('Fehler beim Hinzufügen des Fahrrads')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Neues Fahrrad hinzufügen</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name/Modell *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. Mountainbike Pro, Citybike Classic..."
            />
          </div>

          <div>
            <label htmlFor="hersteller" className="block text-sm font-medium text-gray-700 mb-2">
              Hersteller *
            </label>
            <input
              type="text"
              id="hersteller"
              required
              value={formData.hersteller}
              onChange={(e) => setFormData({ ...formData, hersteller: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="z.B. Trek, Giant, Specialized..."
            />
          </div>

          <div>
            <label htmlFor="zustand" className="block text-sm font-medium text-gray-700 mb-2">
              Zustand *
            </label>
            <select
              id="zustand"
              required
              value={formData.zustand}
              onChange={(e) => setFormData({ ...formData, zustand: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Zustand auswählen</option>
              <option value="Neu">Neu</option>
              <option value="Sehr gut">Sehr gut</option>
              <option value="Gut">Gut</option>
              <option value="Befriedigend">Befriedigend</option>
              <option value="Reparaturbedürftig">Reparaturbedürftig</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Wird gespeichert...' : '🚲 Fahrrad hinzufügen'}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ name: '', hersteller: '', zustand: '' })}
              className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Zurücksetzen
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-900 mb-2">💡 Tipps:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Verwenden Sie aussagekräftige Namen für einfache Identifikation</li>
            <li>• Der Zustand hilft bei der Preisgestaltung und Kundeninformation</li>
            <li>• Alle Felder sind Pflichtfelder</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
