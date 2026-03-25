import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";

// Format a date string "2026-03-01" → "01/03/2026"
function fmtDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { name, phone, city, carSlug, pickupDate, returnDate, notes } = body;

  if (!name || !phone || !city || !carSlug || !pickupDate || !returnDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const car = await prisma.car.findUnique({ where: { slug: carSlug } });
  if (!car) return NextResponse.json({ error: "Car not found" }, { status: 404 });

  const booking = await prisma.booking.create({
    data: { name, phone, city, carSlug, pickupDate, returnDate, notes: notes || "" },
  });

  // Calculate duration & total
  const a = new Date(pickupDate).getTime();
  const b = new Date(returnDate).getTime();
  const days = Math.max(1, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
  const total = days * car.pricePerDay;

  // Short booking reference (last 8 chars)
  const ref = booking.id.slice(-8).toUpperCase();

  // ── VIP Darija message ──────────────────────────────────────────────────────
  const lines = [
    `🌟 *BoujlilCar — طلب حجز*`,
    ``,
    `السلام عليكم ورحمة الله 👋`,
    ``,
    `بغيت نحجز هاد السيارة، عافاك شوف:`,
    ``,
    `🚗 *السيارة :*  ${car.name}`,
    `📍 *المدينة :*  ${city}`,
    `📅 *الاستلام :*  ${fmtDate(pickupDate)}`,
    `🏁 *الإرجاع  :*  ${fmtDate(returnDate)}`,
    `⏳ *المدة    :*  ${days} يوم`,
    `💰 *الإجمالي :*  ${total.toLocaleString("fr-MA")} درهم`,
    `👤 *الاسم    :*  ${name}`,
    `📞 *الهاتف   :*  ${phone}`,
    ...(notes ? [`📝 *ملاحظة   :*  ${notes}`] : []),
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `🆔 مرجع الحجز : #${ref}`,
    `━━━━━━━━━━━━━━━━━━`,
    ``,
    `شكراً بزاف — كنتسنى ردكم بسرعة 🙏`,
  ];

  const msg = lines.join("\n");

  const waNumber = (await getSetting("wa_number")) || "212641750719";
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

  return NextResponse.json({ ok: true, bookingId: booking.id, whatsappUrl });
}
