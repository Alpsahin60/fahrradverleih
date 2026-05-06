import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding der Datenbank beginnt...')

  // Alle bestehenden Daten löschen
  await prisma.ausleihe.deleteMany()
  await prisma.fahrrad.deleteMany()

  // 20 moderne Fahrräder erstellen
  const fahrraeder = await prisma.fahrrad.createMany({
    data: [
      {
        name: 'Trek X-Caliber 9',
        hersteller: 'Trek',
        status: 'FREI',
        zustand: 'Neu',
        typ: 'Mountainbike',
        istEBike: false
      },
      {
        name: 'Specialized Turbo Vado SL',
        hersteller: 'Specialized',
        status: 'FREI',
        zustand: 'Sehr gut',
        typ: 'E-Bike',
        istEBike: true
      },
      {
        name: 'Giant TCR Advanced Pro',
        hersteller: 'Giant',
        status: 'FREI',
        zustand: 'Neu',
        typ: 'Rennrad',
        istEBike: false
      },
      {
        name: 'Cannondale Quick CX 3',
        hersteller: 'Cannondale',
        status: 'FREI',
        zustand: 'Gut',
        typ: 'Crossbike',
        istEBike: false
      },
      {
        name: 'Cube Kathmandu Hybrid Pro',
        hersteller: 'Cube',
        status: 'FREI',
        zustand: 'Sehr gut',
        typ: 'E-Bike',
        istEBike: true
      },
      {
        name: 'Scott Spark 940',
        hersteller: 'Scott',
        status: 'FREI',
        zustand: 'Gebraucht',
        typ: 'Mountainbike',
        istEBike: false
      },
      {
        name: 'Bulls Cross Lite E',
        hersteller: 'Bulls',
        status: 'FREI',
        zustand: 'Neu',
        typ: 'E-Bike',
        istEBike: true
      },
      {
        name: 'Merida Big Nine 500',
        hersteller: 'Merida',
        status: 'FREI',
        zustand: 'Sehr gut',
        typ: 'Mountainbike',
        istEBike: false
      },
      {
        name: 'KTM Macina Tour 510',
        hersteller: 'KTM',
        status: 'FREI',
        zustand: 'Neu',
        typ: 'E-Bike',
        istEBike: true
      },
      {
        name: 'Haibike SDURO HardSeven',
        hersteller: 'Haibike',
        status: 'FREI',
        zustand: 'Gut',
        typ: 'E-Bike',
        istEBike: true
      },
      {
        name: 'Rose Granite Chief',
        hersteller: 'Rose',
        status: 'FREI',
        zustand: 'Sehr gut',
        typ: 'Trekkingbike',
        istEBike: false
      },
      {
        name: 'Bergamont E-Horizon Elite',
        hersteller: 'Bergamont',
        status: 'FREI',
        zustand: 'Neu',
        typ: 'E-Bike',
        istEBike: true
      },
      {
        name: 'Focus Jam 6.8',
        hersteller: 'Focus',
        status: 'FREI',
        zustand: 'Gebraucht',
        typ: 'Enduro',
        istEBike: false
      },
      {
        name: 'Riese & Müller Charger3',
        hersteller: 'Riese & Müller',
        status: 'FREI',
        zustand: 'Neu',
        typ: 'E-Bike',
        istEBike: true
      },
      {
        name: 'Canyon Spectral CF 8',
        hersteller: 'Canyon',
        status: 'FREI',
        zustand: 'Sehr gut',
        typ: 'Enduro',
        istEBike: false
      },
      {
        name: 'Flyer Gotour6 5.00',
        hersteller: 'Flyer',
        status: 'FREI',
        zustand: 'Gut',
        typ: 'E-Bike',
        istEBike: true
      },
      {
        name: 'YT Capra 29',
        hersteller: 'YT Industries',
        status: 'FREI',
        zustand: 'Neu',
        typ: 'Enduro',
        istEBike: false
      },
      {
        name: 'Kalkhoff Agattu 3.B XXL',
        hersteller: 'Kalkhoff',
        status: 'FREI',
        zustand: 'Sehr gut',
        typ: 'E-Bike',
        istEBike: true
      },
      {
        name: 'Santa Cruz Hightower',
        hersteller: 'Santa Cruz',
        status: 'FREI',
        zustand: 'Gebraucht',
        typ: 'Mountainbike',
        istEBike: false
      },
      {
        name: 'Gazelle Ultimate C8+ HMB',
        hersteller: 'Gazelle',
        status: 'FREI',
        zustand: 'Neu',
        typ: 'E-Bike',
        istEBike: true
      }
    ]
  })

  console.log(`✅ ${fahrraeder.count} Fahrräder erstellt`)
  console.log('🌱 Seeding abgeschlossen!')
}

main()
  .catch((e) => {
    console.error('❌ Fehler beim Seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })