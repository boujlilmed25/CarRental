import SiteShell from "@/components/SiteShell";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import { getSettings } from "@/lib/settings";

export default async function ContactPage() {
  const s = await getSettings([
    "contact_title",
    "contact_subtitle",
    "contact_wa_btn",
    "contact_call_btn",
    "contact_phone",
    "contact_phone_display",
    "wa_number",
    "wa_message_book",
  ]);

  const waNumber = s.wa_number || "212641750719";
  const wa = (m: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(m)}`;
  const phone = s.contact_phone || "0641750719";
  const phoneDisplay = s.contact_phone_display || phone;
  const waBtnText = s.contact_wa_btn || "WhatsApp us";
  const callBtnText = s.contact_call_btn || "Call";

  return (
    <SiteShell>
      <WhatsAppFloating />
      <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
        <h1 className="text-2xl font-semibold">{s.contact_title || "Contact"}</h1>
        <p className="mt-1 text-sm text-white/70">{s.contact_subtitle || "Fastest way: WhatsApp."}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={wa(s.wa_message_book || "Salam BoujlilCar, bghit n3ref lprices w availability.")}
            className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
          >
            {waBtnText}
          </a>
          <a
            href={`tel:${phone}`}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
          >
            {callBtnText} {phoneDisplay}
          </a>
        </div>
      </div>
    </SiteShell>
  );
}
