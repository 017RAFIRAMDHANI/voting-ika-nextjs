"use client";

import { useState, type FormEvent } from "react";
import LoadingButton from "@/components/LoadingButton";

export default function ImportUsersForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/users/import", { method: "POST", body: form });
      const result = (await response.json()) as { ok: boolean; imported?: number; message?: string };
      if (!response.ok) throw new Error(result.message || "Impor gagal.");
      setMessage(`${result.imported ?? 0} akun berhasil diimpor.`);
      event.currentTarget.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impor gagal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} encType="multipart/form-data">
      <label htmlFor="file" className="form-label">Pilih file Excel:</label>
      <input className="form-control mb-3" type="file" name="file" id="file" accept=".xlsx,.csv" required />
      <LoadingButton busy={busy} type="submit" className="btn btn-primary">Import Data</LoadingButton>
      {message && <div className="alert alert-success mt-3" role="status">{message}</div>}
      {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
      <p className="text-muted mt-3 mb-0">Kolom A: User ID. Kolom B: Nama Pengguna. Password awal sama dengan User ID.</p>
    </form>
  );
}
