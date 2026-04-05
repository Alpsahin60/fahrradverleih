import { Fahrrad, Buchung } from './types'

// Mock-Daten für Fahrräder
export const fahrraederData: Fahrrad[] = [
  {
    id: '1',
    name: 'München City Cruiser',
    type: 'stadtrad',
    preis: 8,
    verfügbar: true,
    beschreibung: 'Komfortables Stadtrad perfekt für Touren durch München',
    features: ['7-Gang Schaltung', 'LED-Beleuchtung', 'Gepäckträger', 'Klingel'],
    bildUrl: '🚴‍♀️',
    standort: 'Marienplatz'
  },
  {
    id: '2',
    name: 'München City Cruiser Pro',
    type: 'stadtrad',
    preis: 8,
    verfügbar: false,
    ausgebuchtBis: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    beschreibung: 'Premium Stadtrad mit extra Komfort',
    features: ['21-Gang Schaltung', 'LED-Beleuchtung', 'Gepäckträger', 'Korb'],
    bildUrl: '🚴‍♀️',
    standort: 'Hauptbahnhof'
  },
  {
    id: '3',
    name: 'E-Power München',
    type: 'ebike',
    preis: 15,
    verfügbar: true,
    beschreibung: 'Elektrisches Fahrrad für mühelose Fahrten',
    features: ['Bosch Motor', '70km Reichweite', 'USB-Ladeanschluss', 'GPS-Tracking'],
    bildUrl: '⚡',
    standort: 'Sendlinger Tor'
  },
  {
    id: '4',
    name: 'E-Urban Deluxe',
    type: 'ebike',
    preis: 15,
    verfügbar: false,
    ausgebuchtBis: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    beschreibung: 'Premium E-Bike für die Stadt',
    features: ['Yamaha Motor', '100km Reichweite', 'Smartphone App', 'Diebstahlschutz'],
    bildUrl: '⚡',
    standort: 'Odeonsplatz'
  },
  {
    id: '5',
    name: 'Alpen Explorer',
    type: 'mountainbike',
    preis: 12,
    verfügbar: true,
    beschreibung: 'Robustes Mountainbike für Abenteuer',
    features: ['21-Gang Shimano', 'Federgabel', 'Scheibenbremsen', 'Tubeless Ready'],
    bildUrl: '🚵‍♂️',
    standort: 'Englischer Garten'
  },
  {
    id: '6',
    name: 'Trail Master',
    type: 'mountainbike',
    preis: 12,
    verfügbar: true,
    beschreibung: 'Für anspruchsvolle Trails und Touren',
    features: ['27-Gang SRAM', 'Vollgefedert', 'Hydraulische Bremsen', 'Carbon Rahmen'],
    bildUrl: '🚵‍♂️',
    standort: 'Olympiapark'
  },
  {
    id: '7',
    name: 'Speed Demon',
    type: 'rennrad',
    preis: 14,
    verfügbar: false,
    ausgebuchtBis: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    beschreibung: 'Leichtes Rennrad für sportliche Fahrer',
    features: ['Carbon Rahmen', '22-Gang Ultegra', 'Rennlenker', 'Nur 8.5kg'],
    bildUrl: '🚴‍♂️',
    standort: 'Maxvorstadt'
  },
  {
    id: '8',
    name: 'Aero Pro',
    type: 'rennrad',
    preis: 14,
    verfügbar: true,
    beschreibung: 'Aerodynamisches Rennrad für Zeitfahren',
    features: ['Aero Rahmen', '11-Gang Di2', 'Zeitfahrlenker', 'Profi-Setup'],
    bildUrl: '🚴‍♂️',
    standort: 'Schwabing'
  }
]

// Mock-Daten für aktuelle Buchungen
export const buchungenData: Buchung[] = [
  {
    id: 'b1',
    fahrradId: '2',
    kundenName: 'Max Mustermann',
    kundenEmail: 'max@email.com',
    startDatum: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endDatum: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    gesamtpreis: 24,
    status: 'aktiv',
    abgeholt: true
  },
  {
    id: 'b2',
    fahrradId: '4',
    kundenName: 'Anna Schmidt',
    kundenEmail: 'anna@email.com',
    startDatum: new Date(),
    endDatum: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    gesamtpreis: 15,
    status: 'aktiv',
    abgeholt: true
  },
  {
    id: 'b3',
    fahrradId: '7',
    kundenName: 'Tom Wagner',
    kundenEmail: 'tom@email.com',
    startDatum: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    endDatum: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    gesamtpreis: 56,
    status: 'aktiv',
    abgeholt: false
  }
]