import SiteShell from "@/components/SiteShell";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import CityRentClient from "./ui";

function capitalize(s: string) {
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default async function CityRentPage({ params }: { params: { city: string } }) {
  const cityName = decodeURIComponent(params.city).replace(/-/g, " ");
  const prettyCity = capitalize(cityName);

  const [carsRaw, s] = await Promise.all([
    prisma.car.findMany({
      where: { active: true, city: { contains: prettyCity } },
      orderBy: [{ featured: "desc" }, { pricePerDay: "asc" }],
    }),
    getSettings(["wa_number"]),
  ]);

  // Serialize for client component (remove Date objects)
  const cars = carsRaw.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    category: c.category,
    seats: c.seats,
    bags: c.bags,
    transmission: c.transmission,
    fuel: c.fuel,
    mileage: c.mileage,
    pricePerDay: c.pricePerDay,
    city: c.city,
    featured: c.featured,
    imageUrl: c.imageUrl,
  }));

  return (
    <SiteShell>
      <WhatsAppFloating />
      <CityRentClient
        city={prettyCity}
        cars={cars}
        waNumber={s.wa_number || "212641750719"}
      />
    </SiteShell>
  );
}
