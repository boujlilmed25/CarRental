import SiteShell from "@/components/SiteShell";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import BookingForm from "./ui";

export default function BookingPage() {
  return (
    <SiteShell>
      <WhatsAppFloating />
      <div className="mt-8">
        <h1 className="text-2xl font-semibold">Booking</h1>
        <p className="mt-1 text-sm text-white/70">Fill details and we&apos;ll confirm on WhatsApp.</p>
        <BookingForm />
      </div>
    </SiteShell>
  );
}
