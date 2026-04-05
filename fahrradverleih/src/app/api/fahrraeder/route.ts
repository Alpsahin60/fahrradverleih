import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Alle Fahrräder abrufen
export async function GET() {
  try {
    const fahrraeder = await prisma.fahrrad.findMany({
      include: {
        ausleihen: {
          where: {
            status: 'AKTIV'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(fahrraeder)
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Laden der Fahrräder' }, { status: 500 })
  }
}

// POST - Neues Fahrrad erstellen
export async function POST(request: NextRequest) {
  try {
    const { name, hersteller, zustand, typ, istEBike } = await request.json()

    const fahrrad = await prisma.fahrrad.create({
      data: {
        name,
        hersteller,
        zustand,
        typ,
        istEBike: istEBike || false,
        status: 'FREI'
      }
    })

    return NextResponse.json(fahrrad, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Erstellen des Fahrrads' }, { status: 500 })
  }
}