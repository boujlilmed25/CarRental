"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  cities: string[];
  waNumber: string;
  cityLabel?: string;
  pickupLabel?: string;
  returnLabel?: string;
  searchBtnText?: string;
  waBtnTooltip?: string;
  waEnabled?: boolean;
  submitAction?: "booking_page" | "whatsapp";
  waMessageTemplate?: string;
  accentColor?: string;
  accentText?: string;
  formBg?: string;
  formBorder?: string;
  fieldBg?: string;
  fieldBorder?: string;
}

export default function HeroForm({
  cities,
  waNumber,
  cityLabel = "City",
  pickupLabel = "Pickup Date",
  returnLabel = "Return Date",
  searchBtnText = "Search",
  waBtnTooltip = "Book via WhatsApp",
  waEnabled = true,
  submitAction = "booking_page",
  waMessageTemplate,
  accentColor = "#F59E0B",
  accentText = "#0A1628",
  formBg = "rgba(255,255,255,0.05)",
  formBorder = "rgba(255,255,255,0.1)",
  fieldBg = "rgba(255,255,255,0.08)",
  fieldBorder = "rgba(255,255,255,0.12)",
}: Props) {
  const [city, setCity] = useState(cities[0] ?? "");
  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const waText =
      waMessageTemplate ??
      `Salam BoujlilCar 👋\n\nCity: ${city}\nPickup: ${pickup || "..."}\nReturn: ${returnDate || "..."}\n\nBghit n7jez!`;

    if (submitAction === "whatsapp") {
      window.open(
        `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`,
        "_blank"
      );
      return;
    }
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (pickup) params.set("pickup", pickup);
    if (returnDate) params.set("return", returnDate);
    router.push(`/booking?${params.toString()}`);
  };

  const waText =
    waMessageTemplate ??
    `Salam BoujlilCar 👋\n\nCity: ${city}\nPickup: ${pickup || "..."}\nReturn: ${returnDate || "..."}\n\nBghit n7jez!`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  const fieldStyle: React.CSSProperties = {
    background: fieldBg,
    border: `1px solid ${fieldBorder}`,
    color: "white",
    colorScheme: "dark",
  };

  return (
    <div
      className="mt-8 flex flex-wrap gap-3 rounded-2xl p-4 sm:flex-nowrap"
      style={{ background: formBg, border: `1px solid ${formBorder}` }}
    >
      {/* City */}
      <div className="flex-1 min-w-[140px]">
        <label className="block mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
          {cityLabel}
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium outline-none focus:ring-1"
          style={{ ...fieldStyle, focusRingColor: accentColor } as React.CSSProperties}
        >
          {cities.map((c) => (
            <option key={c} value={c} style={{ background: accentText }}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Pickup */}
      <div className="flex-1 min-w-[130px]">
        <label className="block mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
          {pickupLabel}
        </label>
        <input
          type="date"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium outline-none"
          style={fieldStyle}
        />
      </div>

      {/* Return */}
      <div className="flex-1 min-w-[130px]">
        <label className="block mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
          {returnLabel}
        </label>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="w-full rounded-xl px-3 py-2.5 text-sm font-medium outline-none"
          style={fieldStyle}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-end gap-2">
        <button
          onClick={handleSearch}
          className="rounded-xl px-6 py-2.5 text-sm font-bold transition-all hover:brightness-110 active:scale-95"
          style={{ background: accentColor, color: accentText }}
        >
          {searchBtnText}
        </button>
        {waEnabled && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={waBtnTooltip}
            className="flex items-center justify-center rounded-xl px-3 py-2.5 text-base transition-all hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            📱
          </a>
        )}
      </div>
    </div>
  );
}
