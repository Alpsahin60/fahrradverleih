'use client'

import { useFahrradverleih } from '../lib/context'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { KundenDaten } from '../lib/types'

export default function BuchungPage() {
  const { fahrraeder, getVerfügbareFahrräder, neuesBuchung } = useFahrradverleih()
  const [step, setStep] = useState(1)
  const [selectedFahrradId, setSelectedFahrradId] = useState<string>('')
  const [startDatum, setStartDatum] = useState('')
  const [endDatum, setEndDatum] = useState('')
  const [kundendaten, setKundendaten] = useState<KundenDaten>({
    name: '',
    email: '',
    telefon: '',
    ausweis: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const verfügbareFahrräder = getVerfügbareFahrräder()

  // Pre-select bike from URL parameter
  useEffect(() => {
    const fahrradId = searchParams?.get('fahrradId')
    if (fahrradId && verfügbareFahrräder.find(f => f.id === fahrradId)) {
      setSelectedFahrradId(fahrradId)
    }
  }, [searchParams, verfügbareFahrräder])

  const selectedFahrrad = fahrraeder.find(f => f.id === selectedFahrradId)

  const calculatePrice = () => {
    if (!selectedFahrrad || !startDatum || !endDatum) return 0
    const start = new Date(startDatum)
    const end = new Date(endDatum)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return days * selectedFahrrad.preis
  }

  const calculateDays = () => {
    if (!startDatum || !endDatum) return 0
    const start = new Date(startDatum)
    const end = new Date(endDatum)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMinEndDate = () => {
    if (!startDatum) return getMinDate()
    const start = new Date(startDatum)
    start.setDate(start.getDate() + 1)
    return start.toISOString().split('T')[0]
  }

  const handleSubmitBuchung = async () => {
    setLoading(true)
    try {
      const start = new Date(startDatum)
      const end = new Date(endDatum)
      
      const erfolg = await neuesBuchung(selectedFahrradId, kundendaten, start, end)
      
      if (erfolg) {
        setSuccess(true)
        setStep(4)
      } else {
        alert('Buchung fehlgeschlagen. Fahrrad ist nicht verfügbar.')
      }
    } catch (error) {
      console.error('Buchungsfehler:', error)
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return selectedFahrradId !== ''
      case 2: return startDatum !== '' && endDatum !== '' && new Date(endDatum) > new Date(startDatum)
      case 3: return kundendaten.name && kundendaten.email && kundendaten.telefon && kundendaten.ausweis
      default: return false
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">Buchung erfolgreich!</h1>
            <p className="text-gray-600 mb-6">
              Ihre Buchung wurde erfolgreich verarbeitet. Sie erhalten in Kürze eine Bestätigungsmail.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Buchungsdetails:</h3>
              <p><strong>Fahrrad:</strong> {selectedFahrrad?.name}</p>
              <p><strong>Zeitraum:</strong> {startDatum} bis {endDatum}</p>
              <p><strong>Dauer:</strong> {calculateDays()} Tag(e)</p>
              <p><strong>Gesamtpreis:</strong> {calculatePrice()}€</p>
            </div>

            <div className="space-x-4">
              <button
                onClick={() => router.push('/meine-buchungen')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Meine Buchungen
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Zur Startseite
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fahrrad buchen</h1>
          <div className="flex justify-center items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-8 mt-2 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-blue-600 font-semibold' : ''}>Fahrrad</span>
            <span className={step >= 2 ? 'text-blue-600 font-semibold' : ''}>Zeitraum</span>
            <span className={step >= 3 ? 'text-blue-600 font-semibold' : ''}>Ihre Daten</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Fahrrad auswählen */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Wählen Sie Ihr Fahrrad</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {verfügbareFahrräder.map((fahrrad) => (
                  <div
                    key={fahrrad.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedFahrradId === fahrrad.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFahrradId(fahrrad.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{fahrrad.bildUrl}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{fahrrad.name}</h3>
                          <p className="text-sm text-gray-600">{fahrrad.standort}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">{fahrrad.preis}€</div>
                        <div className="text-sm text-gray-600">/Tag</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{fahrrad.beschreibung}</p>
                    <div className="flex flex-wrap gap-1">
                      {fahrrad.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Zeitraum auswählen */}
          {step === 2 && selectedFahrrad && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Wählen Sie den Zeitraum</h2>
              
              {/* Selected bike info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{selectedFahrrad.bildUrl}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedFahrrad.name}</h3>
                    <p className="text-sm text-gray-600">{selectedFahrrad.standort} • {selectedFahrrad.preis}€/Tag</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start-Datum
                  </label>
                  <input
                    type="date"
                    value={startDatum}
                    onChange={(e) => setStartDatum(e.target.value)}
                    min={getMinDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End-Datum
                  </label>
                  <input
                    type="date"
                    value={endDatum}
                    onChange={(e) => setEndDatum(e.target.value)}
                    min={getMinEndDate()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {startDatum && endDatum && new Date(endDatum) > new Date(startDatum) && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Dauer: {calculateDays()} Tag(e)</p>
                      <p className="text-lg font-semibold text-gray-900">
                        Gesamtpreis: {calculatePrice()}€
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Kundendaten */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ihre Kontaktdaten</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vollständiger Name *
                  </label>
                  <input
                    type="text"
                    value={kundendaten.name}
                    onChange={(e) => setKundendaten({...kundendaten, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Max Mustermann"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-Mail Adresse *
                  </label>
                  <input
                    type="email"
                    value={kundendaten.email}
                    onChange={(e) => setKundendaten({...kundendaten, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="max@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefonnummer *
                  </label>
                  <input
                    type="tel"
                    value={kundendaten.telefon}
                    onChange={(e) => setKundendaten({...kundendaten, telefon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+49 123 456 789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ausweis-Nr. *
                  </label>
                  <input
                    type="text"
                    value={kundendaten.ausweis}
                    onChange={(e) => setKundendaten({...kundendaten, ausweis: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="T22000129"
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Buchungsübersicht</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Fahrrad:</span>
                    <span>{selectedFahrrad?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zeitraum:</span>
                    <span>{startDatum} bis {endDatum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dauer:</span>
                    <span>{calculateDays()} Tag(e)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preis pro Tag:</span>
                    <span>{selectedFahrrad?.preis}€</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Gesamtpreis:</span>
                    <span>{calculatePrice()}€</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => {
                if (step > 1) setStep(step - 1)
                else router.push('/')
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {step === 1 ? 'Abbrechen' : 'Zurück'}
            </button>
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid(step)}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  isStepValid(step)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Weiter
              </button>
            ) : (
              <button
                onClick={handleSubmitBuchung}
                disabled={!isStepValid(3) || loading}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  isStepValid(3) && !loading
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Wird gebucht...' : 'Jetzt buchen'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}