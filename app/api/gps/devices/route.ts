// GET  /api/gps/devices   → list all devices with latest position
// POST /api/gps/devices   → create a new device (admin only)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'

const OFFLINE_THRESHOLD_MS = 5 * 60 * 1000 // 5 min

export async function GET() {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const devices = await prisma.gpsDevice.findMany({ orderBy: { createdAt: 'asc' } })

  const now = Date.now()
  const enriched = devices.map((d) => ({
    ...d,
    isOnline: d.lastUpdate
      ? now - new Date(d.lastUpdate).getTime() < OFFLINE_THRESHOLD_MS
      : false,
  }))

  return NextResponse.json(enriched)
}

export async function POST(req: NextRequest) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { carSlug, label } = body
  if (!carSlug) return NextResponse.json({ error: 'carSlug is required' }, { status: 400 })

  const car = await prisma.car.findUnique({ where: { slug: carSlug } })
  if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })

  try {
    const device = await prisma.gpsDevice.create({
      data: { carSlug, label: label ?? car.name },
    })
    return NextResponse.json(device, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Device already exists for this car' }, { status: 409 })
  }
}
