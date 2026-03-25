"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Props = {
  carName: string;
  carSlug: string;
  pricePerDay: number;
  defaultCity: string;
  waNumber: string;
  bookBtnText: string;
  tipText: string;
};

export default function CarBookingSidebar({
  carName,
  carSlug,
  pricePerDay,
  defaultCity,
  waNumber,
  bookBtnText,
  tipText,
}: Props) {
  const [city, setCity] = useState(defaultCity);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Calculate number of days & total price
  const { days, total } = useMemo(() => {
    if (!pickupDate || !returnDate) return { days: 0, total: 0 };
    const a = new Date(pickupDate).getTime();
    const b = new Date(returnDate).getTime();
    const d = Math.max(0, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
    return { days: d, total: d * pricePerDay };
  }, [pickupDate, returnDate, pricePerDay]);

  // Format date "2026-03-01" → "01/03/2026"
  function fmtDate(d: string, t: string) {
    if (!d) return "...";
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y} — ⏰ ${t}`;
  }

  // ── VIP Darija WA message ───────────────────────────────────────────────────
  const waHref = useMemo(() => {
    const lines = [
      `🌟 *BoujlilCar — طلب حجز*`,
      ``,
      `السلام عليكم 👋`,
      ``,
      `بغيت نحجز هاد السيارة:`,
      ``,
      `🚗 *السيارة :*  ${carName}`,
      `📍 *المدينة :*  ${city || "..."}`,
      `📅 *الاستلام :*  ${fmtDate(pickupDate, pickupTime)}`,
      `🏁 *الإرجاع  :*  ${fmtDate(returnDate, returnTime)}`,
      ...(days > 0
        ? [
            `⏳ *المدة    :*  ${days} يوم`,
            `💰 *الإجمالي :*  ${total.toLocaleString("fr-MA")} درهم`,
          ]
        : []),
      ...(name ? [`👤 *الاسم    :*  ${name}`] : []),
      ...(phone ? [`📞 *الهاتف   :*  ${phone}`] : []),
      ``,
      `شكراً — كنتسنى ردكم 🙏`,
    ];
    const msg = lines.join("\n");
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  }, [city, pickupDate, pickupTime, returnDate, returnTime, name, phone, carName, waNumber, days, total]);

  // Booking form URL pre-filled
  const bookingUrl = useMemo(() => {
    const p = new URLSearchParams();
    p.set("city", city);
    p.set("car", carSlug);
    if (pickupDate) p.set("from", `${pickupDate}T${pickupTime}`);
    if (returnDate) p.set("to", `${returnDate}T${returnTime}`);
    return `/booking?${p.toString()}`;
  }, [city, carSlug, pickupDate, pickupTime, returnDate, returnTime]);

  const hasAllRequired = city && pickupDate && returnDate && name && phone;

  return (
    <div className="sticky top-6 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
      {/* Price */}
      <div className="text-xs text-white/70">From</div>
      <div className="text-3xl font-semibold">
        MAD {pricePerDay}
        <span className="text-base font-normal text-white/70">/day</span>
      </div>

      {/* Total price when dates selected */}
      {days > 0 && (
        <div className="mt-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2">
          <div className="text-xs text-emerald-300">
            {days} day{days > 1 ? "s" : ""} — Total:{" "}
            <span className="font-semibold text-white">MAD {total}</span>
          </div>
        </div>
      )}

      {/* Fields */}
      <div className="mt-4 space-y-3">
        {/* City */}
        <Field label="Pickup city">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Casablanca"
            className="inp"
          />
        </Field>

        {/* Pickup date + time */}
        <Field label="Pickup date & time">
          <div className="flex gap-2">
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="inp flex-1"
              style={{ colorScheme: "dark" }}
            />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="inp w-[90px]"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </Field>

        {/* Return date + time */}
        <Field label="Return date & time">
          <div className="flex gap-2">
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="inp flex-1"
              style={{ colorScheme: "dark" }}
            />
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="inp w-[90px]"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </Field>

        {/* Name */}
        <Field label="Your name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="inp"
          />
        </Field>

        {/* Phone */}
        <Field label="Phone">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="06..."
            className="inp"
          />
        </Field>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-col gap-2">
        <a
          href={waHref}
          className="rounded-xl bg-emerald-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition-colors"
          style={{ opacity: hasAllRequired ? 1 : 0.75 }}
        >
          💬 {bookBtnText}
        </a>
        <Link
          href={bookingUrl}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/15 transition-colors"
        >
          📋 Use booking form
        </Link>
      </div>

      {!hasAllRequired && (
        <p className="mt-2 text-[11px] text-white/40">
          Fill all fields for the best WhatsApp message.
        </p>
      )}

      <div className="mt-3 text-xs text-white/60">{tipText}</div>

      <style jsx>{`
        .inp {
          width: 100%;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.08);
          padding: 8px 10px;
          color: white;
          font-size: 13px;
          outline: none;
        }
        .inp::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }
        .inp:focus {
          border-color: rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.12);
        }
        .inp[type="date"]::-webkit-calendar-picker-indicator,
        .inp[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(1) opacity(0.5);
          cursor: pointer;
        }
        .inp[type="date"]::-webkit-calendar-picker-indicator:hover,
        .inp[type="time"]::-webkit-calendar-picker-indicator:hover {
          filter: invert(1) opacity(1);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] text-white/60">{label}</div>
      {children}
    </div>
  );
}
