"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import LoadingButton from "@/components/LoadingButton";
import { mediaUrl } from "@/lib/media";
import type { Candidate } from "@/lib/types";

const empty = { id: 0, name: "", cohort: "", occupation: "", vision: "", mission: "", featuredProgram: "" };

export default function CandidateManager({ candidates }: { candidates: Candidate[] }) {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function edit(candidate: Candidate) {
    setForm({ id: candidate.id, name: candidate.name, cohort: candidate.cohort, occupation: candidate.occupation, vision: candidate.vision, mission: candidate.mission, featuredProgram: candidate.featuredProgram });
    setMessage(""); setError(""); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    const payload = new FormData(event.currentTarget);
    try {
      const response = await fetch(form.id ? `/api/candidates/${form.id}` : "/api/candidates", { method: form.id ? "PATCH" : "POST", body: payload });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Kandidat gagal disimpan.");
      setMessage(form.id ? "Kandidat berhasil diperbarui." : "Kandidat berhasil ditambahkan.");
      setForm(empty); event.currentTarget.reset(); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Kandidat gagal disimpan."); }
    finally { setBusy(false); }
  }

  async function remove(candidate: Candidate) {
    if (!window.confirm(`Hapus kandidat ${candidate.name}?`)) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/candidates/${candidate.id}`, { method: "DELETE" });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Kandidat gagal dihapus.");
      setMessage("Kandidat berhasil dihapus."); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Kandidat gagal dihapus."); }
    finally { setBusy(false); }
  }

  return <>
    <div className="card mb-4"><h5 className="card-header">{form.id ? "Edit Calon Ketua" : "Tambah Calon Ketua"}</h5><div className="card-body">
      <form className="row g-3" onSubmit={submit} key={form.id}>
        <div className="col-md-6"><label className="form-label">Nama Calon</label><input name="name" className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="col-md-3"><label className="form-label">Tahun Angkatan</label><input name="cohort" className="form-control" required pattern="[0-9]{4}" value={form.cohort} onChange={(e) => setForm({ ...form, cohort: e.target.value })} /></div>
        <div className="col-md-3"><label className="form-label">Foto {form.id && "(opsional)"}</label><input name="image" type="file" accept="image/*" className="form-control" required={!form.id} /></div>
        <div className="col-12"><label className="form-label">Pekerjaan</label><input name="occupation" className="form-control" required value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} /></div>
        <div className="col-md-4"><label className="form-label">Visi</label><textarea name="vision" className="form-control" rows={8} required value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} /></div>
        <div className="col-md-4"><label className="form-label">Misi</label><textarea name="mission" className="form-control" rows={8} required value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} /></div>
        <div className="col-md-4"><label className="form-label">Program Unggulan</label><textarea name="featuredProgram" className="form-control" rows={8} required value={form.featuredProgram} onChange={(e) => setForm({ ...form, featuredProgram: e.target.value })} /></div>
        <div className="col-12 d-flex gap-2"><LoadingButton busy={busy} className="btn btn-primary" type="submit">{form.id ? "Simpan Perubahan" : "Tambah Calon"}</LoadingButton>{form.id > 0 && <button className="btn btn-outline-secondary" type="button" onClick={() => setForm(empty)}>Batal</button>}</div>
      </form>{message && <div className="alert alert-success mt-3 mb-0">{message}</div>}{error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
    </div></div>
    <div className="card"><div className="card-header"><h5 className="mb-0">Daftar Calon Ketua IKA AN/AP</h5></div><div className="table-responsive text-nowrap"><table className="table"><thead><tr><th>#</th><th>Foto</th><th>Nama</th><th>Angkatan</th><th>Suara</th><th>Aksi</th></tr></thead><tbody>
      {candidates.map((candidate, index) => <tr key={candidate.id}><td>{index + 1}</td><td><img src={mediaUrl(candidate.image)} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: "50%" }} /></td><td>{candidate.name}</td><td>{candidate.cohort}</td><td><span className="badge bg-success">{candidate.votes}</span></td><td><div className="d-flex gap-1"><button className="btn btn-sm btn-info" type="button" onClick={() => edit(candidate)}><i className="bx bx-edit" /></button><button className="btn btn-sm btn-danger" type="button" disabled={busy} onClick={() => remove(candidate)}><i className="bx bx-trash" /></button></div></td></tr>)}
    </tbody></table></div></div>
  </>;
}
