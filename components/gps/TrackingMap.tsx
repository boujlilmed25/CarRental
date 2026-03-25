'use client'

import { useEffect, useRef } from 'react'

export type VehicleMarkerData = {
  id: string
  carSlug: string
  label: string
  lat: number
  lng: number
  speed: number
  heading: number
  isOnline: boolean
  isMoving: boolean
  lastUpdate: string | null
}

type TrackingMapProps = {
  vehicles: VehicleMarkerData[]
  selectedId: string | null
  onSelectVehicle: (id: string) => void
  historyPoints?: { lat: number; lng: number }[]
}

// Status color mapping
function getStatusColor(v: VehicleMarkerData): string {
  if (!v.isOnline) return '#6B7280'   // gray — offline
  if (v.isMoving) return '#22C55E'    // green — moving
  return '#F59E0B'                     // amber — idle/parked
}

function buildCarIcon(color: string, heading: number): string {
  // SVG car icon with rotation based on heading
  const rotate = heading ?? 0
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <g transform="rotate(${rotate}, 18, 18)">
        <circle cx="18" cy="18" r="16" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="1.5"/>
        <path d="M18 6 L24 26 L18 22 L12 26 Z" fill="${color}" stroke="white" stroke-width="1"/>
      </g>
    </svg>
  `
}

export default function TrackingMap({
  vehicles,
  selectedId,
  onSelectVehicle,
  historyPoints = [],
}: TrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  // Store leaflet instances in refs to avoid re-renders
  const leafletMapRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const polylineRef = useRef<any>(null)

  // Initialize map once
  useEffect(() => {
    if (leafletMapRef.current || !mapRef.current) return

    // Dynamically import Leaflet (no SSR)
    ;(async () => {
      const L = (await import('leaflet')).default

      // Fix default icon paths for Next.js / webpack
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [33.9716, -6.8498], // Rabat, Morocco
        zoom: 7,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      leafletMapRef.current = map
    })()

    return () => {
      leafletMapRef.current?.remove()
      leafletMapRef.current = null
    }
  }, [])

  // Update vehicle markers when data changes
  useEffect(() => {
    if (!leafletMapRef.current) return

    ;(async () => {
      const L = (await import('leaflet')).default
      const map = leafletMapRef.current

      const currentIds = new Set(vehicles.map((v) => v.id))

      // Remove markers for deleted devices
      markersRef.current.forEach((marker, id) => {
        if (!currentIds.has(id)) {
          map.removeLayer(marker)
          markersRef.current.delete(id)
        }
      })

      // Add/update markers
      for (const vehicle of vehicles) {
        const color = getStatusColor(vehicle)
        const svgHtml = buildCarIcon(color, vehicle.heading ?? 0)

        const icon = L.divIcon({
          html: svgHtml,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -18],
        })

        const lastUpdateStr = vehicle.lastUpdate
          ? new Date(vehicle.lastUpdate).toLocaleTimeString('fr-MA')
          : 'Jamais'

        const popupHtml = `
          <div style="font-family:sans-serif;min-width:160px">
            <strong style="font-size:14px">${vehicle.label}</strong><br/>
            <span style="color:${color};font-weight:600">${vehicle.isOnline ? (vehicle.isMoving ? '🟢 En mouvement' : '🟡 Arrêté') : '⚫ Hors ligne'}</span><br/>
            <small>Vitesse: ${Math.round(vehicle.speed ?? 0)} km/h</small><br/>
            <small>Mise à jour: ${lastUpdateStr}</small>
          </div>
        `

        if (markersRef.current.has(vehicle.id)) {
          const marker = markersRef.current.get(vehicle.id)
          marker.setLatLng([vehicle.lat, vehicle.lng])
          marker.setIcon(icon)
          marker.getPopup()?.setContent(popupHtml)
        } else {
          const marker = L.marker([vehicle.lat, vehicle.lng], { icon })
            .addTo(map)
            .bindPopup(popupHtml)

          marker.on('click', () => onSelectVehicle(vehicle.id))
          markersRef.current.set(vehicle.id, marker)
        }
      }
    })()
  }, [vehicles, onSelectVehicle])

  // Highlight selected vehicle
  useEffect(() => {
    if (!leafletMapRef.current || !selectedId) return
    const marker = markersRef.current.get(selectedId)
    if (marker) {
      leafletMapRef.current.setView(marker.getLatLng(), 15, { animate: true })
      marker.openPopup()
    }
  }, [selectedId])

  // Draw history polyline
  useEffect(() => {
    if (!leafletMapRef.current) return

    ;(async () => {
      const L = (await import('leaflet')).default
      const map = leafletMapRef.current

      if (polylineRef.current) {
        map.removeLayer(polylineRef.current)
        polylineRef.current = null
      }

      if (historyPoints.length > 1) {
        const latlngs = historyPoints.map((p) => [p.lat, p.lng] as [number, number])
        polylineRef.current = L.polyline(latlngs, {
          color: '#6366F1',
          weight: 3,
          opacity: 0.8,
        }).addTo(map)

        map.fitBounds(polylineRef.current.getBounds(), { padding: [40, 40] })
      }
    })()
  }, [historyPoints])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', minHeight: 400 }}
      className="rounded-xl overflow-hidden z-0"
    />
  )
}
