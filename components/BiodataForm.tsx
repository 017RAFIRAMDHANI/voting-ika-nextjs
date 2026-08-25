"use client";

import { useState, type FormEvent } from "react";
import LoadingButton from "@/components/LoadingButton";

const years = Array.from({ length: 2021 - 1978 + 1 }, (_, index) => 1978 + index);

export default function BiodataForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/biodata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({ name: form.get("name"), cohort: form.get("cohort") })
      });
      const result = (await response.json().catch(() => ({
        ok: false,
        message: `Server mengembalikan respons yang tidak valid (${response.status}).`
      }))) as { ok: boolean; message?: string; redirectTo?: string };
      if (!response.ok) throw new Error(result.message || "Biodata gagal disimpan.");
      window.location.replace(result.redirectTo || "/pemilihan");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Biodata gagal disimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label fw-bold">Nama</label>
        <input type="text" className="form-control" id="name" name="name" required />
      </div>
      <div className="mb-3">
        <label htmlFor="cohort" className="form-label fw-bold">Tahun Angkatan</label>
        <select className="form-control" id="cohort" name="cohort" required defaultValue="">
          <option value="" disabled>Pilih Tahun Angkatan</option>
          {years.map((year) => <option value={year} key={year}>{year}</option>)}
        </select>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="text-center">
        <LoadingButton busy={busy} type="submit" className="btn btn-primary fw-bold px-4 py-2">
          Submit
        </LoadingButton>
      </div>
    </form>
  );
}
