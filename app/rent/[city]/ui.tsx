"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type CarData = {
  id: string;
  slug: string;
  name: string;
  category: string;
  seats: number;
  bags: string;
  transmission: string;
  fuel: string;
  mileage: string;
  pricePerDay: number;
  city: string;
  featured: boolean;
  imageUrl: string | null;
};

const CATEGORIES = ["All", "Economy", "SUV", "Standard", "People Carrier", "Estate", "Convertible", "Luxury"];

type Props = {
  city: string;
  cars: CarData[];
  waNumber: string;
};

export default function CityRentClient({ city, cars, waNumber }: Props) {
  const router = useRouter();

  // Search fields
  const [location, setLocation] = useState(city);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");

  // Filters
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterAuto, setFilterAuto] = useState(false);
  const [filterManual, setFilterManual] = useState(false);
  const [filterUnlimited, setFilterUnlimited] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);

  // Filtered cars
  const filtered = useMemo(() => {
    return cars.filter((c) => {
      if (activeCategory !== "All" && c.category !== activeCategory) return false;
      if (filterAuto && !filterManual && c.transmission.toLowerCase() !== "automatic") return false;
      if (filterManual && !filterAuto && c.transmission.toLowerCase() !== "manual") return false;
      if (filterUnlimited && !c.mileage.toLowerCase().includes("unlimited")) return false;
      if (filterFeatured && !c.featured) return false;
      return true;
    });
  }, [cars, activeCategory, filterAuto, filterManual, filterUnlimited, filterFeatured]);

  // Build booking URL with pre-filled data
  function buildBookingUrl(carSlug?: string) {
    const params = new URLSearchParams();
    params.set("city", location || city);
    if (pickupDate) params.set("from", pickupDate + (pickupTime ? "T" + pickupTime : ""));
    if (returnDate) params.set("to", returnDate + (returnTime ? "T" + returnTime : ""));
    if (carSlug) params.set("car", carSlug);
    return `/booking?${params.toString()}`;
  }

  // WhatsApp link with dates
  function buildWaUrl(carName: string) {
    const from = pickupDate ? `${pickupDate} ${pickupTime}` : "...";
    const to = returnDate ? `${returnDate} ${returnTime}` : "...";
    const msg = `Salam BoujlilCar, bghit نحجز ${carName}. City: ${location || city}. Pickup: ${from}. Return: ${to}.`;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
  }

  function handleSearch() {
    // Just scrolls to the results (filters already applied reactively)
    document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleBookAll() {
    router.push(buildBookingUrl());
  }

  const hasDateSelected = pickupDate && returnDate;

  return (
    <>
      {/* ── Hero header ─────────────────────────────────────────── */}
      <header className="relative mt-6 overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
        <nav className="text-xs text-white/80">
          <Link className="hover:text-white" href="/">Car rental</Link>
          <span className="mx-2">›</span>
          <span className="text-white">{city}</span>
        </nav>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
          Car rental in {city}
        </h1>

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-white/90">
          <TrustPill>✓ Delivery anywhere in Morocco</TrustPill>
          <TrustPill>✓ Transparent pricing</TrustPill>
          <TrustPill>✓ WhatsApp confirmation (fast)</TrustPill>
        </div>

        {/* ── Search bar ──────────────────────────────────────────── */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
          <div className="grid gap-2 lg:grid-cols-12">
            {/* Location */}
            <label className="lg:col-span-4 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/70">Pick-up location</span>
                <span className="text-xs">📍</span>
              </div>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
                placeholder={`${city}, Morocco`}
              />
            </label>

            {/* Pickup date + time */}
            <label className="lg:col-span-3 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/70">Pick-up date & time</span>
                <span className="text-xs">📅</span>
              </div>
              <div className="mt-1 flex gap-1">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-sm text-white focus:outline-none"
                  style={{ colorScheme: "dark" }}
                />
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-[70px] bg-transparent text-xs text-white/80 focus:outline-none"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </label>

            {/* Return date + time */}
            <label className="lg:col-span-3 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/70">Return date & time</span>
                <span className="text-xs">📅</span>
              </div>
              <div className="mt-1 flex gap-1">
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-sm text-white focus:outline-none"
                  style={{ colorScheme: "dark" }}
                />
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-[70px] bg-transparent text-xs text-white/80 focus:outline-none"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </label>

            {/* Search button */}
            <div className="lg:col-span-2 flex flex-col gap-1">
              <button
                onClick={handleSearch}
                className="flex-1 flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition-colors"
              >
                Search
              </button>
              {hasDateSelected && (
                <button
                  onClick={handleBookAll}
                  className="flex-1 flex items-center justify-center rounded-xl bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition-colors"
                >
                  💾 Save Booking
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Category pills ──────────────────────────────────────── */}
        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className="rounded-full border px-4 py-2 text-xs transition-all"
              style={{
                borderColor: activeCategory === c ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)",
                background: activeCategory === c ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                color: activeCategory === c ? "white" : "rgba(255,255,255,0.7)",
                fontWeight: activeCategory === c ? "600" : "400",
              }}
            >
              {c}
              {activeCategory === c && c !== "All" && (
                <span className="ml-1 opacity-60">
                  ({cars.filter((x) => x.category === c).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ── Results section ─────────────────────────────────────── */}
      <section id="results-section" className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Sidebar filters */}
        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sticky top-4">
            <h2 className="text-sm font-semibold">Filter</h2>
            <p className="mt-0.5 text-xs text-white/50">
              {filtered.length} of {cars.length} cars match
            </p>

            <div className="mt-4 space-y-2">
              <FilterChip
                active={filterAuto}
                onClick={() => { setFilterAuto(!filterAuto); setFilterManual(false); }}
                label="⚙️ Automatic"
              />
              <FilterChip
                active={filterManual}
                onClick={() => { setFilterManual(!filterManual); setFilterAuto(false); }}
                label="⚙️ Manual"
              />
              <FilterChip
                active={filterUnlimited}
                onClick={() => setFilterUnlimited(!filterUnlimited)}
                label="🛣️ Unlimited mileage"
              />
              <FilterChip
                active={filterFeatured}
                onClick={() => setFilterFeatured(!filterFeatured)}
                label="⭐ Top picks only"
              />
            </div>

            {(filterAuto || filterManual || filterUnlimited || filterFeatured || activeCategory !== "All") && (
              <button
                onClick={() => {
                  setFilterAuto(false);
                  setFilterManual(false);
                  setFilterUnlimited(false);
                  setFilterFeatured(false);
                  setActiveCategory("All");
                }}
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                ✕ Clear all filters
              </button>
            )}

            {/* Quick book panel when dates selected */}
            {hasDateSelected && (
              <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3">
                <div className="text-xs font-semibold text-emerald-300">Dates selected</div>
                <div className="mt-1 text-xs text-white/70">
                  {pickupDate} {pickupTime} → {returnDate} {returnTime}
                </div>
                <button
                  onClick={handleBookAll}
                  className="mt-2 w-full rounded-xl bg-emerald-400 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition-colors"
                >
                  💾 Save Booking
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Car list */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/80">
              Showing{" "}
              <span className="text-white font-semibold">{filtered.length}</span>{" "}
              {filtered.length !== cars.length && (
                <span className="text-white/50">of {cars.length} </span>
              )}
              cars in <span className="text-white font-semibold">{city}</span>
            </div>
            <Link
              href="/fleet"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 hover:text-white"
            >
              View all Morocco
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <div className="text-2xl">🔍</div>
              <div className="mt-2 text-sm text-white/70">No cars match your filters.</div>
              <button
                onClick={() => {
                  setFilterAuto(false);
                  setFilterManual(false);
                  setFilterUnlimited(false);
                  setFilterFeatured(false);
                  setActiveCategory("All");
                }}
                className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 hover:text-white hover:bg-white/10"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {filtered.map((car) => (
                <article
                  key={car.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur hover:border-white/20 transition-colors"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Image */}
                    <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/0 sm:h-36 sm:w-52 flex-shrink-0">
                      {car.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={car.imageUrl}
                          alt={car.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center text-white/50 text-xs">
                          (Car image)
                        </div>
                      )}
                      {car.featured && (
                        <div className="absolute top-2 left-2 rounded-full bg-sky-400/90 px-2 py-0.5 text-[10px] font-semibold text-slate-950">
                          ⭐ Top Pick
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">{car.name}</h3>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/60">
                            {car.category}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/70">
                          <InfoChip>👤 {car.seats} seats</InfoChip>
                          <InfoChip>🧳 {car.bags}</InfoChip>
                          <InfoChip>⚙️ {car.transmission}</InfoChip>
                          <InfoChip>⛽ {car.fuel}</InfoChip>
                          <InfoChip>🛣️ {car.mileage}</InfoChip>
                        </div>
                      </div>

                      {/* Price + actions */}
                      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <div className="text-xs text-white/50">Price per day</div>
                          <div className="text-2xl font-semibold">
                            MAD {car.pricePerDay}
                            <span className="text-sm font-normal text-white/50">/day</span>
                          </div>
                          {hasDateSelected && (
                            <div className="text-xs text-emerald-300 mt-0.5">
                              Dates selected ✓
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={buildBookingUrl(car.slug)}
                            className="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition-colors"
                          >
                            💾 Book Now
                          </Link>
                          <Link
                            href={`/car/${car.slug}`}
                            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 transition-colors"
                          >
                            View deal
                          </Link>
                          <a
                            href={buildWaUrl(car.name)}
                            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 transition-colors"
                          >
                            💬 WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ─── Small components ────────────────────────────────────────────────────────

function TrustPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur text-sm">
      {children}
    </span>
  );
}

function InfoChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{children}</span>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition-all text-left"
      style={{
        borderColor: active ? "rgba(52,211,153,0.5)" : "rgba(255,255,255,0.1)",
        background: active ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.05)",
        color: active ? "#6ee7b7" : "rgba(255,255,255,0.7)",
      }}
    >
      <span
        className="h-3.5 w-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center text-[9px]"
        style={{
          borderColor: active ? "#34d399" : "rgba(255,255,255,0.2)",
          background: active ? "#34d399" : "transparent",
          color: "#0f172a",
        }}
      >
        {active ? "✓" : ""}
      </span>
      {label}
    </button>
  );
}
