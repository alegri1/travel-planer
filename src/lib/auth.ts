export const COOKIE_NAME = "auth_token";
const PAYLOAD = "travel-planer-auth";

const encoder = new TextEncoder();

async function hmacSha256(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createToken(): Promise<string> {
  const secret = process.env.LOGIN_PASSWORD;
  if (!secret) throw new Error("LOGIN_PASSWORD env var is not set");
  return hmacSha256(secret, PAYLOAD);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const expected = await createToken();
    if (token.length !== expected.length) return false;
    // Constant-time comparison
    let result = 0;
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return result === 0;
  } catch {
    return false;
  }
}
