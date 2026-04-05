'use client'

import { useState, useEffect } from 'react'

interface Fahrrad {
  id: string
  name: string
  hersteller: string
  status: 'FREI' | 'BELEGT'
  zustand: string
  createdAt: string
  ausleihen: Array<{
    id: string
    name: string
    status: 'AKTIV' | 'ZURUECKGEGEBEN'
  }>
}

export default function FahrradListe() {
  const [fahrraeder, setFahrraeder] = useState<Fahrrad[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    hersteller: '',
    zustand: ''
  })

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

  const deleteFahrrad = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie dieses Fahrrad löschen möchten?')) {
      return
    }

    try {
      const response = await fetch(`/api/fahrraeder/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFahrraeder(fahrraeder.filter(f => f.id !== id))
      } else {
        alert('Fehler beim Löschen des Fahrrads')
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
      alert('Fehler beim Löschen des Fahrrads')
    }
  }

  const startEdit = (fahrrad: Fahrrad) => {
    setEditingId(fahrrad.id)
    setEditForm({
      name: fahrrad.name,
      hersteller: fahrrad.hersteller,
      zustand: fahrrad.zustand
    })
  }

  const saveEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/fahrraeder/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        const updatedFahrrad = await response.json()
        setFahrraeder(fahrraeder.map(f => f.id === id ? updatedFahrrad : f))
        setEditingId(null)
      } else {
        alert('Fehler beim Speichern')
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error)
      alert('Fehler beim Speichern')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', hersteller: '', zustand: '' })
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
        <h2 className="text-2xl font-bold text-gray-900">Fahrräder verwalten</h2>
        <div className="text-sm text-gray-500">
          Gesamt: {fahrraeder.length} | 
          Verfügbar: {fahrraeder.filter(f => f.status === 'FREI').length} | 
          Verliehen: {fahrraeder.filter(f => f.status === 'BELEGT').length}
        </div>
      </div>

      <div className="grid gap-4">
        {fahrraeder.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">Noch keine Fahrräder vorhanden.</p>
            <p className="text-gray-400 mt-2">Fügen Sie Ihr erstes Fahrrad hinzu!</p>
          </div>
        ) : (
          fahrraeder.map((fahrrad) => (
            <div key={fahrrad.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              {editingId === fahrrad.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={editForm.hersteller}
                      onChange={(e) => setEditForm({ ...editForm, hersteller: e.target.value })}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Hersteller"
                    />
                    <input
                      type="text"
                      value={editForm.zustand}
                      onChange={(e) => setEditForm({ ...editForm, zustand: e.target.value })}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Zustand"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveEdit(fahrrad.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      ✓ Speichern
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      ✗ Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{fahrrad.name}</h3>
                      <p className="text-gray-600">Hersteller: {fahrrad.hersteller}</p>
                      <p className="text-gray-600">Zustand: {fahrrad.zustand}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        fahrrad.status === 'FREI' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {fahrrad.status === 'FREI' ? '✓ Verfügbar' : '✗ Verliehen'}
                      </span>
                    </div>
                  </div>

                  {fahrrad.ausleihen.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-900 mb-2">Aktuelle Ausleihe:</h4>
                      {fahrrad.ausleihen
                        .filter(a => a.status === 'AKTIV')
                        .map(ausleihe => (
                          <p key={ausleihe.id} className="text-blue-700">
                            Verliehen an: {ausleihe.name}
                          </p>
                        ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(fahrrad)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      ✏️ Bearbeiten
                    </button>
                    <button
                      onClick={() => deleteFahrrad(fahrrad.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      disabled={fahrrad.status === 'BELEGT'}
                    >
                      🗑️ Löschen
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
