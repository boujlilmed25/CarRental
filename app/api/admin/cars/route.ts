import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";
import { validateCarInput } from "@/lib/carAdminValidation";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const cars = await prisma.car.findMany({ orderBy: [{ createdAt: "desc" }] });
  return NextResponse.json({ cars });
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = validateCarInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Validation failed", fieldErrors: parsed.errors }, { status: 400 });
  }

  try {
    const car = await prisma.car.create({ data: parsed.data });
    return NextResponse.json({ ok: true, car });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug already exists.", fieldErrors: { slug: "Slug already exists." } },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Unable to create car right now." }, { status: 500 });
  }
}
