import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import { COOKIE_NAME } from '@/lib/auth'
import AdminShell from '../_ui/AdminShell'
import { prisma } from '@/lib/prisma'
import TrackingDashboard from './TrackingDashboard'

export default async function TrackingPage() {
  // Server-side auth check
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) redirect('/admin')
  try { await verifyAdminToken(token) } catch { redirect('/admin') }

  // Load devices with car info
  const devices = await prisma.gpsDevice.findMany({
    orderBy: { createdAt: 'asc' },
  })

  const cars = await prisma.car.findMany({
    where: { active: true },
    select: { slug: true, name: true, imageUrl: true, city: true },
    orderBy: { name: 'asc' },
  })

  const unreadAlerts = await prisma.gpsAlert.count({ where: { isRead: false } })

  const serialized = devices.map((d) => ({
    ...d,
    lastUpdate: d.lastUpdate?.toISOString() ?? null,
    createdAt: d.createdAt.toISOString(),
  }))

  return (
    <AdminShell>
      <TrackingDashboard
        initialDevices={serialized}
        cars={cars}
        unreadAlerts={unreadAlerts}
      />
    </AdminShell>
  )
}
