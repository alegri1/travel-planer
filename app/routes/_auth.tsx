import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/_auth";
import { COOKIE_NAME, verifyToken } from "@/lib/auth";

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c): [string, string] => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")];
    }),
  );

  const token = cookies[COOKIE_NAME];
  if (!token || !(await verifyToken(token))) {
    throw redirect("/login");
  }

  return null;
}

export default function AuthLayout() {
  return <Outlet />;
}
