import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Ausleihe aktualisieren (für Rückgabe)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await request.json()
    const { id } = await params

    const ausleihe = await prisma.ausleihe.update({
      where: { id: id },
      data: {
        status,
        rueckgabeDatum: status === 'ZURUECKGEGEBEN' ? new Date() : null
      },
      include: {
        fahrrad: true
      }
    })

    // Wenn zurückgegeben, Fahrrad wieder als FREI markieren
    if (status === 'ZURUECKGEGEBEN') {
      await prisma.fahrrad.update({
        where: { id: ausleihe.fahrradId },
        data: { status: 'FREI' }
      })
    }

    return NextResponse.json(ausleihe)
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Aktualisieren der Ausleihe' }, { status: 500 })
  }
}