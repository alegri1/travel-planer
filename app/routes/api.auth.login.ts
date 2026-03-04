import type { Route } from "./+types/api.auth.login";
import { createToken, COOKIE_NAME } from "@/lib/auth";

export async function action({ request }: Route.ActionArgs) {
  const { password } = await request.json();
  const expected = process.env.LOGIN_PASSWORD;

  if (!password || password !== expected) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createToken();
  const secure = process.env.NODE_ENV === "production";
  const cookie = `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Path=/${secure ? "; Secure" : ""}`;

  return Response.json({ ok: true }, {
    headers: { "Set-Cookie": cookie },
  });
}
