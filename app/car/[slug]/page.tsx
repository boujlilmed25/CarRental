import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import CarBookingSidebar from "./CarBookingSidebar";

export default async function CarDetails({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { city?: string };
}) {
  const [car, s] = await Promise.all([
    prisma.car.findUnique({ where: { slug: params.slug } }),
    getSettings([
      "wa_number",
      "car_detail_delivery_title",
      "car_detail_delivery_text",
      "car_detail_tip",
      "nav_cta_text",
    ]),
  ]);

  if (!car) {
    return (
      <SiteShell>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          Car not found.
        </div>
      </SiteShell>
    );
  }

  const defaultCity = searchParams?.city || car.city;
  const deliveryTitle = s.car_detail_delivery_title || "Delivery";
  const deliveryText =
    s.car_detail_delivery_text ||
    "Airport pickup + delivery anywhere in Morocco. Fast confirmation on WhatsApp.";
  const tipText = s.car_detail_tip || "Tip: Khalli lina message and we'll confirm quickly.";
  const bookBtnText = s.nav_cta_text || "Book on WhatsApp";

  return (
    <SiteShell>
      <WhatsAppFloating />
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* ── Left: car details ─────────────────────────────────── */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
            <Link href="/fleet" className="text-xs text-white/70 hover:text-white">
              ← Back to fleet
            </Link>
            <h1 className="mt-3 text-3xl font-semibold">{car.name}</h1>
            <p className="mt-1 text-sm text-white/70">
              {car.category} • {car.transmission} • {car.city}
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {car.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="grid h-64 w-full place-items-center text-sm text-white/60">
                  (Car image)
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Spec label="Seats" value={`${car.seats}`} />
              <Spec label="Bags" value={car.bags} />
              <Spec label="Fuel" value={car.fuel} />
              <Spec label="Mileage" value={car.mileage} />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <div className="font-semibold text-white">{deliveryTitle}</div>
              <div className="mt-1">{deliveryText}</div>
            </div>
          </div>
        </div>

        {/* ── Right: interactive booking sidebar ────────────────── */}
        <aside className="lg:col-span-4">
          <CarBookingSidebar
            carName={car.name}
            carSlug={car.slug}
            pricePerDay={car.pricePerDay}
            defaultCity={defaultCity}
            waNumber={s.wa_number || "212641750719"}
            bookBtnText={bookBtnText}
            tipText={tipText}
          />
        </aside>
      </div>
    </SiteShell>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
