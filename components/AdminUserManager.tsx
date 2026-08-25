"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import LoadingButton from "@/components/LoadingButton";
import type { AdminUserRecord, UserRole } from "@/lib/types";

const emptyForm = { id: 0, userId: "", displayName: "", password: "", role: "Alumni" as UserRole };

export default function AdminUserManager({ users, currentUserId }: { users: AdminUserRecord[]; currentUserId: number }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const needle = search.toLowerCase().trim();
    return needle
      ? users.filter((user) => [user.userId, user.displayName, user.role]
          .filter(Boolean).some((value) => value!.toLowerCase().includes(needle)))
      : users;
  }, [search, users]);

  function edit(user: AdminUserRecord) {
    setForm({ id: user.id, userId: user.userId, displayName: user.displayName, password: "", role: user.role });
    setMessage(""); setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(form.id ? `/api/admin/users/${form.id}` : "/api/admin/users", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Akun gagal disimpan.");
      setMessage(form.id ? "Akun berhasil diperbarui." : "Akun berhasil ditambahkan.");
      setForm(emptyForm); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Akun gagal disimpan."); }
    finally { setBusy(false); }
  }

  async function action(url: string, method: "POST" | "DELETE", confirmText: string) {
    if (!window.confirm(confirmText)) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch(url, { method });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Tindakan gagal.");
      setMessage("Perubahan berhasil disimpan."); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Tindakan gagal."); }
    finally { setBusy(false); }
  }

  return (
    <>
      <div className="card mb-4">
        <h5 className="card-header">{form.id ? "Edit Akun" : "Tambah Akun"}</h5>
        <div className="card-body">
          <form className="row g-3" onSubmit={submit}>
            <div className="col-md-3"><label className="form-label">User ID</label><input className="form-control" required value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} /></div>
            <div className="col-md-3"><label className="form-label">Nama Pengguna</label><input className="form-control" required value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} /></div>
            <div className="col-md-3"><label className="form-label">Jabatan</label><select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}><option>Alumni</option><option>Admin</option></select></div>
            <div className="col-md-3"><label className="form-label">Password {form.id && "(kosongkan jika tetap)"}</label><input type="password" className="form-control" required={!form.id} minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div className="col-12 d-flex gap-2">
              <LoadingButton busy={busy} type="submit" className="btn btn-primary">{form.id ? "Simpan Perubahan" : "Tambah Akun"}</LoadingButton>
              {form.id > 0 && <button type="button" className="btn btn-outline-secondary" onClick={() => setForm(emptyForm)}>Batal</button>}
            </div>
          </form>
          {message && <div className="alert alert-success mt-3 mb-0">{message}</div>}
          {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex flex-wrap justify-content-between gap-3 align-items-center">
          <h5 className="mb-0">Daftar Akun</h5>
          <input className="form-control search-input" placeholder="Cari akun..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="table-responsive text-nowrap">
          <table className="table"><thead><tr><th>#</th><th>User ID</th><th>Nama</th><th>Jabatan</th><th>Biodata</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>{filtered.map((user, index) => <tr key={user.id}>
              <td>{index + 1}</td><td>{user.userId}</td><td>{user.displayName}</td><td><span className="badge bg-label-primary">{user.role}</span></td>
              <td>-</td><td>{user.hasVoted ? <span className="badge bg-success">Sudah memilih</span> : <span className="badge bg-warning">Belum memilih</span>}</td>
              <td><div className="d-flex gap-1">
                <button className="btn btn-sm btn-info" type="button" onClick={() => edit(user)}><i className="bx bx-edit" /></button>
                {user.hasVoted && <button className="btn btn-sm btn-warning" type="button" disabled={busy} onClick={() => action(`/api/admin/users/${user.id}/reset-vote`, "POST", `Reset pilihan ${user.displayName}? Jumlah suara kandidat akan dikurangi.`)}><i className="bx bx-reset" /></button>}
                <button className="btn btn-sm btn-danger" type="button" disabled={busy || user.id === currentUserId} onClick={() => action(`/api/admin/users/${user.id}`, "DELETE", `Hapus akun ${user.displayName} beserta biodatanya?`)}><i className="bx bx-trash" /></button>
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
