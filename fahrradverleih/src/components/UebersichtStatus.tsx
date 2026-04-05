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

export default function UebersichtStatus() {
  const [fahrraeder, setFahrraeder] = useState<Fahrrad[]>([])
  const [ausleihen, setAusleihen] = useState<Ausleihe[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'alle' | 'verfuegbar' | 'verliehen'>('alle')
  const [showForm, setShowForm] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [formData, setFormData] = useState({
    fahrradId: '',
    name: '',
    telefonnummer: '',
    email: '',
    reservationVon: '',
    reservationBis: ''
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
    
    // Fehler zurücksetzen
    setFormErrors([])
    
    // Moderne Validierung mit hilfreichem Feedback
    const requiredFields = [
      { field: 'fahrradId', name: 'Fahrrad auswählen', value: formData.fahrradId },
      { field: 'name', name: 'Name eingeben', value: formData.name },
      { field: 'reservationVon', name: 'Startdatum wählen', value: formData.reservationVon },
      { field: 'reservationBis', name: 'Enddatum wählen', value: formData.reservationBis }
    ]

    const missingFields = requiredFields.filter(field => !field.value.trim())

    if (missingFields.length > 0) {
      const errors = missingFields.map(field => field.name)
      setFormErrors(errors)
      
      // Sanft zum ersten Fehler scrollen
      setTimeout(() => {
        const errorElement = document.querySelector('.error-message')
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      
      return
    }

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
        setFormData({ fahrradId: '', name: '', telefonnummer: '', email: '', reservationVon: '', reservationBis: '' })
        setFormErrors([])
        alert('✅ Ausleihe erfolgreich erstellt!')
      } else {
        const error = await response.json()
        alert(`❌ Fehler: ${error.message || 'Unbekannter Fehler'}`)
      }
    } catch (error) {
      console.error('Fehler:', error)
      alert('❌ Fehler beim Erstellen der Ausleihe')
    } finally {
      setLoading(false)
    }
  }

  const gefiltFahrraeder = fahrraeder.filter(fahrrad => {
    if (filterStatus === 'verfuegbar') return fahrrad.status === 'FREI'
    if (filterStatus === 'verliehen') return fahrrad.status === 'BELEGT'
    return true
  })

  const verfuegbareFahrraeder = fahrraeder.filter(f => f.status === 'FREI')

  const statistiken = {
    gesamt: fahrraeder.length,
    verfuegbar: fahrraeder.filter(f => f.status === 'FREI').length,
    aktiveAusleihen: ausleihen.filter(a => a.status === 'AKTIV').length
  }

  // Heute als Mindestdatum für Reservierung
  const heute = new Date().toISOString().split('T')[0]

  // Date Range Picker Funktionen
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}.${month}.${year}`
  }

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0
    const [startYear, startMonth, startDay] = start.split('-').map(Number)
    const [endYear, endMonth, endDay] = end.split('-').map(Number)
    
    const startDate = new Date(startYear, startMonth - 1, startDay)
    const endDate = new Date(endYear, endMonth - 1, endDay)
    
    const diffTime = endDate.getTime() - startDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  // Monatsnamen für die Anzeige
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]

  // Navigation zwischen Monaten
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Zurück zum aktuellen Monat
  const goToCurrentMonth = () => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
  }

  // Prüfen ob wir im aktuellen Monat sind
  const isCurrentMonth = () => {
    const today = new Date()
    return currentMonth === today.getMonth() && currentYear === today.getFullYear()
  }

  // VERBESSERTE Kalendertage-Generierung - nur aktuelle Monatsdaten
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    
    // Nur die Tage des aktuellen Monats generieren
    const days = []
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(currentYear, currentMonth, day))
    }
    
    // Leere Zellen am Anfang für die korrekte Wochentagsanordnung hinzufügen
    const startDay = firstDay.getDay()
    const emptyDays = []
    for (let i = 0; i < startDay; i++) {
      emptyDays.push(null)
    }
    
    return [...emptyDays, ...days]
  }

  const handleDateClick = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    
    // Vergangene Daten nicht auswählbar
    if (dateString < heute) return
    
    // Wochenende prüfen
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert('Wochenenden sind nicht auswählbar. Bitte wählen Sie einen Wochentag.')
      return
    }
    
    if (!formData.reservationVon || (formData.reservationVon && formData.reservationBis)) {
      setFormData({
        ...formData,
        reservationVon: dateString,
        reservationBis: ''
      })
    } else if (dateString >= formData.reservationVon) {
      setFormData({
        ...formData,
        reservationBis: dateString
      })
      setShowDatePicker(false)
    } else {
      setFormData({
        ...formData,
        reservationVon: dateString,
        reservationBis: ''
      })
    }
  }

  const isDateInRange = (date: Date) => {
    if (!formData.reservationVon || !formData.reservationBis) return false
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    return dateString >= formData.reservationVon && dateString <= formData.reservationBis
  }

  const isDateSelected = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    return dateString === formData.reservationVon || dateString === formData.reservationBis
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
        <h2 className="text-2xl font-bold text-gray-900">🚴 Fahrrad ausleihen</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setFormData({ fahrradId: '', name: '', telefonnummer: '', email: '', reservationVon: '', reservationBis: '' })
            setFormErrors([])
            // Kalender zum aktuellen Monat zurücksetzen
            goToCurrentMonth()
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          disabled={verfuegbareFahrraeder.length === 0}
        >
          {showForm ? '✗ Abbrechen' : '➕ Ausleihen'}
        </button>
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{statistiken.gesamt}</div>
          <div className="text-sm text-gray-600">Fahrräder gesamt</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">{statistiken.verfuegbar}</div>
          <div className="text-sm text-gray-600">Verfügbar</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-orange-600">{statistiken.aktiveAusleihen}</div>
          <div className="text-sm text-gray-600">Aktive Ausleihen</div>
        </div>
      </div>

      {/* Neue Ausleihe Formular */}
       {showForm && verfuegbareFahrraeder.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900">🎯 Bitte ausfüllen...</h3>
          <br />

          {/* Moderne Fehlermeldung */}
          {formErrors.length > 0 && (
            <div className="error-message bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    🚫 Bitte vervollständigen Sie das Formular
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p className="mb-2">Folgende Pflichtfelder müssen ausgefüllt werden:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {formErrors.map((error, index) => (
                        <li key={index} className="font-medium">• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fahrrad auswählen *</label>
                <select
                  name="fahrradId"
                  required
                  value={formData.fahrradId}
                  onChange={(e) => setFormData({ ...formData, fahrradId: e.target.value })}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white ${
                    formData.fahrradId === '' ? 'text-gray-500' : 'text-gray-900'
                  }`}
                >
                  <option value="" disabled hidden className="text-gray-500">
                    Fahrrad auswählen
                  </option>
                  {verfuegbareFahrraeder.map(fahrrad => (
                    <option key={fahrrad.id} value={fahrrad.id} className="text-gray-900">
                      {fahrrad.name} - {fahrrad.hersteller} ({fahrrad.typ}) 
                      {fahrrad.istEBike && ' ⚡'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="Vor- und Nachname eingeben..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefonnummer</label>
                <input
                  name="telefonnummer"
                  type="tel"
                  value={formData.telefonnummer}
                  onChange={(e) => setFormData({ ...formData, telefonnummer: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="z.B. +41 79 123 45 67"
                />
              </div>
              
              {/* Erweiterter Date Range Picker mit Monatsnavigation */}
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">📅 Reservierungszeitraum * <span className="text-xs text-gray-500">(Wochentage Mo-Fr)</span></label>
                
                {/* Date Range Display */}
                <div 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer bg-white hover:border-blue-400 transition-colors"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">📅</span>
                      <span className={formData.reservationVon && formData.reservationBis ? 'text-gray-900' : 'text-gray-500'}>
                        {formData.reservationVon && formData.reservationBis 
                          ? `${formatDate(formData.reservationVon)} - ${formatDate(formData.reservationBis)}`
                          : 'Zeitraum auswählen...'
                        }
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Erweiterter Custom Calendar */}
                {showDatePicker && (
                  <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-80">
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">
                          {!formData.reservationVon ? 'Startdatum' : !formData.reservationBis ? 'Enddatum' : 'Zeitraum'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowDatePicker(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        {!formData.reservationVon 
                          ? 'Wählen Sie das Startdatum (Mo-Fr)'
                          : !formData.reservationBis 
                          ? 'Wählen Sie das Enddatum (Mo-Fr)'
                          : `${calculateDays(formData.reservationVon, formData.reservationBis)} Tag(e) ausgewählt`
                        }
                      </p>
                    </div>
                    
                    {/* Monatsnavigation */}
                    <div className="flex items-center justify-between mb-3 py-2 border-b border-gray-200">
                      <button
                        type="button"
                        onClick={goToPreviousMonth}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Vorheriger Monat"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-800">
                          {monthNames[currentMonth]} {currentYear}
                        </span>
                        {!isCurrentMonth() && (
                          <button
                            type="button"
                            onClick={goToCurrentMonth}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                            title="Zum aktuellen Monat"
                          >
                            Heute
                          </button>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={goToNextMonth}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Nächster Monat"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Calendar Header */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* KORRIGIERTE Calendar Days mit einheitlicher Wochenend-Markierung */}
                    <div className="grid grid-cols-7 gap-1 mb-3">
                      {generateCalendarDays().map((date, index) => {
                        // Leere Zellen für Wochentagsanordnung
                        if (date === null) {
                          return <div key={index} className="w-8 h-8"></div>
                        }
                        
                        const year = date.getFullYear()
                        const month = String(date.getMonth() + 1).padStart(2, '0')
                        const day = String(date.getDate()).padStart(2, '0')
                        const dateString = `${year}-${month}-${day}`
                        
                        const isToday = dateString === heute
                        const isPast = dateString < heute
                        const isSelected = isDateSelected(date)
                        const isInRange = isDateInRange(date)
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6
                        
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleDateClick(date)}
                            disabled={isPast || isWeekend}
                            className={`
                              w-8 h-8 text-xs rounded transition-all duration-200 flex items-center justify-center font-medium border-2
                              ${isPast && !isWeekend
                                ? 'text-gray-400 cursor-not-allowed bg-gray-50 line-through border-gray-200' 
                                : isPast && isWeekend
                                ? 'text-red-300 cursor-not-allowed bg-red-50 line-through border-red-200'
                                : !isPast && isWeekend
                                ? 'text-red-500 cursor-not-allowed bg-red-50 border-red-200'
                                : 'hover:bg-blue-100 cursor-pointer text-gray-900 bg-white hover:text-blue-800 hover:scale-105 border-gray-200'
                              }
                              ${isToday && !isSelected && !isWeekend && !isPast ? 'bg-blue-100 text-blue-700 font-bold ring-2 ring-blue-300' : ''}
                              ${isSelected ? 'bg-blue-600 text-white font-bold shadow-lg ring-2 ring-blue-400 scale-110 transform border-blue-700' : ''}
                              ${isInRange && !isSelected && !isWeekend ? 'bg-blue-200 text-blue-900 font-semibold' : ''}
                            `}
                          >
                            <span className={isSelected ? 'font-black' : ''}>
                              {date.getDate()}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      {formData.reservationVon && formData.reservationBis ? (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, reservationVon: '', reservationBis: '' })}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Zurücksetzen
                        </button>
                      ) : (
                        <div></div>
                      )}
                      
                      {formData.reservationVon && formData.reservationBis && (
                        <button
                          type="button"
                          onClick={() => setShowDatePicker(false)}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Fertig
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Date Range Info */}
                {formData.reservationVon && formData.reservationBis && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700">
                      📊 <span className="font-semibold">{calculateDays(formData.reservationVon, formData.reservationBis)} Tag(e)</span> ausgewählt
                      <span className="ml-2 text-xs">({formatDate(formData.reservationVon)} bis {formatDate(formData.reservationBis)})</span>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  placeholder="beispiel@email.com"
                />
              </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                disabled={loading}
              >
                {loading ? '⏳ Wird erstellt...' : '🎯 Fahrrad ausleihen'}
              </button>
            </div>
          </form>
        </div>
      )}

      {verfuegbareFahrraeder.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">⚠️ Keine Fahrräder verfügbar. Alle Fahrräder sind aktuell verliehen.</p>
        </div>
      )}

      {/* Fahrräder Übersicht */}
      <div className="bg-white rounded-lg shadow p-6 relative">
        <div className="flex justify-between items-center mb-4 relative">
          <h3 className="text-lg font-bold text-gray-900">🚲 Übersicht & Status</h3>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-800 bg-white relative shadow-lg"
              style={{ position: 'relative', zIndex: 9999 }}
            >
              <option value="alle">Alle anzeigen</option>
              <option value="verfuegbar">Nur verfügbare</option>
              <option value="verliehen">Nur verliehene</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hersteller</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Typ</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Zustand</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">E-Bike</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {gefiltFahrraeder.map((fahrrad) => (
                <tr key={fahrrad.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${fahrrad.status === 'FREI' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm ${fahrrad.status === 'FREI' ? 'text-green-600' : 'text-red-600'}`}>
                        {fahrrad.status === 'FREI' ? 'Verfügbar' : 'Verliehen'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{fahrrad.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{fahrrad.hersteller}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{fahrrad.typ}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{fahrrad.zustand}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {fahrrad.istEBike ? '⚡ Ja' : 'Nein'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {gefiltFahrraeder.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              Keine Fahrräder gefunden.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}