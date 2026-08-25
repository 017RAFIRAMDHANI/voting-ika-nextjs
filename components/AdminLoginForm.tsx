"use client";

import { useState, type FormEvent } from "react";
import LoadingButton from "@/components/LoadingButton";

export default function AdminLoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ userId: form.get("userId"), password: form.get("password") })
      });
      const result = (await response.json().catch(() => ({
        ok: false,
        message: `Server mengembalikan respons yang tidak valid (${response.status}).`
      }))) as { ok: boolean; message?: string; redirectTo?: string };
      if (!response.ok) throw new Error(result.message || "Login administrator gagal.");
      window.location.replace(result.redirectTo || "/admin");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login administrator gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="mb-3">
        <label htmlFor="adminUserId" className="form-label">User ID Administrator</label>
        <input type="text" id="adminUserId" className="form-control" name="userId" required autoFocus autoComplete="username" />
      </div>
      <div className="mb-3 form-password-toggle">
        <label htmlFor="adminPassword" className="form-label">Password</label>
        <input type="password" id="adminPassword" className="form-control" name="password" required autoComplete="current-password" />
      </div>
      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
      <div className="mb-3">
        <LoadingButton busy={busy} className="btn btn-primary d-grid w-100" type="submit">
          Masuk Administrator
        </LoadingButton>
      </div>
    </form>
  );
}
