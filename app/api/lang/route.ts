import { NextResponse } from "next/server";
import { SUPPORTED_LANGS, type Lang } from "@/lib/translations";
import { LANG_COOKIE } from "@/lib/i18n";

export async function POST(req: Request) {
  const { lang } = await req.json().catch(() => ({}));
  if (!lang || !SUPPORTED_LANGS.includes(lang as Lang)) {
    return NextResponse.json({ error: "Invalid lang" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(LANG_COOKIE, lang as string, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
  return res;
}
