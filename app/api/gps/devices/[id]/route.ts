// PATCH  /api/gps/devices/[id]  → update label / isActive
// DELETE /api/gps/devices/[id]  → remove device
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { label, isActive } = body

  const device = await prisma.gpsDevice.update({
    where: { id: params.id },
    data: {
      ...(label !== undefined && { label }),
      ...(isActive !== undefined && { isActive }),
    },
  })

  return NextResponse.json(device)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  await prisma.gpsDevice.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
