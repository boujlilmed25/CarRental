'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { VehicleMarkerData } from '@/components/gps/TrackingMap'

// Leaflet must only render client-side (no SSR)
const TrackingMap = dynamic(() => import('@/components/gps/TrackingMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-white/5 rounded-xl">
      <div className="text-white/40 text-sm">Chargement de la carte…</div>
    </div>
  ),
})

type Device = {
  id: string
  carSlug: string
  deviceToken: string
  label: string | null
  isActive: boolean
  lastLat: number | null
  lastLng: number | null
  lastSpeed: number | null
  lastHeading: number | null
  lastIgnition: boolean | null
  lastUpdate: string | null
  isOnline: boolean
  isMoving: boolean
  createdAt: string
}

type Car = {
  slug: string
  name: string
  imageUrl: string | null
  city: string
}

type Alert = {
  id: string
  carSlug: string
  type: string
  message: string
  lat: number | null
  lng: number | null
  isRead: boolean
  createdAt: string
}

type Props = {
  initialDevices: Device[]
  cars: Car[]
  unreadAlerts: number
}

const POLL_INTERVAL = 10_000 // refresh every 10 seconds

function statusLabel(d: Device) {
  if (!d.isOnline) return { text: 'Hors ligne', color: '#6B7280' }
  if (d.isMoving) return { text: 'En mouvement', color: '#22C55E' }
  return { text: 'Arrêté', color: '#F59E0B' }
}

function timeSince(iso: string | null) {
  if (!iso) return 'Jamais'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'À l\'instant'
  if (mins < 60) return `Il y a ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Il y a ${hrs}h`
  return `Il y a ${Math.floor(hrs / 24)}j`
}

