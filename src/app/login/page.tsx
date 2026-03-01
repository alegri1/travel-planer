"use client";

import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const password = new FormData(form).get("password") as string;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      setError("Wrong password");
    }
  }

  return (
    <main className="bg-zinc-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <h1 className="text-2xl font-bold text-zinc-900 text-center mb-6">
          Travel Planner
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" className="w-full justify-center">
            Log in
          </Button>
        </form>
      </div>
    </main>
  );
}
