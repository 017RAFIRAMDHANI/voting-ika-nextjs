"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import type { VoterRecord } from "@/lib/types";

export default function VoterEditForm({ voter }: { voter: VoterRecord }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false); 
  const [message, setMessage] = useState(""); 
  const [error, setError] = useState("");
  
  async function resetVote() { 
    if (!voter.userRecordId || !window.confirm("Reset pilihan pemilih ini? Jumlah suara kandidat akan dikurangi.")) return; 
    setBusy(true); 
    setError(""); 
    try { 
      const response = await fetch(`/api/admin/users/${voter.userRecordId}/reset-vote`, { method: "POST" }); 
      const result = await response.json() as { message?: string }; 
      if (!response.ok) throw new Error(result.message || "Pilihan gagal direset."); 
      setMessage("Hak pilih berhasil direset."); 
      router.refresh(); 
    } catch (caught) { 
      setError(caught instanceof Error ? caught.message : "Pilihan gagal direset."); 
    } finally { 
      setBusy(false); 
    } 
  }
  
  return (
    <div>
      <div className="row">
        <div className="mb-3 col-md-6">
          <label className="form-label">User ID Pengguna</label>
          <input className="form-control" value={voter.userId ?? ""} readOnly />
        </div>
        <div className="mb-3 col-md-6">
          <label className="form-label">Nama Pengguna</label>
          <input className="form-control" value={voter.displayName ?? ""} readOnly />
        </div>
        <div className="mb-3 col-md-12">
          <label className="form-label">Calon Terpilih</label>
          <input className="form-control" value={voter.candidateName ?? "Belum memilih"} readOnly />
        </div>
      </div>
      <div className="d-flex gap-2">
        {voter.hasVoted && (
          <LoadingButton busy={busy} className="btn btn-warning" type="button" onClick={resetVote}>
            Reset Hak Pilih
          </LoadingButton>
        )}
      </div>
      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
