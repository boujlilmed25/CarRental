"use client";

import { useEffect, useState } from "react";

type Car = { slug: string; name: string; city: string; pricePerDay: number };

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Nador", "Béni Mellal",
  "El Jadida", "Khouribga", "Mohammedia", "Laâyoune", "Dakhla",
  "Settat", "Berrechid", "Khemisset", "Safi", "Essaouira",
];

export default function BookingForm() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "Casablanca",
    carSlug: "",
    pickupDate: "",
    pickupTime: "10:00",
    returnDate: "",
    returnTime: "10:00",
    notes: "",
  });
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Read pre-filled values from URL params (coming from rent/[city] page)
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get("city");
    const carParam = params.get("car");
    const fromParam = params.get("from"); // 2024-01-15T10:00
    const toParam = params.get("to");

    setForm((f) => ({
      ...f,
      city: cityParam || f.city,
      carSlug: carParam || f.carSlug,
      pickupDate: fromParam ? fromParam.split("T")[0] : f.pickupDate,
      pickupTime: fromParam?.includes("T") ? fromParam.split("T")[1] : f.pickupTime,
      returnDate: toParam ? toParam.split("T")[0] : f.returnDate,
      returnTime: toParam?.includes("T") ? toParam.split("T")[1] : f.returnTime,
    }));

    (async () => {
      const res = await fetch("/api/public/cars");
      const data = await res.json();
      setCars(data.cars || []);
      if (!carParam) {
        setForm((f) => ({ ...f, carSlug: data.cars?.[0]?.slug || "" }));
      }
      setLoading(false);
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const pickupDate = form.pickupDate
      ? `${form.pickupDate}${form.pickupTime ? " " + form.pickupTime : ""}`
      : "";
    const returnDate = form.returnDate
      ? `${form.returnDate}${form.returnTime ? " " + form.returnTime : ""}`
      : "";

    const res = await fetch("/api/public/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, pickupDate, returnDate }),
    });

    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(j?.error || "Something went wrong");
      return;
    }

    const wa = j?.whatsappUrl as string | undefined;
    setStatus("Saved! Opening WhatsApp…");
    if (wa) window.location.href = wa;
  }

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        Loading…
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mt-6 grid gap-4 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:grid-cols-2"
    >
      {/* Name */}
      <Field label="Your name">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input"
          placeholder="Name"
          required
        />
      </Field>

      {/* Phone */}
      <Field label="Phone">
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="input"
          placeholder="06..."
          required
        />
      </Field>

      {/* City dropdown */}
      <Field label="City">
        <select
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="input"
        >
          {MOROCCAN_CITIES.map((c) => (
            <option key={c} value={c} className="bg-slate-900">
              {c}
            </option>
          ))}
        </select>
      </Field>

      {/* Car */}
      <Field label="Car">
        <select
          value={form.carSlug}
          onChange={(e) => setForm({ ...form, carSlug: e.target.value })}
          className="input"
        >
          {cars.map((c) => (
            <option key={c.slug} value={c.slug} className="bg-slate-900">
              {c.name} — {c.city} (MAD {c.pricePerDay}/day)
            </option>
          ))}
        </select>
      </Field>

      {/* Pickup date + time */}
      <Field label="Pickup date">
        <div className="flex gap-2">
          <input
            type="date"
            value={form.pickupDate}
            onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
            className="input flex-1"
            required
          />
          <input
            type="time"
            value={form.pickupTime}
            onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
            className="input w-[110px]"
          />
        </div>
      </Field>

      {/* Return date + time */}
      <Field label="Return date">
        <div className="flex gap-2">
          <input
            type="date"
            value={form.returnDate}
            onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
            className="input flex-1"
            required
          />
          <input
            type="time"
            value={form.returnTime}
            onChange={(e) => setForm({ ...form, returnTime: e.target.value })}
            className="input w-[110px]"
          />
        </div>
      </Field>

      {/* Notes */}
      <Field label="Notes (optional)" className="sm:col-span-2">
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="input min-h-[90px]"
          placeholder="Airport pickup? Automatic? ..."
        />
      </Field>

      <div className="sm:col-span-2 flex flex-col gap-2">
        <button className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
          Send on WhatsApp
        </button>
        {status && <div className="text-sm text-white/80">{status}</div>}
        <p className="text-xs text-white/60">
          We save your request and open WhatsApp with a prefilled message.
        </p>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          padding: 10px 12px;
          color: white;
          outline: none;
        }
        .input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }
        .input:focus {
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.12);
        }
        /* Style the date/time input calendar icon */
        .input[type="date"]::-webkit-calendar-picker-indicator,
        .input[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.6);
          cursor: pointer;
        }
        .input[type="date"]::-webkit-calendar-picker-indicator:hover,
        .input[type="time"]::-webkit-calendar-picker-indicator:hover {
          filter: invert(1) opacity(1);
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-1 text-[11px] text-white/60">{label}</div>
      {children}
    </label>
  );
}
