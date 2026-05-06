export interface Fahrrad {
  id: string
  name: string
  type: 'stadtrad' | 'ebike' | 'mountainbike' | 'rennrad'
  preis: number
  verfügbar: boolean
  ausgebuchtBis?: Date
  beschreibung: string
  features: string[]
  bildUrl: string
  standort: string
}

export interface Buchung {
  id: string
  fahrradId: string
  kundenName: string
  kundenEmail: string
  startDatum: Date
  endDatum: Date
  gesamtpreis: number
  status: 'aktiv' | 'beendet' | 'storniert'
  abgeholt: boolean
}

export interface KundenDaten {
  name: string
  email: string
  telefon: string
  ausweis: string
}