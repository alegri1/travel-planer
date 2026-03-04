import { COOKIE_NAME } from "@/lib/auth";

export async function action() {
  const secure = process.env.NODE_ENV === "production";
  const cookie = `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure ? "; Secure" : ""}`;

  return Response.json({ ok: true }, {
    headers: { "Set-Cookie": cookie },
  });
}
