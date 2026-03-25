import { getSettings } from "@/lib/settings";

export default async function WhatsAppFloating() {
  const s = await getSettings(["wa_number", "wa_message_floating", "site_name"]);
  const waNumber = s.wa_number || "212641750719";
  const msg = s.wa_message_floating || "Salam! bghit n3ref prices w availability. City: ... Dates: ...";
  const siteName = s.site_name || "BoujlilCar";
  const href = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;

  return (
    <a
      href={href}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-white/60"
    >
      💬 WhatsApp <span className="hidden sm:inline text-slate-900/70">{siteName}</span>
    </a>
  );
}
