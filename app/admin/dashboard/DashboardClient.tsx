"use client";

import Link from "next/link";
import { useLang } from "../_ui/LangContext";
import { useTheme, themes } from "../_ui/ThemeContext";

interface BookingItem {
  id: string;
  name: string;
  phone: string;
  city: string;
  carSlug: string;
  pickupDate: string;
  returnDate: string;
  status: string;
  createdAt: string;
}

interface DashboardData {
  totalCars: number;
  activeCars: number;
  hiddenCars: number;
  featuredCars: number;
  totalBookings: number;
  newBookings: number;
  confirmedBookings: number;
  doneBookings: number;
  canceledBookings: number;
  openPipeline: number;
  recentIntake: number;
  pickupsToday: number;
  returnsToday: number;
  overdueReturns: number;
  upcomingReservations: BookingItem[];
  recentBookings: BookingItem[];
}

const STATUS_COLORS: Record<string, string> = {
  new: "#3b82f6",
  confirmed: "#10b981",
  done: "#94a3b8",
  canceled: "#ef4444",
};

const STATUS_BG: Record<string, string> = {
  new: "rgba(59,130,246,0.12)",
  confirmed: "rgba(16,185,129,0.12)",
  done: "rgba(148,163,184,0.12)",
  canceled: "rgba(239,68,68,0.12)",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function getStayLength(pickupDate: string, returnDate: string) {
  const start = new Date(pickupDate);
  const end = new Date(returnDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000);
  return diffDays >= 0 ? diffDays + 1 : null;
}

function getStatusLabel(status: string, tr: ReturnType<typeof useLang>["tr"]) {
  return tr.status[status as keyof typeof tr.status] ?? status;
}

export default function DashboardClient({ data }: { data: DashboardData }) {
  const { tr, isRtl } = useLang();
  const { theme } = useTheme();
  const t = themes[theme];
  const d = tr.dashboard;
  const dashboardText = d as typeof d & Record<string, string | undefined>;

  const labels = {
    readyFleet: dashboardText.readyFleet ?? "Ready fleet",
    hiddenFleet: dashboardText.hiddenFleet ?? "Hidden cars",
    featuredFleet: dashboardText.featuredFleet ?? "Featured cars",
    openPipeline: dashboardText.openPipeline ?? "Open pipeline",
    recentIntake: dashboardText.recentIntake ?? "Added this week",
    pickupsToday: dashboardText.pickupsToday ?? "Pickups today",
    returnsToday: dashboardText.returnsToday ?? "Returns today",
    overdueReturns: dashboardText.overdueReturns ?? "Overdue returns",
    upcomingOperations: dashboardText.upcomingOperations ?? "Next pickups",
    nextThreeDays: dashboardText.nextThreeDays ?? "Today to next 3 days",
    noUpcomingOperations:
      dashboardText.noUpcomingOperations ?? "No upcoming pickups in the next few days.",
    bookingPipeline: dashboardText.bookingPipeline ?? "Booking pipeline",
    fleetVisibility: dashboardText.fleetVisibility ?? "Fleet visibility",
    latestReservations: dashboardText.latestReservations ?? "Latest reservations",
    stayLength: dashboardText.stayLength ?? "Stay",
    createdAt: dashboardText.createdAt ?? "Created",
    manageFleet: dashboardText.manageFleet ?? d.addCar,
    reviewRequests: dashboardText.reviewRequests ?? d.viewBookings,
    monitorTrends: dashboardText.monitorTrends ?? d.viewAnalytics,
    updateContent: dashboardText.updateContent ?? d.editContent,
    completionRate: dashboardText.completionRate ?? "Completion rate",
    cancellationShare: dashboardText.cancellationShare ?? "Cancellation share",
  };

  const kpiCards = [
    {
      label: labels.readyFleet,
      value: `${data.activeCars}/${data.totalCars}`,
      sub: `${data.hiddenCars} ${labels.hiddenFleet.toLowerCase()}`,
      icon: "🚗",
      color: t.accent,
    },
    {
      label: labels.openPipeline,
      value: data.openPipeline,
      sub: `${data.newBookings} ${d.newBookings.toLowerCase()}`,
      icon: "📋",
      color: "#3b82f6",
    },
    {
      label: labels.pickupsToday,
      value: data.pickupsToday,
      sub: `${data.confirmedBookings} ${d.confirmedBookings.toLowerCase()}`,
      icon: "🗓️",
      color: "#10b981",
    },
    {
      label: labels.returnsToday,
      value: data.returnsToday,
      sub:
        data.overdueReturns > 0
          ? `${data.overdueReturns} ${labels.overdueReturns.toLowerCase()}`
          : `${data.doneBookings} ${d.doneBookings.toLowerCase()}`,
      icon: "↩️",
      color: data.overdueReturns > 0 ? "#f59e0b" : "#94a3b8",
    },
  ];

  const pipelineItems = [
    { key: "new", label: d.newBookings, value: data.newBookings, color: STATUS_COLORS.new },
    {
      key: "confirmed",
      label: d.confirmedBookings,
      value: data.confirmedBookings,
      color: STATUS_COLORS.confirmed,
    },
    { key: "done", label: d.doneBookings, value: data.doneBookings, color: STATUS_COLORS.done },
    {
      key: "canceled",
      label: d.canceledBookings,
      value: data.canceledBookings,
      color: STATUS_COLORS.canceled,
    },
  ];

  const fleetItems = [
    { label: d.activeCars, value: data.activeCars, color: t.accent },
    { label: labels.hiddenFleet, value: data.hiddenCars, color: "#f59e0b" },
    { label: labels.featuredFleet, value: data.featuredCars, color: "#38bdf8" },
  ];

  const completionRate = data.totalBookings
    ? Math.round((data.doneBookings / data.totalBookings) * 100)
    : 0;
  const cancellationRate = data.totalBookings
    ? Math.round((data.canceledBookings / data.totalBookings) * 100)
    : 0;

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{d.title}</h1>
          <p className="mt-1 text-sm text-white/50">{d.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-white/60">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            {labels.pickupsToday}: <span className="font-semibold text-white">{data.pickupsToday}</span>
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            {labels.returnsToday}: <span className="font-semibold text-white">{data.returnsToday}</span>
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            {labels.recentIntake}: <span className="font-semibold text-white">{data.recentIntake}</span>
          </span>
        </div>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map(({ label, value, sub, icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 p-4"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                style={{ background: `${color}18` }}
              >
                {icon}
              </span>
              <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            </div>
            <div className="text-3xl font-black" style={{ color }}>
              {value}
            </div>
            <div className="mt-1 text-xs text-white/45">{label}</div>
            <div className="mt-3 text-[11px] text-white/35">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div
            className="rounded-2xl border border-white/10 p-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">{labels.upcomingOperations}</h2>
                <p className="mt-1 text-xs text-white/40">{labels.nextThreeDays}</p>
              </div>
              <Link
                href="/admin/bookings"
                className="text-xs font-medium transition-colors hover:underline"
                style={{ color: t.accent }}
              >
                {labels.reviewRequests} →
              </Link>
            </div>

            {data.upcomingReservations.length === 0 ? (
              <p className="text-sm text-white/35">{labels.noUpcomingOperations}</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {data.upcomingReservations.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-white">{booking.name}</div>
                        <div className="mt-1 text-xs text-white/45">{booking.carSlug} - {booking.city}</div>
                      </div>
                      <span
                        className="inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold"
                        style={{
                          background: STATUS_BG[booking.status] ?? "rgba(148,163,184,0.12)",
                          color: STATUS_COLORS[booking.status] ?? "#94a3b8",
                        }}
                      >
                        {getStatusLabel(booking.status, tr)}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-white/55">
                      <span>{formatDate(booking.pickupDate)}</span>
                      <span>{formatDate(booking.returnDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            className="overflow-hidden rounded-2xl border border-white/10"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div>
                <h2 className="text-sm font-semibold">{labels.latestReservations}</h2>
                <p className="mt-1 text-xs text-white/40">{d.recentBookings}</p>
              </div>
              <Link
                href="/admin/bookings"
                className="text-xs font-medium transition-colors hover:underline"
                style={{ color: t.accent }}
              >
                {d.viewBookings} →
              </Link>
            </div>

            {data.recentBookings.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-white/40">{d.noBookings}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-left text-xs text-white/35">
                      <th className="px-5 py-3 font-medium">{d.customer}</th>
                      <th className="px-3 py-3 font-medium">{d.car}</th>
                      <th className="px-3 py-3 font-medium hidden md:table-cell">{labels.stayLength}</th>
                      <th className="px-3 py-3 font-medium hidden lg:table-cell">{labels.createdAt}</th>
                      <th className="px-3 py-3 font-medium">{d.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentBookings.map((booking) => {
                      const stayLength = getStayLength(booking.pickupDate, booking.returnDate);

                      return (
                        <tr
                          key={booking.id}
                          className="border-t border-white/5 transition-colors hover:bg-white/5"
                        >
                          <td className="px-5 py-3 align-top">
                            <div className="font-medium leading-tight text-white">{booking.name}</div>
                            <div className="mt-1 text-xs text-white/35">{booking.phone}</div>
                            <div className="mt-1 text-xs text-white/35 md:hidden">{booking.city}</div>
                          </td>
                          <td className="px-3 py-3 align-top text-xs text-white/60">
                            <div>{booking.carSlug}</div>
                            <div className="mt-1 text-white/35 hidden md:block">{booking.city}</div>
                          </td>
                          <td className="px-3 py-3 align-top hidden md:table-cell">
                            <div className="text-xs text-white/60">{formatDate(booking.pickupDate)}</div>
                            <div className="mt-1 text-xs text-white/35">
                              {formatDate(booking.returnDate)}
                              {stayLength ? ` - ${stayLength}d` : ""}
                            </div>
                          </td>
                          <td className="px-3 py-3 align-top text-xs text-white/45 hidden lg:table-cell">
                            {formatDateTime(booking.createdAt)}
                          </td>
                          <td className="px-3 py-3 align-top">
                            <span
                              className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
                              style={{
                                background: STATUS_BG[booking.status] ?? "rgba(148,163,184,0.12)",
                                color: STATUS_COLORS[booking.status] ?? "#94a3b8",
                              }}
                            >
                              {getStatusLabel(booking.status, tr)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div
            className="rounded-2xl border border-white/10 p-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">{labels.bookingPipeline}</h2>
              <span className="text-xs text-white/40">{data.totalBookings} {d.totalBookings.toLowerCase()}</span>
            </div>

            <div className="space-y-3">
              {pipelineItems.map(({ key, label, value, color }) => {
                const pct = data.totalBookings ? (value / data.totalBookings) * 100 : 0;

                return (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-white/55">{label}</span>
                      <span className="font-semibold" style={{ color }}>
                        {value}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="text-white/40">{labels.completionRate}</div>
                <div className="mt-1 text-lg font-semibold text-white">{completionRate}%</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="text-white/40">{labels.cancellationShare}</div>
                <div className="mt-1 text-lg font-semibold text-white">{cancellationRate}%</div>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl border border-white/10 p-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">{labels.fleetVisibility}</h2>
              <Link
                href="/admin/cars"
                className="text-xs font-medium transition-colors hover:underline"
                style={{ color: t.accent }}
              >
                {labels.manageFleet} →
              </Link>
            </div>

            <div className="space-y-3">
              {fleetItems.map(({ label, value, color }) => {
                const pct = data.totalCars ? (value / data.totalCars) * 100 : 0;

                return (
                  <div key={label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-white/55">{label}</span>
                      <span className="font-semibold" style={{ color }}>
                        {value}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="rounded-2xl border border-white/10 p-5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <h2 className="mb-4 text-sm font-semibold">{d.quickActions}</h2>
            <div className="space-y-2">
              <Link
                href="/admin/bookings"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all hover:brightness-110 active:scale-95"
                style={{ background: t.accent, color: t.accentText }}
              >
                <span>📋</span>
                {labels.reviewRequests}
              </Link>
              <Link
                href="/admin/cars"
                className="flex items-center gap-3 rounded-xl border border-white/12 px-4 py-3 text-sm font-medium transition-all hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                <span>🚗</span>
                {labels.manageFleet}
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-3 rounded-xl border border-white/12 px-4 py-3 text-sm font-medium transition-all hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                <span>📈</span>
                {labels.monitorTrends}
              </Link>
              <Link
                href="/admin/content"
                className="flex items-center gap-3 rounded-xl border border-white/12 px-4 py-3 text-sm font-medium transition-all hover:bg-white/5"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                <span>✏️</span>
                {labels.updateContent}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
