// POST /api/gps/ping
// Called by GPS hardware device to submit a new position.
// Requires header: Authorization: Bearer <deviceToken>
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const OFFLINE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes
const MOVING_SPEED_THRESHOLD = 2 // km/h

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 })
  }

  const device = await prisma.gpsDevice.findUnique({ where: { deviceToken: token } })
  if (!device || !device.isActive) {
    return NextResponse.json({ error: 'Device not found or inactive' }, { status: 403 })
  }

  let body: {
    lat: number
    lng: number
    speed?: number
    heading?: number
    ignition?: boolean
    accuracy?: number
    altitude?: number
    battery?: number
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { lat, lng, speed, heading, ignition, accuracy, altitude, battery } = body

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return NextResponse.json({ error: 'lat and lng are required numbers' }, { status: 400 })
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
  }

  const now = new Date()
  const isMoving = (speed ?? 0) >= MOVING_SPEED_THRESHOLD

  // Store position
  await prisma.gpsPosition.create({
    data: {
      deviceId: device.id,
      lat,
      lng,
      speed: speed ?? 0,
      heading: heading ?? null,
      ignition: ignition ?? null,
      accuracy: accuracy ?? null,
      altitude: altitude ?? null,
      battery: battery ?? null,
      timestamp: now,
    },
  })

  // Update device cached state
  await prisma.gpsDevice.update({
    where: { id: device.id },
    data: {
      lastLat: lat,
      lastLng: lng,
      lastSpeed: speed ?? 0,
      lastHeading: heading ?? null,
      lastIgnition: ignition ?? null,
      lastUpdate: now,
      isOnline: true,
      isMoving,
    },
  })

  // Overspeed alert (> 120 km/h)
  if (speed && speed > 120) {
    await prisma.gpsAlert.create({
      data: {
        carSlug: device.carSlug,
        type: 'overspeed',
        message: `Vitesse excessive: ${Math.round(speed)} km/h`,
        lat,
        lng,
      },
    })
  }

  return NextResponse.json({ ok: true })
}
