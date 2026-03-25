import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

const bookingSelect = {
  id: true,
  name: true,
  phone: true,
  city: true,
  carSlug: true,
  pickupDate: true,
  returnDate: true,
  notes: true,
  status: true,
  createdAt: true,
} as const;

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      select: bookingSelect,
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }
}
