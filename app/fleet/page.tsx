import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

export default async function FleetPage() {
  const [cars, s] = await Promise.all([
    prisma.car.findMany({ where: { active: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }] }),
    getSettings(["fleet_title", "fleet_subtitle"]),
  ]);

  return (
    <SiteShell>
      <WhatsAppFloating />
      <div className="mt-8">
        <h1 className="text-2xl font-semibold">{s.fleet_title || "Fleet"}</h1>
        <p className="mt-1 text-sm text-white/70">{s.fleet_subtitle || "Browse our cars available across Morocco."}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/car/${car.slug}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="h-14 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5 flex-shrink-0">
                  {car.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={car.imageUrl} alt={car.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[10px] text-white/50">(image)</div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold">{car.name}</div>
                  <div className="mt-1 text-xs text-white/60">
                    {car.category} • {car.city} • {car.transmission}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-lg font-semibold">MAD {car.pricePerDay}/day</div>
              <div className="mt-1 text-xs text-emerald-200/90">WhatsApp confirmation</div>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
