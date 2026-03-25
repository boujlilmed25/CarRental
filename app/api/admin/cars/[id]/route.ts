import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";
import { validateCarInput } from "@/lib/carAdminValidation";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const parsed = validateCarInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: "Validation failed", fieldErrors: parsed.errors }, { status: 400 });
  }

  try {
    const car = await prisma.car.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, car });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Car not found." }, { status: 404 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug already exists.", fieldErrors: { slug: "Slug already exists." } },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Unable to update car right now." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    await prisma.car.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Car not found." }, { status: 404 });
    }

    return NextResponse.json({ error: "Unable to delete car right now." }, { status: 500 });
  }
}
