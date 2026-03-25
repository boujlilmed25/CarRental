import { cookies } from "next/headers";
import { COOKIE_NAME, verifyAdminToken } from "./auth";

export async function requireAdmin() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) throw new Error("UNAUTHORIZED");
  await verifyAdminToken(token);
}
