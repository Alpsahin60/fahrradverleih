'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Fahrrad, Buchung, KundenDaten } from './types'
import { fahrraederData, buchungenData } from './data'

interface FahrradverleihContextType {
  fahrraeder: Fahrrad[]
  buchungen: Buchung[]
  neuesBuchung: (fahrradId: string, kundendaten: KundenDaten, startDatum: Date, endDatum: Date) => Promise<boolean>
  buchungStornieren: (buchungId: string) => boolean
  getFahrradById: (id: string) => Fahrrad | undefined
  getVerfügbareFahrräder: () => Fahrrad[]
  getAusgebuchteFahrräder: () => Fahrrad[]
  getKundenBuchungen: (email: string) => Buchung[]
}

const FahrradverleihContext = createContext<FahrradverleihContextType | undefined>(undefined)

export const FahrradverleihProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fahrraeder, setFahrraeder] = useState<Fahrrad[]>(fahrraederData)
  const [buchungen, setBuchungen] = useState<Buchung[]>(buchungenData)

  // Verfügbarkeit automatisch updaten
  useEffect(() => {
    const updateAvailability = () => {
      const jetzt = new Date()
      setFahrraeder(prev => 
        prev.map(fahrrad => {
          const aktiveBuchung = buchungen.find(b => 
            b.fahrradId === fahrrad.id && 
            b.status === 'aktiv' && 
            b.startDatum <= jetzt && 
            b.endDatum > jetzt
          )
          
          if (aktiveBuchung) {
            return { 
              ...fahrrad, 
              verfügbar: false, 
              ausgebuchtBis: aktiveBuchung.endDatum 
            }
          } else {
            return { 
              ...fahrrad, 
              verfügbar: true, 
              ausgebuchtBis: undefined 
            }
          }
        })
      )
    }

    updateAvailability()
    const interval = setInterval(updateAvailability, 60000) // Alle Minute prüfen
    return () => clearInterval(interval)
  }, [buchungen])

  const neuesBuchung = async (
    fahrradId: string, 
    kundendaten: KundenDaten, 
    startDatum: Date, 
    endDatum: Date
  ): Promise<boolean> => {
    const fahrrad = fahrraeder.find(f => f.id === fahrradId)
    if (!fahrrad || !fahrrad.verfügbar) {
      return false
    }

    const tage = Math.ceil((endDatum.getTime() - startDatum.getTime()) / (1000 * 60 * 60 * 24))
    const gesamtpreis = tage * fahrrad.preis

    const neueBuchung: Buchung = {
      id: 'b' + Date.now(),
      fahrradId,
      kundenName: kundendaten.name,
      kundenEmail: kundendaten.email,
      startDatum,
      endDatum,
      gesamtpreis,
      status: 'aktiv',
      abgeholt: false
    }

    setBuchungen(prev => [...prev, neueBuchung])
    
    // Simulation: API-Call dauert etwas
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return true
  }

  const buchungStornieren = (buchungId: string): boolean => {
    setBuchungen(prev => 
      prev.map(buchung => 
        buchung.id === buchungId 
          ? { ...buchung, status: 'storniert' as const }
          : buchung
      )
    )
    return true
  }

  const getFahrradById = (id: string): Fahrrad | undefined => {
    return fahrraeder.find(f => f.id === id)
  }

  const getVerfügbareFahrräder = (): Fahrrad[] => {
    return fahrraeder.filter(f => f.verfügbar)
  }

  const getAusgebuchteFahrräder = (): Fahrrad[] => {
    return fahrraeder.filter(f => !f.verfügbar)
  }

  const getKundenBuchungen = (email: string): Buchung[] => {
    return buchungen.filter(b => b.kundenEmail === email && b.status === 'aktiv')
  }

  return (
    <FahrradverleihContext.Provider value={{
      fahrraeder,
      buchungen,
      neuesBuchung,
      buchungStornieren,
      getFahrradById,
      getVerfügbareFahrräder,
      getAusgebuchteFahrräder,
      getKundenBuchungen
    }}>
      {children}
    </FahrradverleihContext.Provider>
  )
}

export const useFahrradverleih = (): FahrradverleihContextType => {
  const context = useContext(FahrradverleihContext)
  if (!context) {
    throw new Error('useFahrradverleih must be used within a FahrradverleihProvider')
  }
  return context
}