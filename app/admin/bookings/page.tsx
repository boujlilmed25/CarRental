"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "../_ui/AdminShell";

type BookingStatus = "new" | "confirmed" | "done" | "canceled";

type Booking = {
  id: string;
  name: string;
  phone: string;
  city: string;
  carSlug: string;
  pickupDate: string;
  returnDate: string;
  notes?: string | null;
  status: BookingStatus;
  createdAt: string;
};

type Banner = {
  tone: "error" | "success";
  message: string;
} | null;

const statuses: BookingStatus[] = ["new", "confirmed", "done", "canceled"];

const statusMeta: Record<BookingStatus, { label: string; pill: string; button: string }> = {
  new: {
    label: "New",
    pill: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    button: "border-amber-400/20 bg-amber-400/10 text-amber-100 hover:bg-amber-400/20",
  },
  confirmed: {
    label: "Confirmed",
    pill: "border-sky-400/20 bg-sky-400/10 text-sky-200",
    button: "border-sky-400/20 bg-sky-400/10 text-sky-100 hover:bg-sky-400/20",
  },
  done: {
    label: "Done",
    pill: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    button: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20",
  },
  canceled: {
    label: "Canceled",
    pill: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    button: "border-rose-400/20 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20",
  },
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

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function toWhatsAppPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function getStayLength(pickupDate: string, returnDate: string) {
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000);
  return diffDays >= 0 ? diffDays + 1 : null;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [pickupFrom, setPickupFrom] = useState("");
  const [pickupTo, setPickupTo] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function load(showSkeleton = false) {
    if (showSkeleton) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(payload?.error || "Failed to load bookings");
      }

      setBookings(Array.isArray(payload.bookings) ? payload.bookings : []);
      setBanner(null);
    } catch (error) {
      setBanner({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to load bookings",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load(true);
  }, []);

  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [booking.name, booking.phone, booking.city, booking.carSlug, booking.notes ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesFrom = !pickupFrom || booking.pickupDate >= pickupFrom;
      const matchesTo = !pickupTo || booking.pickupDate <= pickupTo;

      return matchesStatus && matchesQuery && matchesFrom && matchesTo;
    });
  }, [bookings, pickupFrom, pickupTo, query, statusFilter]);

  useEffect(() => {
    if (filteredBookings.length === 0) {
      setSelectedId(null);
      return;
    }

    const currentSelectionExists = filteredBookings.some((booking) => booking.id === selectedId);
    if (!currentSelectionExists) {
      setSelectedId(filteredBookings[0].id);
    }
  }, [filteredBookings, selectedId]);

  const selectedBooking = filteredBookings.find((booking) => booking.id === selectedId) ?? null;
  const selectedStayLength = selectedBooking
    ? getStayLength(selectedBooking.pickupDate, selectedBooking.returnDate)
    : null;

  const counts = useMemo(() => {
    return bookings.reduce(
      (acc, booking) => {
        acc.total += 1;
        acc[booking.status] += 1;
        return acc;
      },
      { total: 0, new: 0, confirmed: 0, done: 0, canceled: 0 } as Record<BookingStatus | "total", number>,
    );
  }, [bookings]);

  async function updateStatus(id: string, nextStatus: BookingStatus) {
    setPendingId(id);
    setBanner(null);

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(payload?.error || "Status update failed");
      }

      const updated = payload.booking as Booking;
      setBookings((current) => current.map((booking) => (booking.id === id ? updated : booking)));
      setBanner({ tone: "success", message: `Booking marked as ${statusMeta[nextStatus].label.toLowerCase()}.` });
    } catch (error) {
      setBanner({
        tone: "error",
        message: error instanceof Error ? error.message : "Status update failed",
      });
    } finally {
      setPendingId(null);
    }
  }

  async function removeBooking(id: string) {
    if (!confirm("Delete this booking?")) return;

    setPendingId(id);
    setBanner(null);

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(payload?.error || "Delete failed");
      }

      setBookings((current) => current.filter((booking) => booking.id !== id));
      setBanner({ tone: "success", message: "Booking deleted." });
    } catch (error) {
      setBanner({
        tone: "error",
        message: error instanceof Error ? error.message : "Delete failed",
      });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Bookings</h1>
            <p className="mt-1 text-sm text-white/70">
              Review requests, contact customers fast, and move reservations through the pipeline.
            </p>
          </div>
          <button
            onClick={() => void load(false)}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? "Refreshing..." : "Refresh list"}
          </button>
        </div>

        {banner ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              banner.tone === "error"
                ? "border-rose-400/20 bg-rose-500/10 text-rose-100"
                : "border-emerald-400/20 bg-emerald-500/10 text-emerald-100"
            }`}
          >
            {banner.message}
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-white/45">Total</div>
            <div className="mt-2 text-2xl font-semibold">{counts.total}</div>
          </div>
          {statuses.map((status) => (
            <div key={status} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/45">{statusMeta[status].label}</div>
              <div className="mt-2 text-2xl font-semibold">{counts[status]}</div>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_180px_160px_160px]">
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Search customer, phone, city, car
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. Ahmed, Casablanca, Dacia"
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/25"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
              >
                <option value="all" className="bg-slate-900">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status} className="bg-slate-900">
                    {statusMeta[status].label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Pickup from
              <input
                type="date"
                value={pickupFrom}
                onChange={(event) => setPickupFrom(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-white/70">
              Pickup to
              <input
                type="date"
                value={pickupTo}
                onChange={(event) => setPickupTo(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
              />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/50">
            <span>{filteredBookings.length} visible</span>
            {(query || statusFilter !== "all" || pickupFrom || pickupTo) && (
              <button
                onClick={() => {
                  setQuery("");
                  setStatusFilter("all");
                  setPickupFrom("");
                  setPickupTo("");
                }}
                className="rounded-full border border-white/10 px-3 py-1.5 text-white/75 transition hover:bg-white/10"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {loading ? (
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_380px]">
            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
              ))}
            </div>
            <div className="h-[420px] animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          </section>
        ) : filteredBookings.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
            <div className="text-base font-medium">No bookings match the current view.</div>
            <p className="mt-2 text-sm text-white/60">
              Adjust search or filters to bring requests back into focus.
            </p>
          </section>
        ) : (
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_380px]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <div className="hidden min-w-0 xl:block">
                <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr_1fr] gap-3 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/40">
                  <div>Customer</div>
                  <div>Trip</div>
                  <div>Pickup</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
              </div>

              <div className="space-y-3">
                {filteredBookings.map((booking) => {
                  const isSelected = booking.id === selectedId;
                  const isPending = pendingId === booking.id;
                  const phoneHref = normalizePhone(booking.phone);
                  const whatsappPhone = toWhatsAppPhone(booking.phone);
                  const stayLength = getStayLength(booking.pickupDate, booking.returnDate);

                  return (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedId(booking.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedId(booking.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-white/25 bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr_1fr] xl:items-center">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-white">{booking.name}</span>
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusMeta[booking.status].pill}`}>
                              {statusMeta[booking.status].label}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/60">
                            <span>{booking.phone}</span>
                            <span>{booking.city}</span>
                            <span>{booking.carSlug}</span>
                          </div>
                          {booking.notes ? (
                            <div className="mt-2 max-w-2xl truncate text-sm text-white/45">{booking.notes}</div>
                          ) : null}
                        </div>

                        <div className="text-sm text-white/70">
                          <div className="font-medium text-white">{formatDate(booking.pickupDate)}</div>
                          <div className="mt-1 text-white/45">
                            to {formatDate(booking.returnDate)}{stayLength ? ` - ${stayLength} day(s)` : ""}
                          </div>
                        </div>

                        <div className="text-sm text-white/70">
                          <div>{formatDateTime(booking.createdAt)}</div>
                          <div className="mt-1 text-white/45">Request received</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {statuses.map((status) => (
                            <button
                              key={status}
                              type="button"
                              disabled={isPending || booking.status === status}
                              onClick={(event) => {
                                event.stopPropagation();
                                void updateStatus(booking.id, status);
                              }}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-45 ${statusMeta[status].button}`}
                            >
                              {statusMeta[status].label}
                            </button>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <a
                            href={phoneHref ? `tel:${phoneHref}` : undefined}
                            onClick={(event) => event.stopPropagation()}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10"
                          >
                            Call
                          </a>
                          <a
                            href={whatsappPhone ? `https://wa.me/${whatsappPhone}` : undefined}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100 transition hover:bg-emerald-500/20"
                          >
                            WhatsApp
                          </a>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={(event) => {
                              event.stopPropagation();
                              void removeBooking(booking.id);
                            }}
                            className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-3xl border border-white/10 bg-white/5 p-5">
              {selectedBooking ? (
                <div className="space-y-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{selectedBooking.name}</h2>
                      <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusMeta[selectedBooking.status].pill}`}>
                        {statusMeta[selectedBooking.status].label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/55">Booking details and quick handling tools.</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/40">Contact</div>
                      <div className="mt-3 text-sm text-white/70">Phone</div>
                      <div className="text-base font-medium text-white">{selectedBooking.phone}</div>
                      <div className="mt-3 flex gap-2">
                        <a
                          href={`tel:${normalizePhone(selectedBooking.phone)}`}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10"
                        >
                          Call customer
                        </a>
                        <a
                          href={`https://wa.me/${toWhatsAppPhone(selectedBooking.phone)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100 transition hover:bg-emerald-500/20"
                        >
                          Open WhatsApp
                        </a>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/40">Reservation</div>
                      <dl className="mt-3 space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-white/55">Car</dt>
                          <dd className="font-medium text-white">{selectedBooking.carSlug}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-white/55">City</dt>
                          <dd className="font-medium text-white">{selectedBooking.city}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-white/55">Pickup</dt>
                          <dd className="font-medium text-white">{formatDate(selectedBooking.pickupDate)}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-white/55">Return</dt>
                          <dd className="font-medium text-white">{formatDate(selectedBooking.returnDate)}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-white/55">Duration</dt>
                          <dd className="font-medium text-white">
                            {selectedStayLength ? `${selectedStayLength} day(s)` : "-"}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-white/55">Created</dt>
                          <dd className="font-medium text-white">{formatDateTime(selectedBooking.createdAt)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">Notes</div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/70">
                      {selectedBooking.notes?.trim() || "No notes provided by the customer."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/40">Status workflow</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={pendingId === selectedBooking.id || selectedBooking.status === status}
                          onClick={() => void updateStatus(selectedBooking.id, status)}
                          className={`rounded-full border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-45 ${statusMeta[status].button}`}
                        >
                          Mark {statusMeta[status].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 text-center text-sm text-white/55">
                  Select a booking to view the full reservation details.
                </div>
              )}
            </aside>
          </section>
        )}
      </div>
    </AdminShell>
  );
}
