import AdminShell from "../_ui/AdminShell";
import { prisma } from "@/lib/prisma";
import AnalyticsClient from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const [
    bookingsByStatus,
    bookingsByCity,
    bookingsByCar,
    carsByCategory,
    totalCars,
    activeCars,
    totalBookings,
  ] = await Promise.all([
    prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.booking.groupBy({
      by: ["city"],
      _count: { city: true },
      orderBy: { _count: { city: "desc" } },
    }),
    prisma.booking.groupBy({
      by: ["carSlug"],
      _count: { carSlug: true },
      orderBy: { _count: { carSlug: "desc" } },
      take: 5,
    }),
    prisma.car.groupBy({
      by: ["category"],
      _count: { category: true },
    }),
    prisma.car.count(),
    prisma.car.count({ where: { active: true } }),
    prisma.booking.count(),
  ]);

  return (
    <AdminShell>
      <AnalyticsClient
        data={{
          bookingsByStatus: bookingsByStatus.map(({ status, _count }) => ({
            status,
            count: _count.status,
          })),
          bookingsByCity: bookingsByCity.map(({ city, _count }) => ({
            city,
            count: _count.city,
          })),
          bookingsByCar: bookingsByCar.map(({ carSlug, _count }) => ({
            carSlug,
            count: _count.carSlug,
          })),
          carsByCategory: carsByCategory.map(({ category, _count }) => ({
            category,
            count: _count.category,
          })),
          totalCars,
          activeCars,
          totalBookings,
        }}
      />
    </AdminShell>
  );
}
