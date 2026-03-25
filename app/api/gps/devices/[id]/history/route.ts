// GET /api/gps/devices/[id]/history?hours=24
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { searchParams } = new URL(req.url)
  const hours = Math.min(parseInt(searchParams.get('hours') ?? '24', 10), 168) // max 7 days

  const since = new Date(Date.now() - hours * 60 * 60 * 1000)

  const positions = await prisma.gpsPosition.findMany({
    where: { deviceId: params.id, timestamp: { gte: since } },
    orderBy: { timestamp: 'asc' },
    take: 2000,
  })

  return NextResponse.json(positions)
}
