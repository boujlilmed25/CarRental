import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "boujlilcar_admin";
export const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.AUTH_SECRET!;
  return new TextEncoder().encode(secret);
}

export async function signAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifyAdminToken(token: string) {
  return jwtVerify(token, getSecret());
}
