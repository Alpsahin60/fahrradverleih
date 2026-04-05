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
  createdAt: string
}

export default function FahrradVerwaltung() {
  const [fahrraeder, setFahrraeder] = useState<Fahrrad[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    hersteller: '',
    zustand: '',
    typ: '',
    istEBike: false
  })

  const fahrradTypen = [
    'Mountainbike',
    'Citybike',
    'Rennrad',
    'E-Bike',
    'Trekkingbike',
    'BMX',
    'Enduro',
    'Downhill',
    'Crossbike'
  ]

  const zustaende = ['Neu', 'Sehr gut', 'Gut', 'Befriedigend', 'Reparaturbedürftig']

  useEffect(() => {
    loadFahrraeder()
  }, [])

  const loadFahrraeder = async () => {
    try {
      const response = await fetch('/api/fahrraeder')
      const data = await response.json()
      setFahrraeder(data)
    } catch (error) {
      console.error('Fehler beim Laden der Fahrräder:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingId ? `/api/fahrraeder/${editingId}` : '/api/fahrraeder'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await loadFahrraeder()
        setShowForm(false)
        setEditingId(null)
        setFormData({ name: '', hersteller: '', zustand: '', typ: '', istEBike: false })
        alert(editingId ? 'Fahrrad aktualisiert!' : 'Fahrrad hinzugefügt!')
      } else {
        alert('Fehler beim Speichern')
      }
    } catch (error) {
      console.error('Fehler:', error)
      alert('Fehler beim Speichern')
    } finally {
      setLoading(false)
    }
  }

  const deleteFahrrad = async (id: string) => {
    if (!confirm('Fahrrad wirklich löschen?')) return

    try {
      const response = await fetch(`/api/fahrraeder/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await loadFahrraeder()
        alert('Fahrrad gelöscht!')
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
    }
  }

  const startEdit = (fahrrad: Fahrrad) => {
    setEditingId(fahrrad.id)
    setFormData({
      name: fahrrad.name,
      hersteller: fahrrad.hersteller,
      zustand: fahrrad.zustand,
      typ: fahrrad.typ,
      istEBike: fahrrad.istEBike
    })
    setShowForm(true)
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
        <h2 className="text-2xl font-bold text-gray-900">🚲 Fahrradverwaltung</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ name: '', hersteller: '', zustand: '', typ: '', istEBike: false })
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? '✗ Abbrechen' : '➕ Neues Fahrrad erfassen'}
        </button>
      </div>

      <div className="text-sm text-gray-500 bg-white p-4 rounded-lg shadow">
        <strong>Gesamt:</strong> {fahrraeder.length} | 
        <strong className="text-green-600 ml-2">Verfügbar:</strong> {fahrraeder.filter(f => f.status === 'FREI').length} | 
        <strong className="text-red-600 ml-2">Verliehen:</strong> {fahrraeder.filter(f => f.status === 'BELEGT').length} |
        <strong className="text-purple-600 ml-2">E-Bikes:</strong> {fahrraeder.filter(f => f.istEBike).length}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900">
            {editingId ? '🔧 Fahrrad bearbeiten' : '🚲 Neues Fahrrad hinzufügen'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name/Modell *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="z.B. Trek X-Caliber 9"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hersteller *</label>
                <input
                  type="text"
                  required
                  value={formData.hersteller}
                  onChange={(e) => setFormData({ ...formData, hersteller: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="z.B. Trek, Specialized, Giant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Typ *</label>
                <select
                  required
                  value={formData.typ}
                  onChange={(e) => setFormData({ ...formData, typ: e.target.value })}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white ${
                    formData.typ === '' ? 'text-gray-500' : 'text-gray-900'
                  }`}
                >
                  <option value="" disabled hidden className="text-gray-500">
                    Typ auswählen...
                  </option>
                  {fahrradTypen.map(typ => (
                    <option key={typ} value={typ} className="text-gray-900">{typ}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zustand *</label>
                <select
                  required
                  value={formData.zustand}
                  onChange={(e) => setFormData({ ...formData, zustand: e.target.value })}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white ${
                    formData.zustand === '' ? 'text-gray-500' : 'text-gray-900'
                  }`}
                >
                  <option value="" disabled hidden className="text-gray-500">
                    Zustand auswählen...
                  </option>
                  {zustaende.map(zustand => (
                    <option key={zustand} value={zustand} className="text-gray-900">{zustand}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="istEBike"
                checked={formData.istEBike}
                onChange={(e) => setFormData({ ...formData, istEBike: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="istEBike" className="ml-2 text-sm text-gray-700">
                ⚡ Ist ein E-Bike
              </label>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingId ? '💾 Aktualisieren' : '➕ Hinzufügen'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {fahrraeder.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">Noch keine Fahrräder vorhanden.</p>
          </div>
        ) : (
          fahrraeder.map((fahrrad) => (
            <div key={fahrrad.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{fahrrad.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${fahrrad.status === 'FREI' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {fahrrad.istEBike && <span className="text-yellow-500 text-lg">⚡</span>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div><strong>Hersteller:</strong> {fahrrad.hersteller}</div>
                    <div><strong>Typ:</strong> {fahrrad.typ}</div>
                    <div><strong>Zustand:</strong> {fahrrad.zustand}</div>
                    <div><strong>Status:</strong> 
                      <span className={`ml-1 ${fahrrad.status === 'FREI' ? 'text-green-600' : 'text-red-600'}`}>
                        {fahrrad.status === 'FREI' ? 'Verfügbar' : 'Verliehen'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => startEdit(fahrrad)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Bearbeiten
                  </button>
                  <button
                    onClick={() => deleteFahrrad(fahrrad.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                    disabled={fahrrad.status === 'BELEGT'}
                  >
                    🗑️ Löschen
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