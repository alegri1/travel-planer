import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export default [
  // Public routes
  route("login", "./routes/login.tsx"),
  route("api/auth/login", "./routes/api.auth.login.ts"),
  route("api/auth/logout", "./routes/api.auth.logout.ts"),

  // Auth-protected layout
  layout("./routes/_auth.tsx", [
    route("/", "./routes/_auth.dashboard.tsx", { id: "dashboard" }),
    route("trips/:id", "./routes/_auth.trips.$id.tsx"),
  ]),

  // API resource routes (protected by cookie check in each route)
  route("api/flights/search", "./routes/api.flights.search.ts"),
  route("api/trips", "./routes/api.trips.ts"),
  route("api/trips/:id", "./routes/api.trips.$id.ts"),
  route("api/trips/:id/activities", "./routes/api.trips.$id.activities.ts"),
  route("api/trips/:id/activities/:actId", "./routes/api.trips.$id.activities.$actId.ts"),
] satisfies RouteConfig;
