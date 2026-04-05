import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Fahrrad aktualisieren
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, hersteller, zustand, typ, istEBike } = await request.json()
    
    const fahrrad = await prisma.fahrrad.update({
      where: { id: params.id },
      data: {
        name,
        hersteller,
        zustand,
        typ,
        istEBike
      }
    })

    return NextResponse.json(fahrrad)
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Fahrrads' }, { status: 500 })
  }
}

// DELETE - Fahrrad löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.fahrrad.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Fahrrad gelöscht' })
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Löschen des Fahrrads' }, { status: 500 })
  }
}