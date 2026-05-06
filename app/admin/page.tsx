'use client'

import { useFahrradverleih } from '../lib/context'

export default function AdminPage() {
  const { fahrraeder, buchungen } = useFahrradverleih()

  const getStatistiken = () => {
    const verfügbar = fahrraeder.filter(f => f.verfügbar).length
    const ausgebucht = fahrraeder.filter(f => !f.verfügbar).length
    const aktiveBuchungen = buchungen.filter(b => b.status === 'aktiv').length
    const gesamtumsatz = buchungen
      .filter(b => b.status === 'aktiv')
      .reduce((sum, b) => sum + b.gesamtpreis, 0)
    
    return { verfügbar, ausgebucht, aktiveBuchungen, gesamtumsatz }
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

  const getFahrradName = (fahrradId: string) => {
    return fahrraeder.find(f => f.id === fahrradId)?.name || 'Unbekannt'
  }

  const stats = getStatistiken()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Übersicht über Fahrräder und Buchungen</p>
        </div>

        {/* Statistiken */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🚲</div>
              <div>
                <p className="text-sm text-gray-600">Verfügbare Fahrräder</p>
                <p className="text-2xl font-bold text-green-600">{stats.verfügbar}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🔒</div>
              <div>
                <p className="text-sm text-gray-600">Ausgebuchte Fahrräder</p>
                <p className="text-2xl font-bold text-red-600">{stats.ausgebucht}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📅</div>
              <div>
                <p className="text-sm text-gray-600">Aktive Buchungen</p>
                <p className="text-2xl font-bold text-blue-600">{stats.aktiveBuchungen}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">💰</div>
              <div>
                <p className="text-sm text-gray-600">Gesamtumsatz</p>
                <p className="text-2xl font-bold text-green-600">{stats.gesamtumsatz}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fahrräder Übersicht */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Fahrräder Übersicht</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fahrrad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Standort</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Preis</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Verfügbar bis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {fahrraeder.map((fahrrad, index) => (
                  <tr key={fahrrad.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{fahrrad.bildUrl}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{fahrrad.name}</div>
                          <div className="text-sm text-gray-500">{fahrrad.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{fahrrad.standort}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">{fahrrad.preis}€/Tag</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        fahrrad.verfügbar ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {fahrrad.verfügbar ? 'Verfügbar' : 'Ausgebucht'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {fahrrad.ausgebuchtBis ? formatDate(fahrrad.ausgebuchtBis) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Aktuelle Buchungen */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Aktuelle Buchungen</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buchung</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kunde</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fahrrad</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Zeitraum</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Preis</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {buchungen.filter(b => b.status === 'aktiv').map((buchung, index) => {
                  const fahrrad = fahrraeder.find(f => f.id === buchung.fahrradId)
                  return (
                    <tr key={buchung.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{buchung.id}</div>
                        <div className="text-sm text-gray-500">{formatDate(buchung.startDatum)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{buchung.kundenName}</div>
                        <div className="text-sm text-gray-500">{buchung.kundenEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{fahrrad?.bildUrl}</span>
                          <div className="text-sm font-medium text-gray-900">{getFahrradName(buchung.fahrradId)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        <div>{formatDate(buchung.startDatum)}</div>
                        <div>bis {formatDate(buchung.endDatum)}</div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        {buchung.gesamtpreis}€
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          buchung.abgeholt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {buchung.abgeholt ? 'Abgeholt' : 'Bereit zur Abholung'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {buchungen.filter(b => b.status === 'aktiv').length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Keine aktiven Buchungen vorhanden
            </div>
          )}
        </div>
      </div>
    </div>
  )
}