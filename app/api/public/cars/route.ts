import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cars = await prisma.car.findMany({ where: { active: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });
  return NextResponse.json({ cars });
}
