import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PublicTrackingClient from './PublicTrackingClient'

type Props = { params: { slug: string } }

export default async function PublicTrackPage({ params }: Props) {
  const { slug } = params

  const [car, device] = await Promise.all([
    prisma.car.findUnique({
      where: { slug },
      select: { slug: true, name: true, imageUrl: true, city: true, active: true },
    }),
    prisma.gpsDevice.findUnique({
      where: { carSlug: slug },
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
    }),
  ])

  if (!car || !car.active) notFound()

  // Don't expose device token on public page
  return (
    <PublicTrackingClient
      car={{ ...car, imageUrl: car.imageUrl ?? null }}
      device={
        device
          ? {
              ...device,
              lastUpdate: device.lastUpdate?.toISOString() ?? null,
            }
          : null
      }
    />
  )
}
