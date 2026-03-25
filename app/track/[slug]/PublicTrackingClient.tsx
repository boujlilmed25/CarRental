'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback } from 'react'
import type { VehicleMarkerData } from '@/components/gps/TrackingMap'

const TrackingMap = dynamic(() => import('@/components/gps/TrackingMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-white/40 text-sm">Chargement de la carte…</div>
    </div>
  ),
})

type Car = {
  slug: string
  name: string
  imageUrl: string | null
  city: string
}

type DeviceState = {
  id: string
  isActive: boolean
  isOnline: boolean
  isMoving: boolean
  lastLat: number | null
  lastLng: number | null
  lastSpeed: number | null
  lastHeading: number | null
  lastUpdate: string | null
}

type Props = {
  car: Car
  device: DeviceState | null
}

const POLL_INTERVAL = 15_000 // 15 sec public polling

function timeSince(iso: string | null) {
  if (!iso) return 'Jamais'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'À l\'instant'
  if (mins < 60) return `Il y a ${mins} min`
  const hrs = Math.floor(mins / 60)
  return hrs < 24 ? `Il y a ${hrs}h` : `Il y a ${Math.floor(hrs / 24)}j`
}

export default function PublicTrackingClient({ car, device: initialDevice }: Props) {
  const [device, setDevice] = useState<DeviceState | null>(initialDevice)

  // Public polling via a dedicated public API endpoint
  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/gps/public/${car.slug}`)
      if (res.ok) {
        const data = await res.json()
        setDevice(data)
      }
    } catch { /* silent */ }
  }, [car.slug])

  useEffect(() => {
    const timer = setInterval(refresh, POLL_INTERVAL)
    return () => clearInterval(timer)
  }, [refresh])

  const hasPosition = device?.lastLat != null && device?.lastLng != null

  const marker: VehicleMarkerData | null =
    device && hasPosition
      ? {
          id: device.id,
          carSlug: car.slug,
          label: car.name,
          lat: device.lastLat!,
          lng: device.lastLng!,
          speed: device.lastSpeed ?? 0,
          heading: device.lastHeading ?? 0,
          isOnline: device.isOnline,
          isMoving: device.isMoving,
          lastUpdate: device.lastUpdate,
        }
      : null

  const statusColor = !device?.isOnline ? '#6B7280' : device.isMoving ? '#22C55E' : '#F59E0B'
  const statusText = !device?.isOnline ? 'Hors ligne' : device.isMoving ? 'En mouvement' : 'Arrêté'

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 border-b border-white/10 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {car.imageUrl && (
            <img
              src={car.imageUrl}
              alt={car.name}
              className="h-12 w-16 object-cover rounded-lg flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold truncate">{car.name}</h1>
            <p className="text-sm text-white/40">{car.city}</p>
          </div>
          <a
            href="/"
            className="text-sm text-white/40 hover:text-white transition-colors flex-shrink-0"
          >
            BoujlilCar
          </a>
        </div>
      </header>

      {/* Status bar */}
      <div className="bg-gray-900/50 px-4 py-2.5 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full flex-shrink-0 animate-pulse"
              style={{ background: statusColor }}
            />
            <span style={{ color: statusColor }} className="font-medium">
              {!device ? 'Pas de dispositif GPS' : statusText}
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/40 text-xs">
            {device?.lastSpeed != null && (
              <span>🚀 {Math.round(device.lastSpeed)} km/h</span>
            )}
            <span>⏱ {timeSince(device?.lastUpdate ?? null)}</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ minHeight: '60vh' }}>
        {!device || !hasPosition ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/30">
            <span className="text-5xl">📍</span>
            <p className="text-lg font-medium">
              {!device ? 'Suivi GPS non disponible' : 'En attente de la première position…'}
            </p>
            <p className="text-sm text-white/20">
              {!device
                ? 'Ce véhicule ne dispose pas encore d\'un tracker GPS.'
                : 'Le véhicule n\'a pas encore transmis sa position.'}
            </p>
          </div>
        ) : (
          <TrackingMap
            vehicles={marker ? [marker] : []}
            selectedId={marker?.id ?? null}
            onSelectVehicle={() => {}}
            historyPoints={[]}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="px-4 py-3 bg-gray-900/80 border-t border-white/10 text-center text-xs text-white/20">
        La position est mise à jour toutes les 15 secondes · BoujlilCar Location
      </footer>
    </div>
  )
}
