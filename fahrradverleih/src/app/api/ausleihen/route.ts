import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Alle Ausleihen abrufen
export async function GET() {
  try {
    const ausleihen = await prisma.ausleihe.findMany({
      include: {
        fahrrad: true
      },
      orderBy: {
        datum: 'desc'
      }
    })
    return NextResponse.json(ausleihen)
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Laden der Ausleihen' }, { status: 500 })
  }
}

// POST - Neue Ausleihe erstellen
export async function POST(request: NextRequest) {
  try {
    const { fahrradId, name, telefonnummer, email } = await request.json()

    // Prüfen ob Fahrrad verfügbar ist
    const fahrrad = await prisma.fahrrad.findUnique({
      where: { id: fahrradId }
    })

    if (!fahrrad) {
      return NextResponse.json({ error: 'Fahrrad nicht gefunden' }, { status: 404 })
    }

    if (fahrrad.status === 'BELEGT') {
      return NextResponse.json({ error: 'Fahrrad ist bereits verliehen' }, { status: 400 })
    }

    // Ausleihe erstellen
    const ausleihe = await prisma.ausleihe.create({
      data: {
        fahrradId,
        name,
        telefonnummer,
        email,
        status: 'AKTIV'
      },
      include: {
        fahrrad: true
      }
    })

    // Fahrrad Status auf BELEGT setzen
    await prisma.fahrrad.update({
      where: { id: fahrradId },
      data: { status: 'BELEGT' }
    })

    return NextResponse.json(ausleihe, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Erstellen der Ausleihe' }, { status: 500 })
  }
}