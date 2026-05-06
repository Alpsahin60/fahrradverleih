'use client'

import { useFahrradverleih } from '../lib/context'
import { useState } from 'react'
import Link from 'next/link'

export default function MeineBuchungenPage() {
  const { buchungen, fahrraeder, buchungStornieren } = useFahrradverleih()
  const [emailFilter, setEmailFilter] = useState('')
  const [showFilter, setShowFilter] = useState(false)

  const getFilteredBuchungen = () => {
    if (!emailFilter) return []
    return buchungen.filter(buchung => 
      buchung.kundenEmail.toLowerCase().includes(emailFilter.toLowerCase()) &&
      buchung.status === 'aktiv'
    )
  }

  const getFahrradInfo = (fahrradId: string) => {
    return fahrraeder.find(f => f.id === fahrradId)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (buchung: any) => {
    const daysRemaining = getDaysRemaining(buchung.endDatum)
    if (daysRemaining < 0) return 'bg-red-100 text-red-800'
    if (daysRemaining <= 1) return 'bg-yellow-100 text-yellow-800'
    if (!buchung.abgeholt) return 'bg-blue-100 text-blue-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (buchung: any) => {
    const daysRemaining = getDaysRemaining(buchung.endDatum)
    if (daysRemaining < 0) return 'Überfällig'
    if (daysRemaining === 0) return 'Heute fällig'
    if (daysRemaining === 1) return 'Morgen fällig'
    if (!buchung.abgeholt) return 'Bereit zur Abholung'
    return 'Aktiv'
  }

  const handleStornierung = (buchungId: string) => {
    if (window.confirm('Möchten Sie diese Buchung wirklich stornieren?')) {
      buchungStornieren(buchungId)
      alert('Buchung wurde storniert')
    }
  }

  const filteredBuchungen = getFilteredBuchungen()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meine Buchungen</h1>
          <p className="text-gray-600">Verwalten Sie Ihre aktuellen und vergangenen Fahrradmieten</p>
        </div>

        {/* Email Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Buchungen anzeigen</h2>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showFilter ? 'Filter ausblenden' : 'E-Mail eingeben'}
            </button>
          </div>
          
          {showFilter && (
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail Adresse
              </label>
              <input
                type="email"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                placeholder="Geben Sie Ihre E-Mail ein um Buchungen zu sehen"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Aus Datenschutzgründen werden nur Buchungen mit passender E-Mail angezeigt
              </p>
            </div>
          )}

          {!emailFilter && !showFilter && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-5xl mb-4">📧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                E-Mail eingeben um Buchungen zu sehen
              </h3>
              <p className="text-gray-600 mb-4">
                Geben Sie die E-Mail Adresse ein, mit der Sie gebucht haben
              </p>
              <button
                onClick={() => setShowFilter(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                E-Mail eingeben
              </button>
            </div>
          )}
        </div>

        {/* Buchungen Liste */}
        {emailFilter && (
          <>
            {filteredBuchungen.length > 0 ? (
              <div className="space-y-6">
                {filteredBuchungen.map((buchung) => {
                  const fahrrad = getFahrradInfo(buchung.fahrradId)
                  const daysRemaining = getDaysRemaining(buchung.endDatum)
                  
                  return (
                    <div key={buchung.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="text-4xl">{fahrrad?.bildUrl || '🚲'}</div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">
                                {fahrrad?.name || 'Fahrrad nicht gefunden'}
                              </h3>
                              <p className="text-gray-600">{fahrrad?.standort}</p>
                              <p className="text-sm text-gray-500">Buchungs-ID: {buchung.id}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(buchung)}`}>
                              {getStatusText(buchung)}
                            </span>
                            <div className="mt-2 text-lg font-bold text-gray-900">
                              {buchung.gesamtpreis}€
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Zeitraum */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Mietdauer</h4>
                            <p className="text-gray-900">
                              <span className="block">von {formatDate(buchung.startDatum)}</span>
                              <span className="block">bis {formatDate(buchung.endDatum)}</span>
                            </p>
                            {daysRemaining >= 0 && (
                              <p className="text-sm text-blue-600 mt-1">
                                {daysRemaining === 0 ? 'Heute' : `${daysRemaining} Tag(e)`} verbleibend
                              </p>
                            )}
                            {daysRemaining < 0 && (
                              <p className="text-sm text-red-600 mt-1">
                                {Math.abs(daysRemaining)} Tag(e) überfällig
                              </p>
                            )}
                          </div>

                          {/* Kundendaten */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Kontaktdaten</h4>
                            <p className="text-gray-900">
                              <span className="block">{buchung.kundenName}</span>
                              <span className="block text-sm text-gray-600">{buchung.kundenEmail}</span>
                            </p>
                          </div>

                          {/* Status Details */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${buchung.abgeholt ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                <span className="text-sm text-gray-900">
                                  {buchung.abgeholt ? 'Abgeholt' : 'Bereit zur Abholung'}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${buchung.status === 'aktiv' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-sm text-gray-900 capitalize">{buchung.status}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex space-x-3">
                          {fahrrad && (
                            <Link
                              href={`/fahrraeder?highlight=${fahrrad.id}`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Fahrrad Details →
                            </Link>
                          )}
                          
                          {buchung.status === 'aktiv' && daysRemaining > 0 && (
                            <button
                              onClick={() => handleStornierung(buchung.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Stornieren
                            </button>
                          )}
                          
                          {!buchung.abgeholt && (
                            <span className="text-gray-600 text-sm">
                              📍 Abholung: {fahrrad?.standort}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-400 text-5xl mb-4">🚲</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Keine Buchungen gefunden
                </h3>
                <p className="text-gray-600 mb-6">
                  Für diese E-Mail Adresse sind keine aktiven Buchungen vorhanden.
                </p>
                <Link
                  href="/buchung"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
                >
                  Jetzt Fahrrad buchen
                </Link>
              </div>
            )}
          </>
        )}

        {/* Demo Buchungen Info */}
        {emailFilter && filteredBuchungen.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Demo-Tipp</h4>
            <p className="text-blue-800 text-sm">
              Versuchen Sie diese E-Mail Adressen um Demo-Buchungen zu sehen:
              <br />
              • <code className="bg-blue-100 px-1 rounded">max@email.com</code>
              • <code className="bg-blue-100 px-1 rounded">anna@email.com</code>
              • <code className="bg-blue-100 px-1 rounded">tom@email.com</code>
            </p>
          </div>
        )}

        {/* Quick Actions */}
        {emailFilter && (
          <div className="mt-8 text-center">
            <Link
              href="/buchung"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block mr-4"
            >
              Neues Fahrrad buchen
            </Link>
            <Link
              href="/fahrraeder"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors inline-block"
            >
              Alle Fahrräder ansehen
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}