import AdminShell from "../_ui/AdminShell";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDateKey(value: string) {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return toDateKey(date);
}

export default async function Dashboard() {
  const today = new Date();
  const todayKey = toDateKey(today);
  const inThreeDays = new Date(today);
  inThreeDays.setDate(today.getDate() + 3);
  const upcomingLimitKey = toDateKey(inThreeDays);

  const [
    totalCars,
    activeCars,
    featuredCars,
    totalBookings,
    recentBookings,
    bookingsByStatus,
    openBookings,
  ] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { active: true } }),
    prisma.car.count({ where: { featured: true } }),
    prisma.booking.count(),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.booking.findMany({
      where: { status: { in: ["new", "confirmed"] } },
      orderBy: { pickupDate: "asc" },
      select: {
        id: true,
        name: true,
        phone: true,
        city: true,
        carSlug: true,
        pickupDate: true,
        returnDate: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const byStatus = Object.fromEntries(
    bookingsByStatus.map(({ status, _count }) => [status, _count.status])
  );

  const hiddenCars = Math.max(totalCars - activeCars, 0);
  const openPipeline = (byStatus["new"] ?? 0) + (byStatus["confirmed"] ?? 0);
  const recentWindowStart = new Date(today);
  recentWindowStart.setDate(today.getDate() - 7);

  const recentIntake = recentBookings.filter(
    (booking) => booking.createdAt >= recentWindowStart
  ).length;

  let pickupsToday = 0;
  let returnsToday = 0;
  let overdueReturns = 0;

  const upcomingReservations = openBookings
    .filter((booking) => {
      const pickupKey = normalizeDateKey(booking.pickupDate);
      const returnKey = normalizeDateKey(booking.returnDate);

      if (pickupKey === todayKey) pickupsToday += 1;
      if (returnKey === todayKey) returnsToday += 1;
      if (returnKey && returnKey < todayKey) overdueReturns += 1;

      return !!pickupKey && pickupKey >= todayKey && pickupKey <= upcomingLimitKey;
    })
    .slice(0, 5);

  return (
    <AdminShell>
      <DashboardClient
        data={{
          totalCars,
          activeCars,
          hiddenCars,
          featuredCars,
          totalBookings,
          newBookings: byStatus["new"] ?? 0,
          confirmedBookings: byStatus["confirmed"] ?? 0,
          doneBookings: byStatus["done"] ?? 0,
          canceledBookings: byStatus["canceled"] ?? 0,
          openPipeline,
          recentIntake,
          pickupsToday,
          returnsToday,
          overdueReturns,
          upcomingReservations: upcomingReservations.map((booking) => ({
            ...booking,
            createdAt: booking.createdAt.toISOString(),
          })),
          recentBookings: recentBookings.map((b) => ({
            ...b,
            notes: b.notes ?? undefined,
            createdAt: b.createdAt.toISOString(),
          })),
        }}
      />
    </AdminShell>
  );
}
