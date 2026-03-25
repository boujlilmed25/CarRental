import { cookies } from "next/headers";
import { type Lang, DEFAULT_LANG, SUPPORTED_LANGS } from "./translations";

export const LANG_COOKIE = "boujlilcar-lang";

/** Read language from cookie (server-side) */
export function getLang(): Lang {
  try {
    const cookieStore = cookies();
    const val = cookieStore.get(LANG_COOKIE)?.value as Lang | undefined;
    if (val && SUPPORTED_LANGS.includes(val)) return val;
  } catch {
    // cookies() throws outside of a request context
  }
  return DEFAULT_LANG;
}

export { type Lang, DEFAULT_LANG, SUPPORTED_LANGS, RTL_LANGS } from "./translations";