export default function TrackingDashboard({ initialDevices, cars, unreadAlerts: initialAlerts }: Props) {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertCount, setAlertCount] = useState(initialAlerts)
  const [historyPoints, setHistoryPoints] = useState<{ lat: number; lng: number }[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAlertsPanel, setShowAlertsPanel] = useState(false)
  const [addCarSlug, setAddCarSlug] = useState('')
  const [addLabel, setAddLabel] = useState('')
  const [adding, setAdding] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [historyHours, setHistoryHours] = useState(24)
  const [copyMsg, setCopyMsg] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const carMap = Object.fromEntries(cars.map((c) => [c.slug, c]))

  // Convert devices to map markers (only devices with a position)
  const vehicleMarkers: VehicleMarkerData[] = devices
    .filter((d) => d.lastLat !== null && d.lastLng !== null)
    .map((d) => ({
      id: d.id,
      carSlug: d.carSlug,
      label: d.label ?? carMap[d.carSlug]?.name ?? d.carSlug,
      lat: d.lastLat!,
      lng: d.lastLng!,
      speed: d.lastSpeed ?? 0,
      heading: d.lastHeading ?? 0,
      isOnline: d.isOnline,
      isMoving: d.isMoving,
      lastUpdate: d.lastUpdate,
    }))

  // Poll for fresh device data
  const refreshDevices = useCallback(async () => {
    try {
      const res = await fetch('/api/gps/devices', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setDevices(data)
      }
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    pollRef.current = setInterval(refreshDevices, POLL_INTERVAL)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [refreshDevices])

  // Load history when selected device changes
  useEffect(() => {
    if (!selectedId || !showHistory) {
      setHistoryPoints([])
      return
    }
    fetch(`/api/gps/devices/${selectedId}/history?hours=${historyHours}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data: { lat: number; lng: number }[]) => setHistoryPoints(data))
      .catch(() => setHistoryPoints([]))
  }, [selectedId, showHistory, historyHours])

  // Load alerts
  const loadAlerts = useCallback(async () => {
    const res = await fetch('/api/gps/alerts', { credentials: 'include' })
    if (res.ok) {
      const data: Alert[] = await res.json()
      setAlerts(data)
      setAlertCount(data.length)
    }
  }, [])

  useEffect(() => {
    if (showAlertsPanel) loadAlerts()
  }, [showAlertsPanel, loadAlerts])

  async function markAlertsRead() {
    await fetch('/api/gps/alerts', { method: 'PATCH', credentials: 'include' })
    setAlertCount(0)
    setAlerts([])
  }

  async function handleAddDevice(e: React.FormEvent) {
    e.preventDefault()
    if (!addCarSlug) return
    setAdding(true)
    try {
      const res = await fetch('/api/gps/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ carSlug: addCarSlug, label: addLabel || undefined }),
      })
      if (res.ok) {
        setShowAddModal(false)
        setAddCarSlug('')
        setAddLabel('')
        await refreshDevices()
      } else {
        const err = await res.json()
        alert(err.error ?? 'Erreur')
      }
    } finally {
      setAdding(false)
    }
  }

  async function handleDeleteDevice(id: string) {
    if (!confirm('Supprimer ce dispositif GPS ?')) return
    await fetch(`/api/gps/devices/${id}`, { method: 'DELETE', credentials: 'include' })
    await refreshDevices()
    if (selectedId === id) setSelectedId(null)
  }

  async function handleToggleActive(id: string, current: boolean) {
    await fetch(`/api/gps/devices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isActive: !current }),
    })
    await refreshDevices()
  }

  function copyToken(token: string) {
    navigator.clipboard.writeText(token)
    setCopyMsg(token)
    setTimeout(() => setCopyMsg(null), 2000)
  }

  const selected = devices.find((d) => d.id === selectedId) ?? null
  const onlineCount = devices.filter((d) => d.isOnline).length
  const movingCount = devices.filter((d) => d.isMoving).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Suivi GPS</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {devices.length} dispositif{devices.length !== 1 ? 's' : ''} · {onlineCount} en ligne · {movingCount} en mouvement
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Alerts bell */}
          <button
            onClick={() => setShowAlertsPanel(!showAlertsPanel)}
            className="relative px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-all text-sm flex items-center gap-2"
          >
            🔔
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-medium text-sm transition-all flex items-center gap-2"
          >
            <span>+</span> Ajouter GPS
          </button>
        </div>
      </div>

      {/* Alerts panel */}
      {showAlertsPanel && (
        <div className="rounded-xl bg-white/5 border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Alertes récentes</h3>
            {alerts.length > 0 && (
              <button onClick={markAlertsRead} className="text-xs text-white/40 hover:text-white/70">
                Tout marquer lu
              </button>
            )}
          </div>
          {alerts.length === 0 ? (
            <p className="text-white/30 text-sm">Aucune alerte non lue.</p>
          ) : (
            <div className="space-y-2">
              {alerts.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <span className="text-lg leading-none">
                    {a.type === 'overspeed' ? '⚡' : a.type === 'geofence_exit' ? '🚧' : '⚠️'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{a.message}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {carMap[a.carSlug]?.name ?? a.carSlug} · {new Date(a.createdAt).toLocaleString('fr-MA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main layout: sidebar + map */}
      <div className="flex gap-4 h-[600px]">
        {/* Vehicle list sidebar */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
          {devices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-white/30 text-sm gap-2">
              <span className="text-3xl">📍</span>
              <p>Aucun dispositif GPS</p>
              <button onClick={() => setShowAddModal(true)} className="text-emerald-400 hover:underline text-xs">
                + Ajouter le premier
              </button>
            </div>
          ) : (
            devices.map((device) => {
              const car = carMap[device.carSlug]
              const status = statusLabel(device)
              const isSelected = selectedId === device.id

              return (
                <div
                  key={device.id}
                  onClick={() => setSelectedId(isSelected ? null : device.id)}
                  className={`rounded-xl p-3 cursor-pointer border transition-all ${
                    isSelected
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ background: status.color }}
                    />
                    <span className="font-medium text-sm text-white truncate flex-1">
                      {device.label ?? car?.name ?? device.carSlug}
                    </span>
                    {!device.isActive && (
                      <span className="text-[10px] text-white/30 bg-white/10 px-1.5 py-0.5 rounded-full">
                        Inactif
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-white/40 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span style={{ color: status.color }}>{status.text}</span>
                      {device.lastSpeed !== null && (
                        <span>{Math.round(device.lastSpeed)} km/h</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{car?.city ?? ''}</span>
                      <span>{timeSince(device.lastUpdate)}</span>
                    </div>
                    {device.lastLat === null && (
                      <span className="text-orange-400/70">Pas encore de position</span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-white/10">
          <TrackingMap
            vehicles={vehicleMarkers}
            selectedId={selectedId}
            onSelectVehicle={setSelectedId}
            historyPoints={historyPoints}
          />

          {/* Map overlay controls (top-right) */}
          {selectedId && (
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
              <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3 text-white text-xs space-y-2 min-w-[160px]">
                <p className="font-semibold text-sm">
                  {selected?.label ?? carMap[selected?.carSlug ?? '']?.name ?? ''}
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHistory}
                    onChange={(e) => setShowHistory(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span>Historique</span>
                </label>
                {showHistory && (
                  <select
                    value={historyHours}
                    onChange={(e) => setHistoryHours(Number(e.target.value))}
                    className="w-full bg-white/10 rounded-lg px-2 py-1 text-white text-xs border border-white/20"
                  >
                    <option value={1}>1 heure</option>
                    <option value={6}>6 heures</option>
                    <option value={24}>24 heures</option>
                    <option value={72}>3 jours</option>
                    <option value={168}>7 jours</option>
                  </select>
                )}
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-full text-white/50 hover:text-white transition-colors"
                >
                  ✕ Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Device management table */}
      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10">
          <h3 className="font-semibold text-white text-sm">Gestion des dispositifs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-2.5">Voiture</th>
                <th className="text-left px-4 py-2.5">Label</th>
                <th className="text-left px-4 py-2.5">Token</th>
                <th className="text-left px-4 py-2.5">Statut</th>
                <th className="text-left px-4 py-2.5">Dernière MAJ</th>
                <th className="text-right px-4 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {devices.map((d) => {
                const car = carMap[d.carSlug]
                const status = statusLabel(d)
                return (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-2.5 text-white font-medium">
                      {car?.name ?? d.carSlug}
                    </td>
                    <td className="px-4 py-2.5 text-white/70">{d.label ?? '—'}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] text-white/30 bg-white/5 px-2 py-0.5 rounded font-mono truncate max-w-[120px]">
                          {d.deviceToken.slice(0, 8)}…
                        </code>
                        <button
                          onClick={() => copyToken(d.deviceToken)}
                          title="Copier le token complet"
                          className="text-white/30 hover:text-white/70 transition-colors text-xs"
                        >
                          {copyMsg === d.deviceToken ? '✓' : '📋'}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ color: status.color, background: `${status.color}20` }}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-white/40 text-xs">{timeSince(d.lastUpdate)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleActive(d.id, d.isActive)}
                          className="text-xs text-white/40 hover:text-white/70 transition-colors"
                          title={d.isActive ? 'Désactiver' : 'Activer'}
                        >
                          {d.isActive ? '⏸' : '▶'}
                        </button>
                        <button
                          onClick={() => handleDeleteDevice(d.id)}
                          className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                          title="Supprimer"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {devices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-white/30 text-sm">
                    Aucun dispositif. Cliquez sur "Ajouter GPS" pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add device modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-4">Ajouter un dispositif GPS</h3>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Voiture *</label>
                <select
                  value={addCarSlug}
                  onChange={(e) => setAddCarSlug(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm"
                >
                  <option value="">Sélectionner une voiture…</option>
                  {cars
                    .filter((c) => !devices.find((d) => d.carSlug === c.slug))
                    .map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1.5">Label (optionnel)</label>
                <input
                  type="text"
                  value={addLabel}
                  onChange={(e) => setAddLabel(e.target.value)}
                  placeholder="ex: Tracker Teltonika FMB920"
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white/70 hover:bg-white/15 text-sm transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-medium text-sm transition-all"
                >
                  {adding ? 'Ajout…' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
