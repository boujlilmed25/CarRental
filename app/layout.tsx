import "./globals.css";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { getLang, type Lang, RTL_LANGS } from "@/lib/i18n";
import { buildGoogleFontsUrl, getFontDef, DEFAULT_HEADING_FONT, DEFAULT_BODY_FONT } from "@/lib/fonts";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings(["seo_title", "seo_description"]);
  return {
    title: s.seo_title || "BoujlilCar • Car Rental Morocco",
    description: s.seo_description || "Premium car rental across Morocco — WhatsApp-first booking.",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [s, lang] = await Promise.all([
    getSettings(["heading_font", "body_font", "heading_letter_spacing", "body_letter_spacing"]),
    Promise.resolve(getLang()),
  ]);

  const headingKey = s.heading_font || DEFAULT_HEADING_FONT;
  const bodyKey = s.body_font || DEFAULT_BODY_FONT;
  const hf = getFontDef(headingKey);
  const bf = getFontDef(bodyKey);
  const fontsUrl = buildGoogleFontsUrl(headingKey, bodyKey);
  const dir = (RTL_LANGS as Lang[]).includes(lang) ? "rtl" : "ltr";

  const cssVars = `
    :root {
      --font-heading: ${hf?.cssVar ?? "'Playfair Display', Georgia, serif"};
      --font-body: ${bf?.cssVar ?? "'DM Sans', system-ui, sans-serif"};
      --ls-heading: ${s.heading_letter_spacing || "-0.01em"};
      --ls-body: ${s.body_letter_spacing || "0em"};
    }
    body { font-family: var(--font-body); letter-spacing: var(--ls-body); }
    h1, h2, h3, h4, h5 { font-family: var(--font-heading); letter-spacing: var(--ls-heading); }
  `.trim();

  return (
    <html lang={lang} dir={dir}>
      <head>
        {fontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            {/* eslint-disable-next-line @next/next/no-page-custom-font */}
            <link href={fontsUrl} rel="stylesheet" />
          </>
        )}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
