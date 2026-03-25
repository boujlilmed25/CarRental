// GET /api/gps/public/[slug]
// Public endpoint — returns only safe status info (no device token, no raw data)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const OFFLINE_THRESHOLD_MS = 5 * 60 * 1000

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const device = await prisma.gpsDevice.findUnique({
    where: { carSlug: params.slug },
    select: {
      id: true,
      isActive: true,
      isOnline: true,
      isMoving: true,
      lastLat: true,
      lastLng: true,
      lastSpeed: true,
      lastHeading: true,
      lastUpdate: true,
    },
  })

  if (!device || !device.isActive) {
    return NextResponse.json(null)
  }

  const now = Date.now()
  const isOnline = device.lastUpdate
    ? now - new Date(device.lastUpdate).getTime() < OFFLINE_THRESHOLD_MS
    : false

  return NextResponse.json({
    ...device,
    isOnline,
    lastUpdate: device.lastUpdate?.toISOString() ?? null,
    // Never expose the device token here
  })
}
