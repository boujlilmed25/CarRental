"use client";

import { useLang } from "../_ui/LangContext";
import { useTheme, themes } from "../_ui/ThemeContext";

interface AnalyticsData {
  bookingsByStatus: { status: string; count: number }[];
  bookingsByCity: { city: string; count: number }[];
  bookingsByCar: { carSlug: string; count: number }[];
  carsByCategory: { category: string; count: number }[];
  totalCars: number;
  activeCars: number;
  totalBookings: number;
}

const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  confirmed: "#10b981",
  done: "#94a3b8",
  canceled: "#ef4444",
};

const PALETTE = [
  "#F59E0B", "#8b5cf6", "#3b82f6", "#10b981",
  "#f43f5e", "#14b8a6", "#f97316", "#a78bfa",
];

// ── Horizontal bar row ──────────────────────────────────────────────
function BarRow({
  label,
  value,
  max,
  color,
  total,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  total?: number;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const share = total && total > 0 ? Math.round((value / total) * 100) : null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5 gap-2">
        <span className="text-xs text-white/65 truncate flex-1">{label}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {share !== null && (
            <span className="text-[10px] text-white/30">{share}%</span>
          )}
          <span className="text-xs font-bold" style={{ color }}>
            {value}
          </span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Card wrapper ────────────────────────────────────────────────────
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-white/10 p-5"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <h3 className="text-sm font-semibold text-white/75 mb-5">{title}</h3>
      {children}
    </div>
  );
}

// ── SVG donut ───────────────────────────────────────────────────────
function Donut({
  pct,
  color,
  label,
  value,
}: {
  pct: number;
  color: string;
  label: string;
  value: string;
}) {
  const r = 15.9;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 36 36"
          aria-hidden
        >
          <circle
            cx="18"
            cy="18"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black" style={{ color }}>
            {value}
          </span>
        </div>
      </div>
      <span className="text-xs text-white/45 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────
export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const { tr, isRtl } = useLang();
  const { theme } = useTheme();
  const t = themes[theme];
  const a = tr.analytics;

  const maxCity = Math.max(...data.bookingsByCity.map((x) => x.count), 1);
  const maxCar = Math.max(...data.bookingsByCar.map((x) => x.count), 1);
  const maxCat = Math.max(...data.carsByCategory.map((x) => x.count), 1);

  const topCity = data.bookingsByCity[0]?.city ?? "—";
  const topCar = data.bookingsByCar[0]?.carSlug ?? "—";
  const activePct =
    data.totalCars > 0
      ? Math.round((data.activeCars / data.totalCars) * 100)
      : 0;

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight">{a.title}</h1>
        <p className="mt-1 text-sm text-white/50">{a.subtitle}</p>
      </div>

      {/* ── Summary KPI strip ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {[
          {
            label: a.topCity,
            value: topCity,
            icon: "📍",
            color: t.accent,
          },
          {
            label: a.topCar,
            value: topCar,
            icon: "🏆",
            color: "#8b5cf6",
          },
          {
            label: tr.dashboard.totalCars,
            value: String(data.totalCars),
            icon: "🚗",
            color: "#3b82f6",
          },
          {
            label: tr.dashboard.totalBookings,
            value: String(data.totalBookings),
            icon: "📋",
            color: "#10b981",
          },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 p-4"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="text-xl mb-2">{icon}</div>
            <div
              className="text-xl font-black truncate"
              style={{ color }}
            >
              {value}
            </div>
            <div className="text-[11px] text-white/38 mt-1 leading-tight">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts grid ────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* Bookings by Status */}
        <Card title={a.byStatus}>
          {data.bookingsByStatus.length === 0 ? (
            <p className="text-sm text-white/35">{a.noData}</p>
          ) : (
            data.bookingsByStatus.map(({ status, count }) => (
              <BarRow
                key={status}
                label={
                  tr.status[status as keyof typeof tr.status] ?? status
                }
                value={count}
                max={data.totalBookings}
                color={STATUS_COLORS[status] ?? "#94a3b8"}
                total={data.totalBookings}
              />
            ))
          )}
        </Card>

        {/* Bookings by City */}
        <Card title={a.byCity}>
          {data.bookingsByCity.length === 0 ? (
            <p className="text-sm text-white/35">{a.noData}</p>
          ) : (
            data.bookingsByCity.map(({ city, count }, i) => (
              <BarRow
                key={city}
                label={city}
                value={count}
                max={maxCity}
                color={PALETTE[i % PALETTE.length]}
                total={data.totalBookings}
              />
            ))
          )}
        </Card>

        {/* Top 5 Cars */}
        <Card title={a.byCar}>
          {data.bookingsByCar.length === 0 ? (
            <p className="text-sm text-white/35">{a.noData}</p>
          ) : (
            data.bookingsByCar.map(({ carSlug, count }, i) => (
              <BarRow
                key={carSlug}
                label={carSlug}
                value={count}
                max={maxCar}
                color={PALETTE[i % PALETTE.length]}
                total={data.totalBookings}
              />
            ))
          )}
        </Card>

        {/* Cars by Category */}
        <Card title={a.byCategory}>
          {data.carsByCategory.length === 0 ? (
            <p className="text-sm text-white/35">{a.noData}</p>
          ) : (
            data.carsByCategory.map(({ category, count }, i) => (
              <BarRow
                key={category}
                label={category}
                value={count}
                max={maxCat}
                color={PALETTE[i % PALETTE.length]}
              />
            ))
          )}
        </Card>

        {/* Fleet Availability — Donut */}
        <Card title={a.availability}>
          <div className="flex flex-col items-center gap-6">
            <Donut
              pct={activePct}
              color="#10b981"
              label={`${a.active} / ${a.total}`}
              value={`${activePct}%`}
            />

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-white/60 text-xs">{a.active}</span>
                </div>
                <span className="font-bold text-emerald-400">
                  {data.activeCars}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="text-white/60 text-xs">{a.hidden}</span>
                </div>
                <span className="font-bold text-red-400">
                  {data.totalCars - data.activeCars}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                <span className="text-white/40 text-xs">{a.total}</span>
                <span className="font-black" style={{ color: t.accent }}>
                  {data.totalCars}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
