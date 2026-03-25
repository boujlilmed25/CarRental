// GET   /api/gps/alerts   → list unread alerts
// PATCH /api/gps/alerts   → mark all as read
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminGuard'

export async function GET() {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const alerts = await prisma.gpsAlert.findMany({
    where: { isRead: false },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(alerts)
}

export async function PATCH() {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  await prisma.gpsAlert.updateMany({ data: { isRead: true } })
  return NextResponse.json({ ok: true })
}
