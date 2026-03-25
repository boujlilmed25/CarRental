import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_FOLDERS = ["uploads", "slides"] as const;
type Folder = (typeof ALLOWED_FOLDERS)[number];

export async function POST(req: Request) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = form.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ error: "Missing file" }, { status: 400 });

  // Optional folder param: "uploads" (default) or "slides"
  const folderParam = (form.get("folder") as string | null) ?? "uploads";
  const folder: Folder = ALLOWED_FOLDERS.includes(folderParam as Folder)
    ? (folderParam as Folder)
    : "uploads";

  const bytes = await (file as File).arrayBuffer();
  const buffer = Buffer.from(bytes);

  const destDir = path.join(process.cwd(), "public", folder);
  await mkdir(destDir, { recursive: true });

  const original = (file as File).name || "upload";
  const ext = original.includes(".") ? "." + original.split(".").pop()!.toLowerCase() : "";
  const safeBase = original.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 50);
  const filename = `${Date.now()}_${Math.random().toString(16).slice(2)}_${safeBase}`;

  const filepath = path.join(destDir, filename);
  await writeFile(filepath, buffer);

  const url = `/${folder}/${filename}`;
  return NextResponse.json({ ok: true, url });
}
